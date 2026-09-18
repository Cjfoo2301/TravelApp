# Turning bali-trip-dashboard.html into an installable app with update notifications

## 1. Repo structure
In `Cjfoo2301/TravelApp`, arrange files like this:

```
/index.html          <- your bali-trip-dashboard.html, renamed
/manifest.json
/sw.js
/icons/icon-192.png
/icons/icon-512.png
```

(Renaming to `index.html` matters for GitHub Pages to serve it at the root URL.)

## 2. Link the manifest
In the `<head>` of index.html, add:
```html
<link rel="manifest" href="./manifest.json">
<meta name="theme-color" content="#1a73e8">
```

## 3. Add the update-notifier script
Paste the contents of `update-notifier.js` into a `<script>` tag right before `</body>` in index.html (or add it as a separate file and reference it: `<script src="./update-notifier.js"></script>`).

## 4. Add icons
Drop a 192x192 and 512x512 PNG icon into `/icons/`. Any square logo/image works — these just define the home-screen icon.

## 5. Turn on GitHub Pages
- Repo → Settings → Pages
- Source: "Deploy from a branch" → branch `main`, folder `/root`
- Save. GitHub gives you a URL like `https://cjfoo2301.github.io/TravelApp/`

## 6. Install it on a phone
- Open that URL in Safari (iOS) or Chrome (Android)
- iOS: Share → "Add to Home Screen"
- Android: Chrome menu → "Install app" (or it'll prompt automatically)
- It now opens full-screen, no browser bar, own icon — like a native app

## 7. Every time you push an update to the repo
1. Edit index.html as needed and push.
2. **Bump `CACHE_VERSION` in `sw.js`** (e.g. `'v1'` → `'v2'`). This one-line change is what tells the browser a new version exists — without it, the service worker looks identical and no update is detected.
3. Push both changes.
4. Next time each user opens the app, it'll silently check, find the new version, and show the "Update now" banner at the bottom.

## Limits of this approach (no backend)
- Users only get notified **when they open the app**. If someone hasn't opened it in weeks, they won't see a push notification while it's closed.
- If you later want a true push notification (phone buzzes even with the app closed), that needs: a GitHub webhook on push → a small server or serverless function (e.g. a free Cloudflare Worker) → Web Push API with VAPID keys. Happy to build that layer too if/when you need it — it's a bigger piece since it requires hosting a tiny backend somewhere.
