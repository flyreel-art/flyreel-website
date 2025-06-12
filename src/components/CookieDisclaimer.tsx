"use client";

import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    va?: (...args: any[]) => void;
    vaq?: any[];
  }
}

export default function CookieDisclaimer() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    console.log('CookieDisclaimer: Current consent status:', cookieConsent);
    
    if (!cookieConsent) {
      // Show disclaimer after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
        console.log('CookieDisclaimer: Showing cookie disclaimer');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const initializeAnalytics = () => {
    console.log('CookieDisclaimer: Initializing analytics after consent...');
    
    // Create analytics queue if it doesn't exist
    if (!window.vaq) {
      window.vaq = [];
    }
    
    // Initialize Vercel Analytics when cookies are accepted
    const existingScript = document.querySelector('script[src="https://va.vercel-scripts.com/va.js"]');
    
    if (!existingScript) {
      console.log('CookieDisclaimer: Loading Vercel Analytics script...');
      
      const script = document.createElement('script');
      script.src = 'https://va.vercel-scripts.com/va.js';
      script.defer = true;
      script.async = true;
      
      script.onload = () => {
        console.log('CookieDisclaimer: Analytics script loaded, tracking pageview...');
        // Track initial page view after consent
        if (window.va) {
          window.va('track', 'pageview');
        } else {
          // Queue the pageview if va isn't ready yet
          window.vaq?.push(['track', 'pageview']);
        }
      };
      
      script.onerror = () => {
        console.error('CookieDisclaimer: Failed to load analytics script');
      };
      
      document.head.appendChild(script);
    } else {
      console.log('CookieDisclaimer: Analytics script already exists, tracking pageview...');
      // Script already exists, track pageview immediately
      if (window.va) {
        window.va('track', 'pageview');
      } else {
        window.vaq?.push(['track', 'pageview']);
      }
    }
  };

  const removeAnalytics = () => {
    console.log('CookieDisclaimer: Removing analytics...');
    
    // Remove analytics script if it exists
    const existingScript = document.querySelector('script[src="https://va.vercel-scripts.com/va.js"]');
    if (existingScript) {
      existingScript.remove();
      console.log('CookieDisclaimer: Analytics script removed');
    }
    
    // Clear analytics function and queue
    if (window.va) {
      delete window.va;
    }
    if (window.vaq) {
      delete window.vaq;
    }
  };

  const handleAccept = () => {
    console.log('CookieDisclaimer: User accepted cookies');
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    // Initialize analytics immediately
    initializeAnalytics();
    
    closeDisclaimer();
  };

  const handleDecline = () => {
    console.log('CookieDisclaimer: User declined cookies');
    localStorage.setItem('cookieConsent', 'declined');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    // Clear any existing cookies (except essential ones)
    clearNonEssentialCookies();
    removeAnalytics();
    
    closeDisclaimer();
  };

  const clearNonEssentialCookies = () => {
    // Clear any non-essential cookies here
    // This is a basic implementation - you may need to customize based on your actual cookies
    const cookies = document.cookie.split(";");
    
    for (let cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      
      // Don't clear essential cookies (add your essential cookie names here)
      const essentialCookies = ['cookieConsent', 'cookieConsentDate'];
      if (!essentialCookies.includes(name)) {
        // Clear the cookie
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
      }
    }
  };

  const closeDisclaimer = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg transition-all duration-300 ${
        isClosing ? 'transform translate-y-full opacity-0' : 'transform translate-y-0 opacity-100'
      }`}
      style={{ fontFamily: 'Montserrat, Nunito Sans, Work Sans, Arial, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-semibold">We use cookies</span> to enhance your browsing experience and analyze our traffic. 
              Cookies help us provide you with a better service and improve our website functionality. 
              By clicking &ldquo;Accept All&rdquo;, you consent to our use of cookies. You can manage your preferences or learn more in our{' '}
              <a 
                href="/datenschutz" 
                className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-gray-900 rounded-lg hover:bg-gray-800 hover:border-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 