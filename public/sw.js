self.addEventListener("push", (event) => {
    const data = event.data?.json() ?? {};
    const title = data.title || "Notification RATP";
    const options = {
      body: data.body || "Un équipement a changé de statut",
      icon: "/icons/icon-512x512.png",
      badge: "/icons/badge.png",
      data: data.url ? { url: data.url } : {},
    };
  
    event.waitUntil(self.registration.showNotification(title, options));
  });
  
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const url = event.notification.data?.url;
    if (url) {
      event.waitUntil(clients.openWindow(url));
    }
  });
  