import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CollegeDetailPage({ params }: { params: { slug: string } }) {
  const college = await prisma.college.findUnique({
    where: { slug: params.slug },
    include: {
      courses: true,
      placements: { orderBy: { year: "desc" } },
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });

  // Unknown slug -> Next.js 404 page instead of crashing the route.
  if (!college) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{college.name}</h1>
        <p className="text-gray-500">{college.city}, {college.state} · Est. {college.establishedYear}</p>
        <p className="mt-2 text-sm">{college.description}</p>
        <div className="mt-2 flex gap-4 text-sm">
          <span>Fees: ₹{college.feesPerYear.toLocaleString("en-IN")}/yr</span>
          <span>Rating: {college.rating.toFixed(1)} ★</span>
          <span>Type: {college.type}</span>
        </div>
      </div>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Courses</h2>
        {college.courses.length === 0 ? (
          <p className="text-sm text-gray-500">No courses listed yet.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {college.courses.map((c) => (
              <li key={c.id}>
                {c.name} — {c.durationYears} yrs · ₹{c.feesPerYear.toLocaleString("en-IN")}/yr · {c.seats} seats
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Placements</h2>
        {college.placements.length === 0 ? (
          <p className="text-sm text-gray-500">No placement data available.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th>Year</th><th>Avg Package</th><th>Median</th><th>Highest</th><th>Placed %</th>
              </tr>
            </thead>
            <tbody>
              {college.placements.map((p) => (
                <tr key={p.id}>
                  <td>{p.year}</td>
                  <td>₹{p.avgPackage.toLocaleString("en-IN")}</td>
                  <td>₹{p.medianPackage.toLocaleString("en-IN")}</td>
                  <td>₹{p.highestPackage.toLocaleString("en-IN")}</td>
                  <td>{p.placementPercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Reviews</h2>
        {college.reviews.length === 0 ? (
          <p className="text-sm text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {college.reviews.map((r) => (
              <div key={r.id} className="rounded border bg-white p-3 text-sm">
                <p className="font-medium">{r.title} — {r.rating}★</p>
                <p className="text-gray-600">{r.body}</p>
                <p className="mt-1 text-xs text-gray-400">— {r.authorName}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
