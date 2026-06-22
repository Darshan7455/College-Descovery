import "./globals.css";
import Link from "next/link";

export const metadata = { title: "College Discovery", description: "Find and compare colleges" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <nav className="mx-auto max-w-5xl flex gap-6 p-4 text-sm font-medium">
            <Link href="/colleges">Search</Link>
            <Link href="/compare">Compare</Link>
            <Link href="/predictor">Predictor</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl p-4">{children}</main>
      </body>
    </html>
  );
}
