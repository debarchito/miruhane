import type { RequestHandler } from "./$types";
import { SPEECHIFY_KEY } from "$env/static/private";

const headers = {
  "Content-Type": "application/json",
};

export const POST: RequestHandler = async ({ locals, request }) => {
  if (!locals.session) {
    return new Response(
      JSON.stringify({
        res: null,
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
  const text = data.get("text");

  if (!text) {
    return new Response(
      JSON.stringify({
        res: null,
        status: 400,
        message: "No text provided",
      }),
      {
        status: 400,
        headers,
      },
    );
  }

  const res = await fetch("https://api.sws.speechify.com/v1/audio/speech", {
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${SPEECHIFY_KEY}`,
      ...headers,
    },
    method: "POST",
    body: JSON.stringify({
      input: text,
      voice_id: "kristy",
      audio_format: "aac",
    }),
  });

  return new Response(
    JSON.stringify({
      res: await res.json(),
    }),
    {
      status: 200,
      headers,
    },
  );
};
