"use client";

import React, { useState, useEffect } from 'react';

export default function AnalyticsDebug() {
  const [debugInfo, setDebugInfo] = useState({
    cookieConsent: '',
    vaLoaded: false,
    scriptExists: false,
    scriptUrl: '',
    lastTracked: ''
  });

  const updateDebugInfo = () => {
    const cookieConsent = localStorage.getItem('cookieConsent') || 'none';
    const vaLoaded = typeof (window as any).va === 'function';
    
    const scripts = document.querySelectorAll('script[src*="vercel"], script[src*="analytics"]');
    const scriptExists = scripts.length > 0;
    const scriptUrl = scripts.length > 0 ? (scripts[0] as HTMLScriptElement).src : 'none';
    
    setDebugInfo({
      cookieConsent,
      vaLoaded,
      scriptExists,
      scriptUrl,
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
    
    if ((window as any).va) {
      (window as any).va('track', 'pageview');
      console.log('AnalyticsDebug: Tracked with window.va');
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
    <div className="fixed top-4 right-4 z-50 bg-black text-white p-4 rounded-lg shadow-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">Analytics Debug (Official)</h3>
      
      <div className="space-y-1 mb-3">
        <div>Consent: <span className={debugInfo.cookieConsent === 'accepted' ? 'text-green-400' : 'text-red-400'}>{debugInfo.cookieConsent}</span></div>
        <div>window.va: <span className={debugInfo.vaLoaded ? 'text-green-400' : 'text-red-400'}>{debugInfo.vaLoaded ? '✓' : '✗'}</span></div>
        <div>Scripts: <span className={debugInfo.scriptExists ? 'text-green-400' : 'text-red-400'}>{debugInfo.scriptExists ? '✓' : '✗'}</span></div>
        <div className="text-gray-400 text-xs truncate" title={debugInfo.scriptUrl}>URL: {debugInfo.scriptUrl.split('/').pop() || 'none'}</div>
        <div>Updated: {debugInfo.lastTracked}</div>
      </div>
      
      <div className="space-y-1 mb-3">
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