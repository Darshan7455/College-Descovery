import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: { slugs?: string };
}) {
  const slugs = (searchParams.slugs ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const colleges =
    slugs.length >= 2
      ? await prisma.college.findMany({
          where: { slug: { in: slugs.slice(0, 3) } },
          include: { placements: { orderBy: { year: "desc" }, take: 1 } },
        })
      : [];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Compare Colleges</h1>
      <form method="get" className="flex gap-2">
        <input
          name="slugs"
          defaultValue={searchParams.slugs ?? ""}
          placeholder="e.g. iit-bombay,iit-delhi"
          className="flex-1 rounded border px-3 py-2 text-sm"
        />
        <button className="rounded bg-black px-4 py-2 text-sm text-white">Compare</button>
      </form>
      <p className="text-xs text-gray-500">
        Enter 2-3 college slugs separated by commas. Try: iit-bombay,iit-delhi,bits-pilani
      </p>

      {slugs.length > 0 && slugs.length < 2 && (
        <p className="text-sm text-red-600">Enter at least 2 colleges to compare.</p>
      )}

      {colleges.length > 0 && (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th>College</th><th>Location</th><th>Fees/yr</th><th>Rating</th><th>Latest Avg Package</th>
            </tr>
          </thead>
          <tbody>
            {colleges.map((c) => (
              <tr key={c.slug} className="border-t">
                <td className="py-2 font-medium">{c.name}</td>
                <td>{c.city}, {c.state}</td>
                <td>₹{c.feesPerYear.toLocaleString("en-IN")}</td>
                <td>{c.rating.toFixed(1)} ★</td>
                <td>{c.placements[0] ? `₹${c.placements[0].avgPackage.toLocaleString("en-IN")}` : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
