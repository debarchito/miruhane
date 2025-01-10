import { desc } from "drizzle-orm";
import { db } from "$lib/server/db";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { history } from "$lib/server/db/schema";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.session) {
    return redirect(302, "/sign-in");
  }

  return {
    user: locals.user!,
    session: locals.session,
    settings: await db.query.userSetting.findMany({
      where: (table, { eq }) => eq(table.userId, locals.user!.id),
      columns: {
        key: true,
        value: true,
      },
    }),
    history: await db.query.history.findMany({
      where: (table, { eq }) => eq(table.userId, locals.session!.userId),
      orderBy: [desc(history.updatedAt)],
      limit: 5,
    }),
  };
};
