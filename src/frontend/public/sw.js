/* Sahayak Service Worker — background scam protection */

const CACHE_NAME = "sahayak-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      if (
        self.registration.showNotification &&
        Notification.permission === "granted"
      ) {
        await self.registration.showNotification("Sahayak Active", {
          body: "Sahayak is active - Protecting you from scams",
          icon: "/assets/generated/trust-seal-transparent.dim_120x120.png",
          badge: "/assets/generated/trust-seal-transparent.dim_120x120.png",
          tag: "sahayak-active",
          renotify: false,
        });
      }
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", async (event) => {
  if (event.data && event.data.type === "SHOW_PROTECTION_NOTIFICATION") {
    if (
      self.registration.showNotification &&
      Notification.permission === "granted"
    ) {
      await self.registration.showNotification("Sahayak is Watching", {
        body: "Sahayak is watching over you. Stay safe from scams!",
        icon: "/assets/generated/trust-seal-transparent.dim_120x120.png",
        badge: "/assets/generated/trust-seal-transparent.dim_120x120.png",
        tag: "sahayak-watching",
        renotify: true,
      });
    }
  }
});

self.addEventListener("fetch", (event) => {
  // Pass through — no caching strategy needed
  event.respondWith(fetch(event.request));
});
