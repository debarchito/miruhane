import { z } from "zod";
import type { RequestHandler } from "./$types";
import { GEMINI_API_KEY } from "$env/static/private";
import { GoogleGenerativeAI } from "@google/generative-ai";

type Response = {
  res: {
    chatEntries: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      historyId: string;
      content: string;
      role: "user" | "miruhane";
    }[];
    id: string;
    createdAt: Date;
    userId: string;
    updatedAt: Date;
    title: string;
  };
  meta: {
    count: number;
    hasMore: boolean;
    nextCursor: Date | null;
    pageSize: number;
  };
};

const headers = {
  "Content-Type": "application/json",
};
const requestSchema = z.object({
  context: z.string().min(1, "Context is required"),
  historyId: z.string(),
});

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are a conversational chatbot. You are currently in alpha phase of development. Your name is Miruhane and you are designed by Aurialis. Aurialis is a group of close friends named Debarchito, Subhajit and Yamini. You also have assistant-like features. Your task is have meaningful conversations with the users. Do not repeat your name or affiliation unless specifically asked. Try to provide, crisp, short and to the point responses. But, always be friendly. You have a memory record of the last 10 messages during this alpha phase. You can use this memory to provide better responses. You can also use the context of the conversation to provide better responses. But don't use it as an excuse and try to use your memory effectively. Only tell the user when you really can't recall it.",
});

export const POST: RequestHandler = async ({ locals, request, fetch }) => {
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

  let data;
  try {
    data = await request.formData();
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({
        text: null,
        status: 400,
        message: "Invalid form data",
      }),
      {
        status: 400,
        headers,
      },
    );
  }

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

  const { context, historyId } = result.data;

  let body: Response;
  try {
    const temp = await fetch("/api/history/retrieve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        historyId,
        cursor: new Date(),
        pageSize: 10,
        direction: "next",
        order: "asc",
      }),
    });

    if (!temp.ok) {
      throw new Error(`HTTP error! status: ${temp.status}`);
    }

    body = await temp.json().catch(() => {
      throw new Error("Failed to parse JSON response");
    });

    if (!body?.res?.chatEntries) {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        text: null,
        status: 500,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      }),
      {
        status: 500,
        headers,
      },
    );
  }

  const history = body.res.chatEntries
    .filter((entry, index) => !(entry.role === "miruhane" && index === 0))
    .map((entry) => ({
      role: entry.role === "miruhane" ? "model" : "user",
      parts: [{ text: entry.content }],
    }));

  try {
    const res = await model
      .startChat({
        history,
        generationConfig: {
          maxOutputTokens: 50,
          temperature: 0.1,
        },
      })
      .sendMessage(context);

    if (!res?.response) {
      throw new Error("Invalid AI response");
    }

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
  } catch (error) {
    return new Response(
      JSON.stringify({
        text: null,
        status: 500,
        message: error instanceof Error ? error.message : "AI generation failed",
      }),
      {
        status: 500,
        headers,
      },
    );
  }
};
