import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Function to remove the Manus badge
const removeManusBadge = () => {
  const selectors = [
    '[class*="manus-badge"]',
    '[data-manus-badge]',
    '[id*="manus-badge"]',
    '[class*="manus_badge"]',
    '[data-manus_badge]',
    '[id*="manus_badge"]',
    '[class*="made-with-manus"]',
    '[data-made-with-manus]',
    '[id*="made-with-manus"]'
  ];

  let badgeRemoved = false;

  // Attempt with specific selectors first
  selectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el && el.parentElement) {
          // el.parentElement.removeChild(el);
          (el as HTMLElement).style.display = 'none';
          (el as HTMLElement).style.visibility = 'hidden';
          console.log('Manus badge hidden by selector:', selector);
          badgeRemoved = true;
        }
      });
    } catch (e) {
      console.error('Error removing badge with selector:', selector, e);
    }
  });

  // Fallback: Iterate through all divs and spans if not removed by specific selectors
  // This is more resource-intensive and should be a last resort.
  if (!badgeRemoved) {
    const allElements = document.querySelectorAll('div, span, a, p'); // Check common elements
    allElements.forEach(el => {
      if (el.textContent && el.textContent.toLowerCase().includes('made with manus')) {
        // Check if it's a small, badge-like element
        const rect = el.getBoundingClientRect();
        if (rect.width < 300 && rect.height < 100 && rect.width > 10 && rect.height > 10) { // Heuristic for badge size
            if (el.parentElement) {
                // el.parentElement.removeChild(el);
                (el as HTMLElement).style.display = 'none';
                (el as HTMLElement).style.visibility = 'hidden';
                console.log('Manus badge hidden by text content:', el.textContent);
                badgeRemoved = true;
            }
        }
      }
    });
  }

  if (badgeRemoved) {
    console.log('Manus badge removal attempts finished.');
  } else {
    console.log('Manus badge not found or could not be removed by JS.');
  }
};

// Run the removal function after the main content is likely loaded
// Using a small delay and DOMContentLoaded to ensure elements are present
if (document.readyState === 'loading') {  // Loading hasn't finished yet
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(removeManusBadge, 500); // Delay to catch dynamically injected badges
    setTimeout(removeManusBadge, 1500); // Second attempt with longer delay
    setTimeout(removeManusBadge, 3000); // Third attempt with even longer delay
  });
} else {  // `DOMContentLoaded` has already fired
  setTimeout(removeManusBadge, 500);
  setTimeout(removeManusBadge, 1500);
  setTimeout(removeManusBadge, 3000);
}

// Also try with a MutationObserver for dynamically added badges
const observer = new MutationObserver((_mutationsList, _observerInstance) => {
    removeManusBadge(); // Re-run removal on any DOM change
    // We can disconnect the observer if the badge is reliably removed and we want to save resources
    // For now, let it run to catch late injections.
    // if (document.querySelector('.manus-badge-class') === null) { // Example condition
    //    observerInstance.disconnect();
    // }
});

observer.observe(document.body, { childList: true, subtree: true });


// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

