import { env } from "$env/dynamic/private";
import type { RequestHandler } from "./$types";

const headers = {
  "Content-Type": "application/json",
};

export const POST: RequestHandler = async ({ locals, request }) => {
  if (!locals.session) {
    return new Response(
      JSON.stringify({
        text: null,
        status: 403,
        message: "Action not allowed",
      }),
      {
        status: 403,
        headers,
      },
    );
  }

  const data = await request.formData();
  const audio = data.get("audio");

  if (!audio) {
    return new Response(
      JSON.stringify({
        text: null,
        status: 400,
        message: "No audio provided",
      }),
      {
        status: 400,
        headers,
      },
    );
  }

  const res = await fetch("https://api-inference.huggingface.co/models/openai/whisper-base", {
    headers: {
      Authorization: `Bearer ${env.HUGGINGFACE_TOKEN}`,
      ...headers,
    },
    method: "POST",
    body: audio,
  });

  const result = await res.json();

  return new Response(
    JSON.stringify({
      text: result.text,
      status: 200,
      message: "Inference successful",
    }),
    {
      status: 200,
      headers,
    },
  );
};
