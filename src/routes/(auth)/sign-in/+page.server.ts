import { db } from "$lib/server/db";
import * as auth from "$lib/server/auth";
import { verify } from "@node-rs/argon2";
import isEmail from "validator/lib/isEmail";
import { isValidPassword } from "../utils.js";
import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.session) {
    return redirect(302, "/chat");
  }
  return {};
};

export const actions: Actions = {
  "sign-in": async (event) => {
    const formData = await event.request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    if (!isEmail(email as string)) {
      return fail(400, { message: "Invalid email format" });
    }

    if (!isValidPassword(password)) {
      return fail(400, { message: "Invalid password format" });
    }

    try {
      const user = await db.query.user.findFirst({
        where: (table, { eq }) => eq(table.email, email as string),
      });

      if (!user) {
        return fail(400, { message: "Incorrect password or email" });
      }

      const isValidPassword = await verify(user.passwordHash, password, {
        memoryCost: 19456,
        timeCost: 2,
      });

      if (!isValidPassword) {
        return fail(400, { message: "Incorrect password or email" });
      }

      const token = auth.generateToken();
      const session = await auth.createSession(token, user.id);
      auth.setSessionTokenCookie(event, token, session.expiresAt);

      return redirect(302, "/chat");
    } catch (err) {
      console.error(err);
      // TODO: Monitoring and logging integration
      return fail(500, { message: "Oops...Something went wrong!" });
    }
  },
};
