import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const REQUEST_TIMEOUT_MS = 45_000;
const MAX_PROMPT_CHARS = 12_000;
const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5";

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

    const response = await withTimeout(
      client.messages.create({
        model: MODEL,
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      }),
      REQUEST_TIMEOUT_MS
    );

    return NextResponse.json(response);
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
