"use client";

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Smart Teacher",
    alternateName: "Smart Teacher - AI Learning Platform",
    url: "https://smartteacherom.com",
    description: "Learn smarter with AI-powered education",
    inLanguage: "ar",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://smartteacherom.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Smart Teacher",
      url: "https://smartteacherom.com",
      logo: {
        "@type": "ImageObject",
        url: "https://smartteacherom.com/images/logo.png",
        width: 512,
        height: 512,
      },
      sameAs: ["https://smartteacherom.com"],
    },
    mainEntity: {
      "@type": "EducationalOrganization",
      name: "Smart Teacher",
      description:
        "منصة تعليمية متطورة تستخدم الذكاء الاصطناعي لتقديم تجربة تعلم مخصصة وفعالة",
      url: "https://smartteacherom.com",
      logo: "https://smartteacherom.com/images/logo.png",
      image: "https://smartteacherom.com/images/logo.png",
      telephone: "+968-XXXX-XXXX",
      address: {
        "@type": "PostalAddress",
        addressCountry: "OM",
        addressRegion: "Muscat",
      },
      offers: {
        "@type": "Offer",
        name: "AI Learning Platform Subscription",
        description: "اشتراك في منصة التعلم بالذكاء الاصطناعي",
        category: "Education",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
