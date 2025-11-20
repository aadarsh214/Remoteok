import { NextResponse } from "next/server";
import { listJobs } from "../../../lib/db";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const jobs = listJobs();
  const urls = jobs
    .map((j) => `<url><loc>${base}/remote-jobs/${j.slug}</loc><changefreq>daily</changefreq></url>`) 
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new NextResponse(xml, { headers: { "Content-Type": "application/xml" } });
}
