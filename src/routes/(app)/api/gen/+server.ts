import { z } from "zod";
import type { RequestHandler } from "./$types";
import { GEMINI_API_KEY } from "$env/static/private";
import { GoogleGenerativeAI } from "@google/generative-ai";

const headers = {
  "Content-Type": "application/json",
};
const requestSchema = z.object({
  context: z.string().min(1, "Context is required"),
});

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are a conversational chatbot. Your name is Miruhane and you are designed by Aurialis. You also have assistant-like features. Your task is have meaningful conversations with the users. Do not repeat your name or affiliation unless specifically asked. Try to provide, crisp, short and to the point responses. But, always be friendly.",
});

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
  const formData = Object.fromEntries(data);

  const result = requestSchema.safeParse(formData);
  if (!result.success) {
    return new Response(
      JSON.stringify({
        text: null,
        status: 400,
        message: result.error.flatten(),
      }),
      {
        status: 400,
        headers,
      },
    );
  }

  const { context } = result.data;

  const res = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: context,
          },
        ],
      },
    ],
    generationConfig: {
      maxOutputTokens: 50,
      temperature: 0.1,
    },
  });

  return new Response(
    JSON.stringify({
      text: res.response.text(),
      status: 200,
      message: null,
    }),
    {
      status: 200,
      headers,
    },
  );
};
