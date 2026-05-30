import type { Metadata } from "next";
import enMessages from "@/messages/en/custom-design.json";
import arMessages from "@/messages/ar/custom-design.json";

export async function getCustomDesignMetadata(locale: string): Promise<Metadata> {
  const t = locale === "ar" ? arMessages : enMessages;
  const path = `https://rovana-gilt.vercel.app/${locale}/custom-design`;

  return {
    title: t.metadata.title,
    description: t.metadata.description,
    keywords: t.metadata.keywords,
    alternates: {
      canonical: path,
      languages: {
        "en-US": "https://rovana-gilt.vercel.app/en/custom-design",
        "ar-JO": "https://rovana-gilt.vercel.app/ar/custom-design",
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
