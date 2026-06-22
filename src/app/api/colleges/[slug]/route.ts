import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, withErrorHandling } from "@/lib/api-utils";

export const GET = withErrorHandling(
  async (_req: NextRequest, { params }: { params: { slug: string } }) => {
    const { slug } = params;
    if (!slug || typeof slug !== "string") return fail("Invalid slug", 400);

    const college = await prisma.college.findUnique({
      where: { slug },
      include: {
        courses: true,
        placements: { orderBy: { year: "desc" } },
        reviews: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    });

    // Unknown slug is a 404, not a 500 - this is the "graceful failure" requirement.
    if (!college) return fail("College not found", 404);

    return ok(college);
  }
);
