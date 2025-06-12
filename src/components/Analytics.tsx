"use client";

import { useEffect } from 'react';

declare global {
  interface Window {
    vaq?: any[];
    __VERCEL_ANALYTICS__?: {
      q: any[];
    };
  }
}

// Generate a session ID for tracking
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('analytics_session', sessionId);
  }
  return sessionId;
};

export default function Analytics() {
  useEffect(() => {
    // Debug: Log the cookie consent status
    const cookieConsent = localStorage.getItem('cookieConsent');
    console.log('Analytics: Cookie consent status:', cookieConsent);
    
    if (cookieConsent === 'accepted') {
      console.log('Analytics: Initializing Vercel Analytics...');
      initializeVercelAnalytics();
    } else {
      console.log('Analytics: Cookies not accepted, analytics disabled');
    }
  }, []);

  const initializeVercelAnalytics = async () => {
    try {
      // Method 1: Try to load the official Vercel Analytics script
      console.log('Analytics: Attempting to load Vercel Analytics script...');
      
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="va.vercel-scripts.com"]');
      
      if (!existingScript) {
        // Try multiple script URLs and methods
        const scriptUrls = [
          'https://va.vercel-scripts.com/va.js',
          'https://vitals.vercel-insights.com/v1/vitals.js'
        ];

        let scriptLoaded = false;
        for (const url of scriptUrls) {
          console.log(`Analytics: Trying to load script from ${url}`);
          
          const success = await loadScript(url);
          if (success) {
            console.log(`Analytics: Successfully loaded script from ${url}`);
            scriptLoaded = true;
            break;
          } else {
            console.warn(`Analytics: Failed to load script from ${url}`);
          }
        }

        // If no script loaded, use backup analytics
        if (!scriptLoaded) {
          console.log('Analytics: Vercel scripts failed, using backup analytics');
          setTimeout(() => {
            if (!(window as any).va) {
              trackWithBackup();
            }
          }, 3000);
        }
      } else {
        console.log('Analytics: Script already exists, checking if functional...');
      }

      // Initialize analytics queue if it doesn't exist
      if (!window.vaq) {
        window.vaq = [];
      }

      // Initialize Vercel Analytics object if it doesn't exist
      if (!window.__VERCEL_ANALYTICS__) {
        window.__VERCEL_ANALYTICS__ = { q: [] };
      }

      // Wait a bit for the script to initialize
      setTimeout(() => {
        trackPageView();
      }, 1000);

      // Also try immediate tracking
      trackPageView();

      // Fallback: if window.va is still not available after 5 seconds, use backup
      setTimeout(() => {
        if (!(window as any).va) {
          console.log('Analytics: window.va still not available after 5 seconds, using backup');
          trackWithBackup();
        }
      }, 5000);

    } catch (error) {
      console.error('Analytics: Error initializing analytics:', error);
      trackWithBackup();
    }
  };

  const loadScript = (src: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.async = true;
      
      script.onload = () => {
        console.log(`Analytics: Script loaded successfully from ${src}`);
        resolve(true);
      };
      
      script.onerror = () => {
        console.error(`Analytics: Failed to load script from ${src}`);
        resolve(false);
      };
      
      document.head.appendChild(script);
    });
  };

  const trackPageView = () => {
    if (typeof window === 'undefined') return;

    console.log('Analytics: Attempting to track pageview...');

    // Method 1: Direct window.va call
    if ((window as any).va && typeof (window as any).va === 'function') {
      console.log('Analytics: Tracking with window.va (direct)');
      (window as any).va('track', 'pageview');
      return;
    }

    // Method 2: Queue in window.vaq
    if (window.vaq && Array.isArray(window.vaq)) {
      console.log('Analytics: Queueing pageview in window.vaq');
      window.vaq.push(['track', 'pageview']);
    }

    // Method 3: Queue in Vercel Analytics object
    if (window.__VERCEL_ANALYTICS__) {
      console.log('Analytics: Queueing pageview in __VERCEL_ANALYTICS__');
      window.__VERCEL_ANALYTICS__.q.push(['track', 'pageview']);
    }

    // Method 4: Manual fetch to Vercel endpoint (backup)
    try {
      const vitalsUrl = `https://vitals.vercel-insights.com/v1/vitals`;
      const data = {
        dsn: window.location.hostname,
        id: 'pageview-' + Date.now(),
        page: window.location.pathname,
        href: window.location.href,
        event_name: 'pageview',
        timestamp: Date.now()
      };

      // Don't await this - fire and forget
      fetch(vitalsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }).then(() => {
        console.log('Analytics: Manual tracking sent via fetch');
      }).catch(err => {
        console.log('Analytics: Manual fetch failed:', err);
      });
    } catch (error) {
      console.log('Analytics: Manual fetch error:', error);
    }
  };

  const trackWithBackup = async () => {
    if (typeof window === 'undefined') return;

    console.log('Analytics: Using backup analytics method...');

    try {
      const analyticsData = {
        page: window.location.pathname,
        referrer: document.referrer,
        event: 'pageview',
        sessionId: getSessionId(),
        timestamp: Date.now()
      };

      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analyticsData)
      });

      if (response.ok) {
        console.log('Analytics: Backup tracking successful');
      } else {
        console.log('Analytics: Backup tracking failed');
      }
    } catch (error) {
      console.error('Analytics: Backup tracking error:', error);
    }
  };

  // Track page views when navigating (for SPAs)
  useEffect(() => {
    const handleRouteChange = () => {
      const cookieConsent = localStorage.getItem('cookieConsent');
      console.log('Analytics: Route change detected, consent:', cookieConsent);
      
      if (cookieConsent === 'accepted') {
        setTimeout(() => {
          trackPageView();
          // Also try backup if main tracking doesn't work
          if (!(window as any).va) {
            trackWithBackup();
          }
        }, 100);
      }
    };

    // Listen for navigation events
    window.addEventListener('popstate', handleRouteChange);
    
    // Also listen for pushstate/replacestate (Next.js navigation)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      handleRouteChange();
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      handleRouteChange();
    };
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  return null; // This component doesn't render anything
} 