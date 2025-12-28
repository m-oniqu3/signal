import { z } from "zod";

export const authSchema = z.object({
  email: z.email({ error: "Not a valid email." }).min(1, "Email is required."),

  password: z.string().min(6, "Password must be at least 6 characters."),
});

export type Credentials = z.infer<typeof authSchema>;
