// --- PWA registration + "update available" banner ---
// Paste this before </body> in bali-trip-dashboard.html (renamed to index.html)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then((registration) => {

      // Check for a new version every time the app is opened/foregrounded
      registration.update();

      // Fires when a new sw.js has been fetched and is installing
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateBanner(registration);
          }
        });
      });
    });

    // When the new service worker takes control, reload once to show new content
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
}

function showUpdateBanner(registration) {
  const banner = document.createElement('div');
  banner.style.cssText = `
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 9999;
    background: #1a73e8; color: #fff; padding: 12px 16px;
    display: flex; align-items: center; justify-content: space-between;
    font-family: system-ui, sans-serif; font-size: 14px;
    box-shadow: 0 -2px 8px rgba(0,0,0,0.15);
  `;
  banner.innerHTML = `
    <span>A new version of the trip dashboard is available.</span>
    <button id="pwa-update-btn" style="
      background: #fff; color: #1a73e8; border: none; border-radius: 6px;
      padding: 6px 14px; font-weight: 600; margin-left: 12px; cursor: pointer;
    ">Update now</button>
  `;
  document.body.appendChild(banner);

  document.getElementById('pwa-update-btn').addEventListener('click', () => {
    registration.waiting.postMessage('SKIP_WAITING');
    banner.remove();
  });
}
