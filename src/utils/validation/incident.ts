import * as z from "zod";

export const incidentSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters."),
  content: z.string().optional(),
});

export type IncidentFormData = z.infer<typeof incidentSchema>;
