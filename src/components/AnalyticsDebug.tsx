"use client";

import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    va?: (...args: any[]) => void;
    vaq?: any[];
    __VERCEL_ANALYTICS__?: {
      q: any[];
    };
  }
}

export default function AnalyticsDebug() {
  const [debugInfo, setDebugInfo] = useState({
    cookieConsent: '',
    vaLoaded: false,
    vaqExists: false,
    vercelAnalyticsExists: false,
    scriptExists: false,
    scriptUrl: '',
    lastTracked: '',
    networkTests: [] as string[]
  });

  const updateDebugInfo = () => {
    const cookieConsent = localStorage.getItem('cookieConsent') || 'none';
    const vaLoaded = typeof window.va === 'function';
    const vaqExists = Array.isArray(window.vaq);
    const vercelAnalyticsExists = !!window.__VERCEL_ANALYTICS__;
    
    const scripts = document.querySelectorAll('script[src*="vercel"]');
    const scriptExists = scripts.length > 0;
    const scriptUrl = scripts.length > 0 ? (scripts[0] as HTMLScriptElement).src : 'none';
    
    setDebugInfo({
      cookieConsent,
      vaLoaded,
      vaqExists,
      vercelAnalyticsExists,
      scriptExists,
      scriptUrl,
      lastTracked: new Date().toLocaleTimeString(),
      networkTests: [...debugInfo.networkTests]
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
      addNetworkTest('✓ Tracked with window.va');
    } else if (window.vaq) {
      window.vaq.push(['track', 'pageview']);
      console.log('AnalyticsDebug: Queued with window.vaq');
      addNetworkTest('⏳ Queued with window.vaq');
    } else if (window.__VERCEL_ANALYTICS__) {
      window.__VERCEL_ANALYTICS__.q.push(['track', 'pageview']);
      console.log('AnalyticsDebug: Queued in __VERCEL_ANALYTICS__');
      addNetworkTest('⏳ Queued in __VERCEL_ANALYTICS__');
    } else {
      console.log('AnalyticsDebug: No analytics available');
      addNetworkTest('❌ No analytics methods available');
    }
    
    updateDebugInfo();
  };

  const testScriptLoading = async () => {
    console.log('AnalyticsDebug: Testing script loading...');
    addNetworkTest('Testing script loading...');
    
    const testUrls = [
      'https://va.vercel-scripts.com/va.js',
      'https://vitals.vercel-insights.com/v1/vitals.js'
    ];

    for (const url of testUrls) {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
          addNetworkTest(`✓ ${url} - accessible`);
        } else {
          addNetworkTest(`❌ ${url} - ${response.status}`);
        }
      } catch (error) {
        addNetworkTest(`❌ ${url} - network error`);
      }
    }
  };

  const testManualTracking = async () => {
    console.log('AnalyticsDebug: Testing manual tracking...');
    addNetworkTest('Testing manual tracking...');
    
    try {
      const vitalsUrl = `https://vitals.vercel-insights.com/v1/vitals`;
      const data = {
        dsn: window.location.hostname,
        id: 'debug-test-' + Date.now(),
        page: window.location.pathname,
        href: window.location.href,
        event_name: 'debug-pageview',
        timestamp: Date.now()
      };

      const response = await fetch(vitalsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        addNetworkTest('✓ Manual tracking sent successfully');
      } else {
        addNetworkTest(`❌ Manual tracking failed: ${response.status}`);
      }
    } catch (error) {
      addNetworkTest(`❌ Manual tracking error: ${error}`);
    }
  };

  const addNetworkTest = (message: string) => {
    setDebugInfo(prev => ({
      ...prev,
      networkTests: [...prev.networkTests.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]
    }));
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

  const clearTests = () => {
    setDebugInfo(prev => ({ ...prev, networkTests: [] }));
  };

  // Only show in development or if debug query param is present
  const shouldShow = process.env.NODE_ENV === 'development' || 
                    (typeof window !== 'undefined' && window.location.search.includes('debug=analytics'));

  if (!shouldShow) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-black text-white p-4 rounded-lg shadow-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">Analytics Debug</h3>
      
      <div className="space-y-1 mb-3">
        <div>Consent: <span className={debugInfo.cookieConsent === 'accepted' ? 'text-green-400' : 'text-red-400'}>{debugInfo.cookieConsent}</span></div>
        <div>window.va: <span className={debugInfo.vaLoaded ? 'text-green-400' : 'text-red-400'}>{debugInfo.vaLoaded ? '✓' : '✗'}</span></div>
        <div>window.vaq: <span className={debugInfo.vaqExists ? 'text-green-400' : 'text-red-400'}>{debugInfo.vaqExists ? '✓' : '✗'}</span></div>
        <div>__VERCEL_ANALYTICS__: <span className={debugInfo.vercelAnalyticsExists ? 'text-green-400' : 'text-red-400'}>{debugInfo.vercelAnalyticsExists ? '✓' : '✗'}</span></div>
        <div>Script: <span className={debugInfo.scriptExists ? 'text-green-400' : 'text-red-400'}>{debugInfo.scriptExists ? '✓' : '✗'}</span></div>
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
          onClick={testScriptLoading}
          className="block w-full bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-xs"
        >
          Test Scripts
        </button>
        <button 
          onClick={testManualTracking}
          className="block w-full bg-orange-600 hover:bg-orange-700 px-2 py-1 rounded text-xs"
        >
          Test Manual
        </button>
      </div>

      <div className="space-y-1 mb-3">
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

      {debugInfo.networkTests.length > 0 && (
        <div className="border-t border-gray-600 pt-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold">Network Tests:</span>
            <button onClick={clearTests} className="text-gray-400 hover:text-white">×</button>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {debugInfo.networkTests.map((test, i) => (
              <div key={i} className="text-xs text-gray-300 break-words">{test}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 