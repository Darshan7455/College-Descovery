import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, withErrorHandling } from "@/lib/api-utils";
import { PredictorQuerySchema } from "@/lib/validation";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const parsed = PredictorQuerySchema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams)
  );
  if (!parsed.success) return fail("Invalid query parameters", 422, parsed.error.flatten());

  const { examName, rank, category } = parsed.data;

  // Matching logic: a student with `rank` could get into a college if the most recent
  // cutoff for that exam+category at that college was a WORSE (numerically higher) rank
  // than the student's. We take the latest year per college to avoid stale matches.
  const cutoffs = await prisma.examCutoff.findMany({
    where: {
      examName: { equals: examName, mode: "insensitive" },
      category: { equals: category, mode: "insensitive" },
      cutoffRank: { gte: rank },
    },
    orderBy: [{ collegeId: "asc" }, { year: "desc" }],
    include: {
      college: {
        select: {
          slug: true,
          name: true,
          city: true,
          state: true,
          type: true,
          feesPerYear: true,
          rating: true,
        },
      },
    },
  });

  if (cutoffs.length === 0) {
    return ok([], { message: "No matching colleges found for this exam/rank/category combination." });
  }

  // Dedup to latest year per college (a college may have multiple historical cutoff rows).
  const latestByCollege = new Map<string, typeof cutoffs[number]>();
  for (const c of cutoffs) {
    const existing = latestByCollege.get(c.collegeId);
    if (!existing || c.year > existing.year) latestByCollege.set(c.collegeId, c);
  }

  const results = Array.from(latestByCollege.values())
    .sort((a, b) => a.cutoffRank - b.cutoffRank) // closest/most competitive cutoff first
    .map((c) => ({
      ...c.college,
      matchedCutoffRank: c.cutoffRank,
      cutoffYear: c.year,
    }));

  return ok(results, { count: results.length });
});
