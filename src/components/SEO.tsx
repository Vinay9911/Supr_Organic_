import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: object; // New prop for AI Structured Data
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image, 
  url = window.location.href, 
  type = 'website',
  schema 
}) => {
  const siteTitle = 'Supr Mushrooms | Premium Lab-Grown Fungi';
  const finalTitle = title === siteTitle ? title : `${title} | Supr Mushrooms`;
  const defaultImage = 'https://images.unsplash.com/photo-1595503426955-d6c561491714'; // Fallback image

  useEffect(() => {
    // 1. Update Basic Meta Tags
    document.title = finalTitle;
    
    const metaTags = {
      'description': description,
      'og:title': finalTitle,
      'og:description': description,
      'og:image': image || defaultImage,
      'og:url': url,
      'og:type': type,
      'twitter:card': 'summary_large_image',
      'twitter:title': finalTitle,
      'twitter:description': description,
      'twitter:image': image || defaultImage,
    };

    Object.entries(metaTags).forEach(([name, content]) => {
      // Try to find by name or property (for OG tags)
      let element = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    });

    // 2. Add Canonical Link
    let linkCanonical = document.querySelector("link[rel='canonical']");
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', url);

    // 3. Inject JSON-LD Schema (Critical for AI SEO)
    if (schema) {
      let script = document.querySelector('#json-ld-schema');
      if (!script) {
        script = document.createElement('script');
        script.id = 'json-ld-schema';
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    }

    // Cleanup function
    return () => {
       const script = document.querySelector('#json-ld-schema');
       if (script) script.remove();
    };
  }, [finalTitle, description, image, url, type, schema]);

  return null;
};