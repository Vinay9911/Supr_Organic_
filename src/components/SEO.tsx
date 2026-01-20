import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({ title, description, image, url }) => {
  const siteTitle = "Supr Organic | Premium Aeroponic Farms";
  const defaultImage = "https://picsum.photos/seed/saffron/1200/630"; // Replace with your actual default OG image
  const siteUrl = "https://suprorganic.com";

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{title} | Supr Organic</title>
      <meta name="description" content={description} />

      {/* Open Graph (Facebook/WhatsApp/LinkedIn) */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url ? `${siteUrl}${url}` : siteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
};