import { redirect } from "@sveltejs/kit";
import { invalidateSession } from "$lib/server/auth";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) {
    return redirect(302, "/login");
  }

  await invalidateSession(locals.session!.id);
  locals.user = null;
  locals.session = null;

  return redirect(302, "/login");
};
