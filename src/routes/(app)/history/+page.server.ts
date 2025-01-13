import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

type Response = {
  res: {
    id: string;
    createdAt: Date;
    userId: string;
    updatedAt: Date;
    title: string;
  }[];
  meta: {
    count: number;
    hasMore: boolean;
    nextCursor: Date | null;
    pageSize: number;
  };
};

export const load: PageServerLoad = async ({ locals, fetch }) => {
  if (!locals.session) {
    return redirect(302, "/sign-in");
  }

  const body = await fetch("/api/history/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cursor: new Date(),
      pageSize: 5,
      direction: "next",
      order: "desc",
    }),
  });

  const res: Response = await body.json();

  return {
    user: locals.user!,
    session: locals.session,
    history: res.res,
    meta: res.meta,
  };
};
