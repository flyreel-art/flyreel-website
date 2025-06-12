"use client";

import { SpeedInsights } from '@vercel/speed-insights/next';
import { useEffect, useState } from 'react';

export default function VercelSpeedInsights() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check initial consent status
    const checkConsent = () => {
      const cookieConsent = localStorage.getItem('cookieConsent');
      const newConsentStatus = cookieConsent === 'accepted';
      
      console.log('VercelSpeedInsights: Cookie consent status:', cookieConsent);
      setHasConsent(newConsentStatus);
      
      if (newConsentStatus) {
        console.log('VercelSpeedInsights: Consent given, speed insights will be active');
      } else {
        console.log('VercelSpeedInsights: No consent, speed insights disabled');
      }
    };

    // Check immediately
    checkConsent();

    // Also listen for storage changes (when user accepts/declines cookies)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cookieConsent') {
        console.log('VercelSpeedInsights: Cookie consent changed, rechecking...');
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

  // Track when speed insights becomes active
  useEffect(() => {
    if (hasConsent) {
      console.log('VercelSpeedInsights: Speed Insights component is now active');
    }
  }, [hasConsent]);

  // Only render SpeedInsights component if user has consented
  if (!hasConsent) {
    return null;
  }

  return <SpeedInsights debug={process.env.NODE_ENV === 'development'} />;
} 