import type { Metadata } from "next";
import enMessages from "@/messages/en/home.json";
import arMessages from "@/messages/ar/home.json";

export async function getHomeMetadata(locale: string): Promise<Metadata> {
  const t = locale === "ar" ? arMessages : enMessages;
  const path = `https://rovana-gilt.vercel.app/${locale}/home`;

  return {
    title: t.metadata.title,
    description: t.metadata.description,
    keywords: t.metadata.keywords,
    alternates: {
      canonical: path,
      languages: {
        "en-US": "https://rovana-gilt.vercel.app/en/home",
        "ar-JO": "https://rovana-gilt.vercel.app/ar/home",
      },
    },
    openGraph: {
      title: t.metadata.title,
      description: t.metadata.description,
      url: path,
      type: "website",
      images: [{ url: "/assets/og-default.jpg", width: 1200, height: 630 }],
    },
  };
}
