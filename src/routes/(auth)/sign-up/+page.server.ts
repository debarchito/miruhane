import { formSchema } from "./schema.js";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate } from "sveltekit-superforms/server";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    return redirect(302, "/chat");
  }
  const form = await superValidate(zod(formSchema));
  return { form };
};
