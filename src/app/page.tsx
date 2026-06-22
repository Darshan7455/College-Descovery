import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">College Discovery Platform</h1>
      <p className="text-gray-600">
        Backend-focused MVP: search, detail pages, comparison, and a rank-based predictor — all
        backed by real PostgreSQL data via Prisma.
      </p>
      <div className="flex gap-4">
        <Link href="/colleges" className="rounded bg-black px-4 py-2 text-white">
          Browse Colleges
        </Link>
        <Link href="/predictor" className="rounded border px-4 py-2">
          Try Predictor
        </Link>
      </div>
    </div>
  );
}
