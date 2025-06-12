"use client";

import React, { useState, useEffect } from 'react';

export default function CookieDisclaimer() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = async () => {
    setIsLoading(true);
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    console.log('Cookies accepted, enabling analytics...');
    
    // Check if the Vercel Analytics is available and track consent
    if (typeof (window as any).va === 'function') {
      (window as any).va('track', 'cookie-consent', { action: 'accepted' });
    }
    
    setTimeout(() => {
      setIsVisible(false);
      setIsLoading(false);
    }, 500);
  };

  const handleDecline = () => {
    setIsLoading(true);
    localStorage.setItem('cookieConsent', 'declined');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    console.log('Cookies declined');
    
    setTimeout(() => {
      setIsVisible(false);
      setIsLoading(false);
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white p-4 shadow-lg animate-fadein">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm md:text-base">
            Diese Website verwendet Cookies und ähnliche Technologien, um Ihre Erfahrung zu verbessern 
            und anonyme Nutzungsstatistiken zu sammeln. Durch die Nutzung unserer Website stimmen Sie 
            der Verwendung von Cookies zu.{' '}
            <a 
              href="/datenschutz" 
              className="underline hover:text-blue-300 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Weitere Informationen
            </a>
          </p>
        </div>
        
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleDecline}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-500 text-gray-300 rounded hover:bg-gray-800 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Lädt...' : 'Ablehnen'}
          </button>
          <button
            onClick={handleAccept}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Lädt...' : 'Akzeptieren'}
          </button>
        </div>
      </div>
    </div>
  );
} 