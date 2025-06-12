"use client";

import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    va?: (...args: any[]) => void;
    vaq?: any[];
  }
}

export default function AnalyticsDebug() {
  const [debugInfo, setDebugInfo] = useState({
    cookieConsent: '',
    vaLoaded: false,
    vaqExists: false,
    scriptExists: false,
    lastTracked: ''
  });

  const updateDebugInfo = () => {
    const cookieConsent = localStorage.getItem('cookieConsent') || 'none';
    const vaLoaded = typeof window.va === 'function';
    const vaqExists = Array.isArray(window.vaq);
    const scriptExists = !!document.querySelector('script[src="https://va.vercel-scripts.com/va.js"]');
    
    setDebugInfo({
      cookieConsent,
      vaLoaded,
      vaqExists,
      scriptExists,
      lastTracked: new Date().toLocaleTimeString()
    });
  };

  useEffect(() => {
    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 2000);
    return () => clearInterval(interval);
  }, []);

  const testTracking = () => {
    console.log('AnalyticsDebug: Testing manual tracking...');
    
    if (window.va) {
      window.va('track', 'pageview');
      console.log('AnalyticsDebug: Tracked with window.va');
    } else if (window.vaq) {
      window.vaq.push(['track', 'pageview']);
      console.log('AnalyticsDebug: Queued with window.vaq');
    } else {
      console.log('AnalyticsDebug: No analytics available');
    }
    
    updateDebugInfo();
  };

  const clearConsent = () => {
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('cookieConsentDate');
    console.log('AnalyticsDebug: Cleared cookie consent');
    window.location.reload();
  };

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    console.log('AnalyticsDebug: Accepted cookies programmatically');
    window.location.reload();
  };

  // Only show in development or if debug query param is present
  const shouldShow = process.env.NODE_ENV === 'development' || 
                    (typeof window !== 'undefined' && window.location.search.includes('debug=analytics'));

  if (!shouldShow) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-black text-white p-4 rounded-lg shadow-lg text-xs max-w-xs">
      <h3 className="font-bold mb-2">Analytics Debug</h3>
      
      <div className="space-y-1 mb-3">
        <div>Consent: <span className={debugInfo.cookieConsent === 'accepted' ? 'text-green-400' : 'text-red-400'}>{debugInfo.cookieConsent}</span></div>
        <div>window.va: <span className={debugInfo.vaLoaded ? 'text-green-400' : 'text-red-400'}>{debugInfo.vaLoaded ? '✓' : '✗'}</span></div>
        <div>window.vaq: <span className={debugInfo.vaqExists ? 'text-green-400' : 'text-red-400'}>{debugInfo.vaqExists ? '✓' : '✗'}</span></div>
        <div>Script: <span className={debugInfo.scriptExists ? 'text-green-400' : 'text-red-400'}>{debugInfo.scriptExists ? '✓' : '✗'}</span></div>
        <div>Updated: {debugInfo.lastTracked}</div>
      </div>
      
      <div className="space-y-1">
        <button 
          onClick={testTracking}
          className="block w-full bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        >
          Test Track
        </button>
        <button 
          onClick={acceptCookies}
          className="block w-full bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
        >
          Accept Cookies
        </button>
        <button 
          onClick={clearConsent}
          className="block w-full bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
        >
          Clear Consent
        </button>
      </div>
    </div>
  );
} 