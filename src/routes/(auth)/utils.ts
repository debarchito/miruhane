export function isValidUsername(email: unknown): email is string {
  return (
    typeof email === "string" &&
    email.length >= 3 &&
    email.length <= 32 &&
    /^[a-z0-9_-]+$/.test(email)
  );
}

export function isValidPassword(password: unknown): password is string {
  return typeof password === "string" && password.length >= 8 && password.length <= 32;
}
