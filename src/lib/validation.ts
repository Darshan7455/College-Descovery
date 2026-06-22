import { z } from "zod";

// Browser forms submit empty/unset fields as "" (e.g. a <select> left on "Any type").
// An empty string fails z.enum().optional() validation (it's not a valid enum value and
// not literally undefined), which previously caused the WHOLE query object to fail
// validation and silently fall back to "no filters at all". Strip blanks first so an
// unset field behaves like "not provided", not like "invalid input".
export function dropEmptyParams(params: Record<string, string | undefined>) {
  const cleaned: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v.trim() !== "") cleaned[k] = v;
  }
  return cleaned;
}

// All query-string input arrives as strings. Coerce + bound it instead of trusting it.

export const CollegeSearchQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  city: z.string().trim().max(50).optional(),
  state: z.string().trim().max(50).optional(),
  type: z.enum(["GOVERNMENT", "PRIVATE", "DEEMED"]).optional(),
  minFees: z.coerce.number().min(0).optional(),
  maxFees: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(["rating_desc", "fees_asc", "fees_desc", "name_asc"]).default("rating_desc"),
});

export const CompareQuerySchema = z.object({
  // comma-separated slugs, e.g. ?slugs=iit-bombay,iit-delhi
  slugs: z
    .string()
    .min(1, "At least one slug is required")
    .transform((s) =>
      s
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
    )
    .pipe(z.array(z.string()).min(2, "Provide at least 2 colleges to compare").max(3, "Max 3 colleges can be compared")),
});

export const PredictorQuerySchema = z.object({
  examName: z.string().trim().min(1, "examName is required").max(50),
  rank: z.coerce.number().int().positive("rank must be a positive integer"),
  category: z.string().trim().max(20).default("General"),
});
