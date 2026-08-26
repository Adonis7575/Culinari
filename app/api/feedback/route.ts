import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const MAX_MESSAGE_LENGTH = 1_600;
const MAX_PAGE_LENGTH = 80;
const MAX_URL_LENGTH = 500;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1_000;
const RATE_LIMIT_MAX = 5;

type RateLimitEntry = { count: number; resetsAt: number };
const rateLimits = new Map<string, RateLimitEntry>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, maxLength)
    : "";
}

function isValidEmail(value: string): boolean {
  return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clientIdentifier(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  for (const [key, entry] of rateLimits) {
    if (entry.resetsAt <= now) rateLimits.delete(key);
  }

  if (!rateLimits.has(identifier) && rateLimits.size >= 1_000) {
    const oldestKey = rateLimits.keys().next().value;
    if (oldestKey) rateLimits.delete(oldestKey);
  }

  const existing = rateLimits.get(identifier);

  if (!existing || existing.resetsAt <= now) {
    rateLimits.set(identifier, { count: 1, resetsAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  existing.count += 1;
  rateLimits.set(identifier, existing);
  return existing.count > RATE_LIMIT_MAX;
}

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "This feedback request was not allowed." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Feedback must be sent as JSON." }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ error: "Feedback details are missing." }, { status: 400 });
  }

  // A filled hidden field indicates an automated submission. Return success so
  // bots do not learn how the trap works, but do not send an email.
  if (cleanText(body.website, 200)) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const message = cleanText(body.message, MAX_MESSAGE_LENGTH);
  const email = cleanText(body.email, 254);
  const page = cleanText(body.page, MAX_PAGE_LENGTH).replace(/[\r\n]+/g, " ");
  const url = cleanText(body.url, MAX_URL_LENGTH);

  if (message.length < 3) {
    return NextResponse.json({ error: "Please share at least a few words." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid reply email." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.FEEDBACK_TO_EMAIL;
  const sender = process.env.FEEDBACK_FROM_EMAIL || "Culinaria Feedback <onboarding@resend.dev>";

  if (!apiKey || !recipient) {
    console.error("Feedback email is missing RESEND_API_KEY or FEEDBACK_TO_EMAIL.");
    return NextResponse.json({ error: "Private feedback is not configured yet." }, { status: 503 });
  }

  if (isRateLimited(clientIdentifier(request))) {
    return NextResponse.json({ error: "Too many notes were sent recently. Please try again later." }, { status: 429 });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: sender,
      to: [recipient],
      replyTo: email || undefined,
      subject: `Culinaria feedback${page ? `: ${page}` : ""}`,
      text: [
        "New private feedback from Culinaria",
        "",
        `View: ${page || "Not provided"}`,
        `Page: ${url || "Not provided"}`,
        `Reply email: ${email || "Not provided"}`,
        "",
        "Message",
        message,
      ].join("\n"),
    });

    if (!error) return NextResponse.json({ ok: true });
    console.error("Feedback email delivery failed:", error.name, error.message);
  } catch (deliveryError: unknown) {
    console.error(
      "Feedback email delivery failed:",
      deliveryError instanceof Error ? deliveryError.name : "Unknown error"
    );
  }

  return NextResponse.json(
    { error: "Feedback could not be delivered. Please try again." },
    { status: 502 }
  );
}
