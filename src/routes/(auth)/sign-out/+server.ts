import { redirect } from "@sveltejs/kit";
import * as auth from "$lib/server/auth";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
  if (!event.locals.session) {
    return redirect(302, "/sign-in");
  }

  await auth.invalidateSession(event.locals.session!.id);
  auth.deleteSessionTokenCookie(event);
  event.locals.user = null;
  event.locals.session = null;

  return redirect(302, "/sign-in");
};
