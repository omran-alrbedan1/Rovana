import type { Metadata } from "next";
import enMessages from "@/messages/en/contact.json";
import arMessages from "@/messages/ar/contact.json";

export async function getContactMetadata(locale: string): Promise<Metadata> {
  const t = locale === "ar" ? arMessages : enMessages;
  const path = `https://rovana-gilt.vercel.app/${locale}/contact`;

  return {
    title: t.metadata.title,
    description: t.metadata.description,
    keywords: t.metadata.keywords,
    alternates: {
      canonical: path,
      languages: {
        "en-US": "https://rovana-gilt.vercel.app/en/contact",
        "ar-JO": "https://rovana-gilt.vercel.app/ar/contact",
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
