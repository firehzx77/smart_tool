import { CoachResponse } from "./types";

/**
 * Frontend service: calls the Vercel Serverless Function (/api/coach)
 * so the DeepSeek API key never ships to the browser.
 */
export async function getCoachingResponse(
  background: string,
  question: string
): Promise<CoachResponse> {
  const res = await fetch("/api/coach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ background, question }),
  });

  if (!res.ok) {
    // try to surface server error details
    let msg = "请求失败";
    try {
      const data = await res.json();
      msg = data?.error || msg;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  return (await res.json()) as CoachResponse;
}
