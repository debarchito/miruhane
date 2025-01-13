import { env } from "$env/dynamic/private";
import type { RequestHandler } from "./$types";

const headers = {
  "Content-Type": "application/json",
};

export const POST: RequestHandler = async ({ locals, request }) => {
  try {
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

    let data;
    try {
      data = await request.formData();
    } catch (err) {
      console.error(err);
      return new Response(
        JSON.stringify({
          res: null,
          status: 400,
          message: "Invalid form data",
        }),
        {
          status: 400,
          headers,
        },
      );
    }

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

    let res;
    try {
      res = await fetch("https://api.sws.speechify.com/v1/audio/speech", {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${env.SPEECHIFY_KEY}`,
          ...headers,
        },
        method: "POST",
        body: JSON.stringify({
          input: text,
          voice_id: "kristy",
          audio_format: "aac",
        }),
      });

      if (!res.ok) {
        throw new Error(`API responded with status: ${res.status}`);
      }

      const jsonData = await res.json();

      return new Response(
        JSON.stringify({
          res: jsonData,
        }),
        {
          status: 200,
          headers,
        },
      );
    } catch (err) {
      return new Response(
        JSON.stringify({
          res: null,
          status: 500,
          message: err instanceof Error ? err.message : "Internal server error",
        }),
        {
          status: 500,
          headers,
        },
      );
    }
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({
        res: null,
        status: 500,
        message: "Internal server error",
      }),
      {
        status: 500,
        headers,
      },
    );
  }
};
