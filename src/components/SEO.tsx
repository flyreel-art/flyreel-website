import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
}

export default function SEO({
  title = 'Flyreel - Professional Drone Cinematography & Aerial Video Production',
  description = 'Professional drone cinematography and aerial video production services. High-quality FPV footage, cinematic aerial shots, and creative drone filming for your projects.',
  keywords = [
    'drone cinematography',
    'aerial video production',
    'FPV footage',
    'professional drone filming',
    'aerial photography',
    'cinematic drone shots',
    'drone videography',
    'aerial cinematography',
    'commercial drone services',
    'creative aerial filming'
  ],
  image = '/og-image.jpg',
  url = 'https://www.flyreel.art',
  type = 'website',
  structuredData
}: SEOProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Flyreel" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@flyreel" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
    </Head>
  );
} 