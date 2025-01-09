import type { RequestHandler } from "./$types";
import { HUGGINGFACE_TOKEN } from "$env/static/private";

export const POST: RequestHandler = async ({ locals, request }) => {
  if (!locals.session) {
    return new Response("Action not allowed", { status: 403 });
  }

  const data = await request.formData();
  const audio = data.get("audio");

  if (!audio) {
    return new Response("No audio file", { status: 400 });
  }

  const res = await fetch("https://api-inference.huggingface.co/models/openai/whisper-base", {
    headers: {
      Authorization: `Bearer ${HUGGINGFACE_TOKEN}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: audio,
  });

  const json = await res.json();
  return new Response(
    JSON.stringify({
      text: json.text,
    }),
  );
};
