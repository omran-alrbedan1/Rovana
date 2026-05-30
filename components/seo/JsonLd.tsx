export function JewelryStoreSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: "مجوهرات روفانا",
    url: "https://rovana-gilt.vercel.app",
    logo: "https://rovana-gilt.vercel.app/assets/logo-as.jpg",
    image: "https://rovana-gilt.vercel.app/assets/logo-as.jpg",
    description: "متجرك المفضل لارقى مجوهرات الذهب والألماس 💫",
    telephone: "+963981117927",
    address: {
      "@type": "PostalAddress",
      addressCountry: "SY",
      addressLocality: "دمشق",
      streetAddress: "الصالحية، بجانب عصير أبو عبدو",
    },
    openingHours: "Mo-Th 10:00-20:30",
    priceRange: "$$$",
    hasMap: "https://maps.app.goo.gl/2U98HSagq1mMx7L28",
    sameAs: [
      "https://www.instagram.com/rovanajewellery",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "مجوهرات روفانا",
    url: "https://rovana-gilt.vercel.app",
    logo: "https://rovana-gilt.vercel.app/assets/logo-as.jpg",
    description: "متجرك المفضل لارقى مجوهرات الذهب والألماس",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+963981117927",
      contactType: "خدمة العملاء",
      availableLanguage: ["العربية", "الإنجليزية"],
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "SY",
      addressLocality: "دمشق",
      streetAddress: "الصالحية، بجانب عصير أبو عبدو",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// مخطط خدمة التصميم المخصص
export function CustomDesignServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "تصميم المجوهرات المخصص",
    description: "خدمة تصميم مجوهرات ذهبية حسب الطلب. شاركنا فكرتك وسيقوم حرفيونا المهرة بإحيائها.",
    url: "https://rovana-gilt.vercel.app/ar/custom-design",
    provider: {
      "@type": "JewelryStore",
      name: "مجوهرات روفانا",
    },
    areaServed: {
      "@type": "Country",
      name: "سوريا",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}