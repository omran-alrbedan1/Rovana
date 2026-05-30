import type { Metadata } from "next";

const BASE_URL = "https://rovana-gilt.vercel.app";

export const defaultMetadata = {
  siteName: "Rovana Jewelry",
  baseUrl: BASE_URL,
  defaultLocale: "en",
};

export function buildMetadata({
  title,
  description,
  path = "",
  locale = "en",
  image,
  keywords,
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  locale?: "en" | "ar";
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const url = `${BASE_URL}/${locale}${path}`;
  const ogImage = image ?? `${BASE_URL}/assets/og-default.jpg`;

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: {
        "en-US": `${BASE_URL}/en${path}`,
        "ar-SY": `${BASE_URL}/ar${path}`,
      },
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title,
      description,
      url,
      siteName: defaultMetadata.siteName,
      locale: locale === "ar" ? "ar_SY" : "en_US",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
