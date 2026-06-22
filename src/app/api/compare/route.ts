import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, withErrorHandling } from "@/lib/api-utils";
import { CompareQuerySchema } from "@/lib/validation";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const parsed = CompareQuerySchema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams)
  );
  if (!parsed.success) return fail("Invalid query parameters", 422, parsed.error.flatten());

  const { slugs } = parsed.data;
  const uniqueSlugs = Array.from(new Set(slugs));

  const colleges = await prisma.college.findMany({
    where: { slug: { in: uniqueSlugs } },
    include: {
      placements: { orderBy: { year: "desc" }, take: 1 }, // most recent year only
    },
  });

  // Distinguish "found nothing" from "found some but not all" — the frontend needs
  // to know which requested slugs were invalid, not just get back a shorter array.
  const foundSlugs = new Set(colleges.map((c) => c.slug));
  const missingSlugs = uniqueSlugs.filter((s) => !foundSlugs.has(s));

  if (colleges.length === 0) {
    return fail("None of the requested colleges were found", 404, { missingSlugs });
  }

  const comparison = colleges.map((c) => ({
    slug: c.slug,
    name: c.name,
    city: c.city,
    state: c.state,
    type: c.type,
    feesPerYear: c.feesPerYear,
    rating: c.rating,
    establishedYear: c.establishedYear,
    latestPlacement: c.placements[0] ?? null,
  }));

  return ok(comparison, missingSlugs.length > 0 ? { missingSlugs } : undefined);
});
