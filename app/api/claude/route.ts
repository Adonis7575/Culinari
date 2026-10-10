import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 120;

const REQUEST_TIMEOUT_MS = 90_000;
const MAX_PROMPT_CHARS = 12_000;
// Haiku 5.5 by default: recipes are short structured JSON, so speed and cost
// matter more than deep reasoning. Override with ANTHROPIC_MODEL.
const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-5-5";
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1_000;
const RATE_LIMIT_MAX = 60;

// Keeps this route scoped to the app so the API key is not a general-purpose
// Claude proxy for anyone who finds the endpoint.
const SYSTEM_PROMPT = `You are Culinaria's recipe engine. You only create, modify, and explain recipes, meal ideas, ingredients, and cooking techniques. Follow the user's formatting instructions exactly (they usually ask for strict JSON). If a request is unrelated to food or cooking, respond with {"error":"Culinaria can only help with recipes and cooking."} and nothing else.`;

type RateLimitEntry = { count: number; resetsAt: number };
const rateLimits = new Map<string, RateLimitEntry>();

function clientIdentifier(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "unknown";
}

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  for (const [key, entry] of rateLimits) {
    if (entry.resetsAt <= now) rateLimits.delete(key);
  }
  const existing = rateLimits.get(identifier);
  if (!existing || existing.resetsAt <= now) {
    rateLimits.set(identifier, { count: 1, resetsAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  existing.count += 1;
  return existing.count > RATE_LIMIT_MAX;
}

function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("Request timed out")),
      timeoutMs
    );

    promise.then(
      (value) => {
        clearTimeout(timeout);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timeout);
        reject(error);
      }
    );
  });
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "This request was not allowed." }, { status: 403 });
  }

  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Claude API key is not configured." },
        { status: 500 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request: body must be JSON." },
        { status: 400 }
      );
    }

    const prompt = isRecord(body) && typeof body.prompt === "string"
      ? body.prompt.trim()
      : "";

    if (!prompt) {
      return NextResponse.json(
        { error: "Invalid request: prompt is required." },
        { status: 400 }
      );
    }

    if (prompt.length > MAX_PROMPT_CHARS) {
      return NextResponse.json(
        { error: "Prompt is too large." },
        { status: 413 }
      );
    }

    if (isRateLimited(clientIdentifier(req))) {
      return NextResponse.json(
        { error: "Too many recipes were requested recently. Please try again later." },
        { status: 429 }
      );
    }

    const response = await withTimeout(
      client.messages.create({
        model: MODEL,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
      }),
      REQUEST_TIMEOUT_MS
    );

    // Only the text the app needs; no usage or account metadata.
    const content = response.content
      .filter((block) => block.type === "text")
      .map((block) => ({ type: "text", text: block.text }));
    return NextResponse.json({ content, stop_reason: response.stop_reason });
  } catch (error: unknown) {
    console.error("Claude API error:", error);
    const status = error instanceof Error && error.message === "Request timed out"
      ? 504
      : 500;

    return NextResponse.json(
      { error: status === 504 ? "AI request timed out." : "AI generation failed." },
      { status }
    );
  }
}
