import { NextResponse } from "next/server";
import { ZodError } from "zod";

// Consistent success envelope so the frontend never has to guess the shape.
export function ok<T>(data: T, meta?: Record<string, unknown>) {
  return NextResponse.json({ success: true, data, ...(meta ? { meta } : {}) });
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { success: false, error: message, ...(details ? { details } : {}) },
    { status }
  );
}

// Wraps a route handler so malformed input / unexpected errors never produce a 500
// stack-trace leak or a crashed function. This is the "reliability under bad input"
// requirement from the brief, centralized in one place instead of per-route try/catch.
export function withErrorHandling<Args extends unknown[]>(
  handler: (...args: Args) => Promise<Response>
) {
  return async (...args: Args): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (err) {
      if (err instanceof ZodError) {
        return fail("Validation failed", 422, err.flatten());
      }
      console.error("[API ERROR]", err);
      return fail("Internal server error", 500);
    }
  };
}

// Clamp + default pagination params so a malicious/garbage ?page=-50&limit=99999 can't
// be used to dump the whole table or crash the query.
export function parsePagination(searchParams: URLSearchParams) {
  const rawPage = Number(searchParams.get("page"));
  const rawLimit = Number(searchParams.get("limit"));

  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const limit =
    Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(Math.floor(rawLimit), 50) : 12;

  return { page, limit, skip: (page - 1) * limit };
}
