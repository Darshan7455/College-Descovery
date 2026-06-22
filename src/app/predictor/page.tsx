import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PredictorPage({
  searchParams,
}: {
  searchParams: { examName?: string; rank?: string; category?: string };
}) {
  const examName = searchParams.examName?.trim();
  const rank = Number(searchParams.rank);
  const category = searchParams.category?.trim() || "General";

  const hasQuery = !!examName && Number.isFinite(rank) && rank > 0;

  const cutoffs = hasQuery
    ? await prisma.examCutoff.findMany({
        where: {
          examName: { equals: examName, mode: "insensitive" },
          category: { equals: category, mode: "insensitive" },
          cutoffRank: { gte: rank },
        },
        orderBy: { cutoffRank: "asc" },
        include: { college: true },
      })
    : [];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">College Predictor</h1>
      <form method="get" className="flex flex-wrap gap-2">
        <input
          name="examName"
          defaultValue={searchParams.examName ?? ""}
          placeholder="Exam (e.g. JEE Advanced, BITSAT, VITEEE)"
          className="rounded border px-3 py-2 text-sm"
        />
        <input
          name="rank"
          defaultValue={searchParams.rank ?? ""}
          placeholder="Your rank"
          type="number"
          className="rounded border px-3 py-2 text-sm"
        />
        <select name="category" defaultValue={category} className="rounded border px-3 py-2 text-sm">
          <option>General</option>
          <option>OBC</option>
          <option>SC</option>
          <option>ST</option>
          <option>EWS</option>
        </select>
        <button className="rounded bg-black px-4 py-2 text-sm text-white">Predict</button>
      </form>

      {hasQuery && cutoffs.length === 0 && (
        <p className="text-sm text-gray-500">No colleges found for this exam/rank/category combination.</p>
      )}

      {cutoffs.length > 0 && (
        <ul className="space-y-2">
          {cutoffs.map((c) => (
            <li key={c.id} className="rounded border bg-white p-3 text-sm">
              <p className="font-medium">{c.college.name}</p>
              <p className="text-gray-500">
                {c.college.city}, {c.college.state} · Last cutoff rank: {c.cutoffRank} ({c.year})
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
