import { z } from "zod";
import { db } from "$lib/server/db";
import * as auth from "$lib/server/auth";
import { verify } from "@node-rs/argon2";
import { redirect } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate, message } from "sveltekit-superforms/server";
import type { PageServerLoad, Actions } from "../demo/lucia/login/$types";

const formSchema = z.object({
  // RFC 5321, SMTP Protocol, limits the email address to 254 characters
  email: z.string().email().max(254),
  password: z.string(),
});

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    return redirect(302, "/dashboard");
  }
  const form = await superValidate(zod(formSchema));
  return { form };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event.request, zod(formSchema));

    try {
      const user = await db.query.user.findFirst({
        where: (table, { eq }) => eq(table.email, form.data.email),
      });

      if (!user) {
        return message(form, "Incorrect email or password.", {
          status: 400,
        });
      }

      const isValidPassword = await verify(user.passwordHash, form.data.password, {
        memoryCost: 19456,
        timeCost: 2,
      });

      if (!isValidPassword) {
        return message(form, "Incorrect email or password.", {
          status: 400,
        });
      }

      const token = auth.generateSessionToken();
      const session = await auth.createSession(token, user.id);
      auth.setSessionTokenCookie(event, token, session.expiresAt);

      return redirect(302, "/dashboard");
    } catch (err) {
      console.error(err);
      // TODO: Monitoring and logging integration
      return message(form, "Something went wrong!", {
        status: 500,
      });
    }
  },
};
