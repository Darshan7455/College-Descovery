import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, withErrorHandling, parsePagination } from "@/lib/api-utils";
import { CollegeSearchQuerySchema, dropEmptyParams } from "@/lib/validation";
import { Prisma } from "@prisma/client";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;

  // Validate filters. Bad/unknown values get rejected with 422, not silently ignored
  // or used to throw a 500 from a malformed Prisma query.
  const parsed = CollegeSearchQuerySchema.safeParse(dropEmptyParams(Object.fromEntries(searchParams)));
  if (!parsed.success) return fail("Invalid query parameters", 422, parsed.error.flatten());
  const { q, city, state, type, minFees, maxFees, minRating, sort } = parsed.data;

  if (minFees !== undefined && maxFees !== undefined && minFees > maxFees) {
    return fail("minFees cannot be greater than maxFees", 422);
  }

  const { page, limit, skip } = parsePagination(searchParams);

  const where: Prisma.CollegeWhereInput = {
    ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
    ...(city ? { city: { equals: city, mode: "insensitive" } } : {}),
    ...(state ? { state: { equals: state, mode: "insensitive" } } : {}),
    ...(type ? { type } : {}),
    ...(minRating !== undefined ? { rating: { gte: minRating } } : {}),
    ...(minFees !== undefined || maxFees !== undefined
      ? {
          feesPerYear: {
            ...(minFees !== undefined ? { gte: minFees } : {}),
            ...(maxFees !== undefined ? { lte: maxFees } : {}),
          },
        }
      : {}),
  };

  const orderBy: Prisma.CollegeOrderByWithRelationInput =
    sort === "fees_asc"
      ? { feesPerYear: "asc" }
      : sort === "fees_desc"
      ? { feesPerYear: "desc" }
      : sort === "name_asc"
      ? { name: "asc" }
      : { rating: "desc" };

  const [colleges, total] = await Promise.all([
    prisma.college.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        slug: true,
        name: true,
        city: true,
        state: true,
        type: true,
        feesPerYear: true,
        rating: true,
        establishedYear: true,
      },
    }),
    prisma.college.count({ where }),
  ]);

  return ok(colleges, {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  });
});
