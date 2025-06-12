"use client";

import { Analytics } from '@vercel/analytics/react';
import { useEffect, useState } from 'react';

export default function VercelAnalytics() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check initial consent status
    const checkConsent = () => {
      const cookieConsent = localStorage.getItem('cookieConsent');
      const newConsentStatus = cookieConsent === 'accepted';
      
      console.log('VercelAnalytics: Cookie consent status:', cookieConsent);
      setHasConsent(newConsentStatus);
      
      if (newConsentStatus) {
        console.log('VercelAnalytics: Consent given, analytics will be active');
      } else {
        console.log('VercelAnalytics: No consent, analytics disabled');
      }
    };

    // Check immediately
    checkConsent();

    // Also listen for storage changes (when user accepts/declines cookies)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cookieConsent') {
        console.log('VercelAnalytics: Cookie consent changed, rechecking...');
        checkConsent();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Check periodically in case localStorage was updated in the same window
    const interval = setInterval(checkConsent, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Track when analytics becomes active
  useEffect(() => {
    if (hasConsent) {
      console.log('VercelAnalytics: Analytics component is now active');
      
      // Let's also check if window.va is available after a short delay
      setTimeout(() => {
        if (typeof window !== 'undefined' && (window as any).va) {
          console.log('VercelAnalytics: window.va is now available!');
        } else {
          console.log('VercelAnalytics: window.va still not available');
        }
      }, 1000);
    }
  }, [hasConsent]);

  // Only render Analytics component if user has consented
  if (!hasConsent) {
    return null;
  }

  return <Analytics debug={process.env.NODE_ENV === 'development'} />;
} 