import { prisma } from "@/lib/prisma";
import { CollegeSearchQuerySchema, dropEmptyParams } from "@/lib/validation";
import Link from "next/link";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function CollegesPage({ searchParams }: { searchParams: SearchParams }) {
  const flat: Record<string, string> = {};
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === "string") flat[k] = v;
  }

  const parsed = CollegeSearchQuerySchema.safeParse(dropEmptyParams(flat));
  const filters = parsed.success ? parsed.data : { sort: "rating_desc" as const };

  const page = Math.max(1, Number(flat.page) || 1);
  const limit = 9;

  const where: Prisma.CollegeWhereInput = {
    ...(filters.q ? { name: { contains: filters.q, mode: "insensitive" } } : {}),
    ...(filters.city ? { city: { equals: filters.city, mode: "insensitive" } } : {}),
    ...(filters.type ? { type: filters.type } : {}),
  };

  const orderBy: Prisma.CollegeOrderByWithRelationInput =
    filters.sort === "fees_asc"
      ? { feesPerYear: "asc" }
      : filters.sort === "fees_desc"
      ? { feesPerYear: "desc" }
      : filters.sort === "name_asc"
      ? { name: "asc" }
      : { rating: "desc" };

  const [colleges, total] = await Promise.all([
    prisma.college.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit }),
    prisma.college.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Search Colleges</h1>

      <form className="flex flex-wrap gap-2" method="get">
        <input
          name="q"
          defaultValue={flat.q ?? ""}
          placeholder="Search by name..."
          className="rounded border px-3 py-2 text-sm"
        />
        <input
          name="city"
          defaultValue={flat.city ?? ""}
          placeholder="City"
          className="rounded border px-3 py-2 text-sm"
        />
        <select name="type" defaultValue={flat.type ?? ""} className="rounded border px-3 py-2 text-sm">
          <option value="">Any type</option>
          <option value="GOVERNMENT">Government</option>
          <option value="PRIVATE">Private</option>
          <option value="DEEMED">Deemed</option>
        </select>
        <select name="sort" defaultValue={flat.sort ?? "rating_desc"} className="rounded border px-3 py-2 text-sm">
          <option value="rating_desc">Top rated</option>
          <option value="fees_asc">Fees: low to high</option>
          <option value="fees_desc">Fees: high to low</option>
          <option value="name_asc">Name A-Z</option>
        </select>
        <button className="rounded bg-black px-4 py-2 text-sm text-white">Search</button>
      </form>

      {colleges.length === 0 ? (
        <p className="text-gray-500">No colleges match these filters.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {colleges.map((c) => (
            <Link
              key={c.slug}
              href={`/colleges/${c.slug}`}
              className="rounded border bg-white p-4 hover:shadow"
            >
              <h2 className="font-semibold">{c.name}</h2>
              <p className="text-sm text-gray-500">{c.city}, {c.state}</p>
              <p className="mt-2 text-sm">Fees: ₹{c.feesPerYear.toLocaleString("en-IN")}/yr</p>
              <p className="text-sm">Rating: {c.rating.toFixed(1)} ★</p>
            </Link>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-1 text-sm">
        {page > 1 && (
          <Link
            className="rounded border px-3 py-1 hover:bg-gray-100"
            href={`?${new URLSearchParams({ ...flat, page: String(page - 1) })}`}
          >
            ← Prev
          </Link>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          // Show first page, last page, current page, and one neighbor on each side; collapse the rest into "…"
          .filter(
            (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
          )
          .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
            if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("ellipsis");
            acc.push(p);
            return acc;
          }, [])
          .map((p, idx) =>
            p === "ellipsis" ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                …
              </span>
            ) : (
              <Link
                key={p}
                href={`?${new URLSearchParams({ ...flat, page: String(p) })}`}
                className={`rounded border px-3 py-1 ${
                  p === page ? "bg-black text-white" : "hover:bg-gray-100"
                }`}
              >
                {p}
              </Link>
            )
          )}

        {page < totalPages && (
          <Link
            className="rounded border px-3 py-1 hover:bg-gray-100"
            href={`?${new URLSearchParams({ ...flat, page: String(page + 1) })}`}
          >
            Next →
          </Link>
        )}

        <span className="ml-auto text-gray-500">
          {total} colleges · page {page} of {totalPages}
        </span>
      </div>
    </div>
  );
}
