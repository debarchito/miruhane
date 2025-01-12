import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

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

export const load: PageServerLoad = async ({ locals, params, fetch }) => {
  if (!locals.session) {
    return redirect(302, "/sign-in");
  }

  const body = await fetch("/api/history/retrieve", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      historyId: params.id,
      cursor: new Date(),
      pageSize: 10,
      direction: "next",
      order: "desc",
    }),
  });

  const res: Response = await body.json();

  return {
    user: locals.user!,
    session: locals.session,
    res: res.res,
    meta: res.meta,
  };
};
