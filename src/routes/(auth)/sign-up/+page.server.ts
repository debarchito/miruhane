import { hash } from "@node-rs/argon2";
import * as auth from "$lib/server/auth.js";
import isEmail from "validator/lib/isEmail";
import { db } from "$lib/server/db/index.js";
import { redirect, fail } from "@sveltejs/kit";
import * as table from "$lib/server/db/schema.js";
import type { PageServerLoad, Actions } from "./$types";
import { isValidPassword, isValidUsername } from "../utils.js";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.session) {
    return redirect(302, "/chat");
  }
  return {};
};

export const actions: Actions = {
  "sign-up": async (event) => {
    const formData = await event.request.formData();
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm-password");

    // NOTE: NEVER trust the client to send the correct data; always validate

    if (!isValidUsername(username as string)) {
      return fail(400, { message: "Usernames can only contain: a-Z, 0-9, _ and -" });
    }

    if (!isEmail(email as string)) {
      return fail(400, { message: "Invalid email format" });
    }

    if (!isValidPassword(password) && !isValidPassword(confirmPassword)) {
      return fail(400, { message: "Password must be 8-32 characters" });
    }

    if (password !== confirmPassword) {
      return fail(400, { message: "Passwords do not match" });
    }

    try {
      const user = await db.query.user.findFirst({
        where: (table, { eq }) => eq(table.email, email as string),
      });

      if (user) {
        return fail(400, { message: "User already exists." });
      }

      const userId = auth.generateToken();
      const passwordHash = await hash(password as string, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });

      await db.insert(table.user).values({
        id: userId,
        username: username as string,
        email: email as string,
        passwordHash: passwordHash as string,
        createdAt: new Date(),
      });

      const token = auth.generateToken();
      const session = await auth.createSession(token, userId);
      auth.setSessionTokenCookie(event, token, session.expiresAt);

      return redirect(302, "/chat");
    } catch (err) {
      console.error(err);
      // TODO: Monitoring and logging integration
      return fail(500, { message: "Oops...Something went wrong!" });
    }
  },
};
