import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const BASE_URL = "https://rovana-gilt.vercel.app";

  const staticPages = [
    "/",
    "/about",
    "/contact",
    "/custom-design",
  ];

  const locales = ["en", "ar"];
  const routes: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      routes.push({
        url: `${BASE_URL}/${locale}${page === "/" ? "" : page}`,
        lastModified: new Date(),
        changeFrequency: page === "/" ? "weekly" : "monthly",
        priority: page === "/" ? 1 : 0.8,
      });
    }
  }

  return routes;
}
