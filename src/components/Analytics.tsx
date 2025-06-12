"use client";

import { useEffect } from 'react';

declare global {
  interface Window {
    va?: (...args: any[]) => void;
  }
}

export default function Analytics() {
  useEffect(() => {
    // Check if user has accepted cookies
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (cookieConsent === 'accepted') {
      // Initialize Vercel Analytics only if cookies are accepted
      const script = document.createElement('script');
      script.src = 'https://va.vercel-scripts.com/va.js';
      script.defer = true;
      script.onload = () => {
        // Track initial page view
        if (window.va) {
          window.va('track', 'pageview');
        }
      };
      
      // Only add script if it doesn't already exist
      if (!document.querySelector('script[src="https://va.vercel-scripts.com/va.js"]')) {
        document.head.appendChild(script);
      }
    }
  }, []);

  // Track page views when navigating (for SPAs)
  useEffect(() => {
    const handleRouteChange = () => {
      const cookieConsent = localStorage.getItem('cookieConsent');
      if (cookieConsent === 'accepted' && window.va) {
        window.va('track', 'pageview');
      }
    };

    // Listen for navigation events (Next.js specific)
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return null; // This component doesn't render anything
} 