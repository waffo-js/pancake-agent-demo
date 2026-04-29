// Mirrors Pancake's response envelope: { data } on success,
// { data: null, errors: [{ message, layer }] } on failure.

import { NextResponse } from "next/server";

export function ok<T>(data: T, init?: ResponseInit): NextResponse {
  return NextResponse.json({ data }, init);
}

export function fail(
  message: string,
  status = 400,
  layer: string = "mock-result-contract",
): NextResponse {
  return NextResponse.json(
    { data: null, errors: [{ message, layer }] },
    { status },
  );
}
