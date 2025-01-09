import type { RequestHandler } from "./$types";
import { GEMINI_API_KEY } from "$env/static/private";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are a conversational chatbot. Your name is Miruhane and you are designed by Aurialis. You also have assistant-like features. Your task is have meaningful conversations with the users. Do not repeat your name or affiliation unless specifically asked. Try to provide, crisp, short and to the point responses. But, always be friendly.",
});

export const POST: RequestHandler = async ({ locals, request }) => {
  if (!locals.session) {
    return new Response(null, { status: 403 });
  }

  const data = await request.formData();
  const context = data.get("context");

  if (!context) {
    return new Response(null, { status: 400 });
  }

  const res = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: context as string,
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
    }),
  );
};
