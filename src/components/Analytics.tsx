"use client";

import { useEffect } from 'react';

declare global {
  interface Window {
    va?: (...args: any[]) => void;
    vaq?: any[];
  }
}

export default function Analytics() {
  useEffect(() => {
    // Debug: Log the cookie consent status
    const cookieConsent = localStorage.getItem('cookieConsent');
    console.log('Analytics: Cookie consent status:', cookieConsent);
    
    if (cookieConsent === 'accepted') {
      // Initialize Vercel Analytics only if cookies are accepted
      console.log('Analytics: Initializing Vercel Analytics...');
      
      // Create the analytics queue if it doesn't exist
      if (!window.vaq) {
        window.vaq = [];
      }
      
      // Check if script is already loaded
      const existingScript = document.querySelector('script[src="https://va.vercel-scripts.com/va.js"]');
      
      if (!existingScript) {
        console.log('Analytics: Loading Vercel Analytics script...');
        
        const script = document.createElement('script');
        script.src = 'https://va.vercel-scripts.com/va.js';
        script.defer = true;
        script.async = true;
        
        script.onload = () => {
          console.log('Analytics: Vercel Analytics script loaded successfully');
          // Track initial page view after script loads
          trackPageView();
        };
        
        script.onerror = () => {
          console.error('Analytics: Failed to load Vercel Analytics script');
        };
        
        document.head.appendChild(script);
      } else {
        console.log('Analytics: Vercel Analytics script already exists, tracking pageview...');
        // Script already exists, track pageview
        trackPageView();
      }
    } else {
      console.log('Analytics: Cookies not accepted, analytics disabled');
    }
  }, []);

  const trackPageView = () => {
    if (typeof window !== 'undefined') {
      // Method 1: Use window.va if available
      if (window.va) {
        console.log('Analytics: Tracking pageview with window.va');
        window.va('track', 'pageview');
        return;
      }
      
      // Method 2: Queue the event if va is not ready yet
      if (window.vaq) {
        console.log('Analytics: Queueing pageview event');
        window.vaq.push(['track', 'pageview']);
        return;
      }
      
      // Method 3: Try again after a short delay
      setTimeout(() => {
        if (window.va) {
          console.log('Analytics: Tracking pageview with window.va (delayed)');
          window.va('track', 'pageview');
        } else {
          console.log('Analytics: window.va still not available after delay');
        }
      }, 1000);
    }
  };

  // Track page views when navigating (for SPAs)
  useEffect(() => {
    const handleRouteChange = () => {
      const cookieConsent = localStorage.getItem('cookieConsent');
      console.log('Analytics: Route change detected, consent:', cookieConsent);
      
      if (cookieConsent === 'accepted') {
        trackPageView();
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