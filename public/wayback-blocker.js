// Wayback Machine JavaScript blocker
// This script prevents dynamic chunk loading when served through web.archive.org
(function () {
  'use strict';

  // Check if we're on Wayback Machine
  var isWayback =
    window.location.hostname.includes('web.archive.org') ||
    window.location.href.includes('web.archive.org');

  if (!isWayback) {
    return; // Not on Wayback Machine, allow normal operation
  }

  // We're on Wayback Machine - disable all dynamic imports
  console.info('Wayback Machine detected - JavaScript features disabled for compatibility');

  // Show the Wayback Machine banner
  document.addEventListener('DOMContentLoaded', function () {
    var banner = document.querySelector('.wayback-banner');
    if (banner) {
      banner.style.display = 'block';
    }
  });

  // Override dynamic import to prevent chunk loading errors
  if (typeof window !== 'undefined') {
    // Store original methods
    var originalImport = window.import;
    var originalFetch = window.fetch;

    // Disable dynamic imports by making them no-ops
    window.import = function () {
      console.warn('Dynamic import blocked on Wayback Machine');
      return Promise.reject(new Error('Dynamic imports disabled on archived version'));
    };

    // Block fetch requests to Next.js chunks to prevent errors
    window.fetch = function (url) {
      if (typeof url === 'string' && url.includes('/_next/')) {
        console.warn('Next.js chunk fetch blocked on Wayback Machine:', url);
        return Promise.reject(new Error('Chunk loading disabled on archived version'));
      }
      return originalFetch.apply(this, arguments);
    };

    // Prevent Next.js from trying to load modules
    if (window.__next_f) {
      window.__next_f = [];
    }
    if (window.__NEXT_DATA__) {
      if (window.__NEXT_DATA__.props) {
        window.__NEXT_DATA__.props.isWayback = true;
      }
    }

    // Block React hydration to prevent errors
    document.addEventListener('DOMContentLoaded', function () {
      // Remove all script tags that might try to load Next.js chunks
      var scripts = document.querySelectorAll('script[src*="/_next/"]');
      scripts.forEach(function (script) {
        script.remove();
      });
    });
  }
})();
