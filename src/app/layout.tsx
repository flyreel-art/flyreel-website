import "./globals.css";
import VercelAnalytics from "../components/VercelAnalytics";
import AnalyticsDebug from "../components/AnalyticsDebug";
import VercelSpeedInsights from "../components/VercelSpeedInsights";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Flyreel - Professional Drone Cinematography & Aerial Video Production',
  description: 'Professional drone cinematography and aerial video production services. High-quality FPV footage, cinematic aerial shots, and creative drone filming for your projects.',
  keywords: [
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
  authors: [{ name: 'Flyreel' }],
  creator: 'Flyreel',
  publisher: 'Flyreel',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.flyreel.art'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Flyreel - Professional Drone Cinematography & Aerial Video Production',
    description: 'Professional drone cinematography and aerial video production services. High-quality FPV footage, cinematic aerial shots, and creative drone filming for your projects.',
    url: 'https://www.flyreel.art',
    siteName: 'Flyreel',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Flyreel - Professional Drone Cinematography',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flyreel - Professional Drone Cinematography & Aerial Video Production',
    description: 'Professional drone cinematography and aerial video production services. High-quality FPV footage, cinematic aerial shots, and creative drone filming.',
    images: ['/og-image.jpg'],
    creator: '@flyreel',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // You'll need to replace this with your actual verification code
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="canonical" href="https://www.flyreel.art" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Flyreel",
              "url": "https://www.flyreel.art",
              "logo": "https://www.flyreel.art/flyreel-logo.png",
              "description": "Professional drone cinematography and aerial video production services",
              "sameAs": [
                "https://instagram.com/flyreel",
                "https://twitter.com/flyreel"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "url": "https://www.flyreel.art#contact"
              },
              "service": {
                "@type": "Service",
                "name": "Drone Cinematography",
                "description": "Professional aerial video production and FPV drone filming services",
                "provider": {
                  "@type": "Organization",
                  "name": "Flyreel"
                },
                "areaServed": "Worldwide",
                "hasOfferCatalog": {
                  "@type": "OfferCatalog",
                  "name": "Drone Services",
                  "itemListElement": [
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "Aerial Cinematography",
                        "description": "Professional drone filming for commercial and creative projects"
                      }
                    },
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "FPV Drone Footage",
                        "description": "Dynamic first-person view drone cinematography"
                      }
                    }
                  ]
                }
              }
            })
          }}
        />
      </head>
      <body>
        {children}
        <VercelAnalytics />
        <AnalyticsDebug />
        <VercelSpeedInsights />
      </body>
    </html>
  );
}
