// Firebase Messaging Service Worker
// Este archivo maneja las notificaciones push cuando la app está en background

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Configuración de Firebase (debe coincidir con tu configuración)
firebase.initializeApp({
  apiKey: "AIzaSyD8F6oYTMnQWwyMLwcl87-rg_DUJYD3CUg",
  authDomain: "domiburguer.firebaseapp.com",
  projectId: "domiburguer",
  storageBucket: "domiburguer.firebasestorage.app",
  messagingSenderId: "722900966985",
  appId: "1:722900966985:web:d16ef02fe7b8678745e998",
});

const messaging = firebase.messaging();

// Manejar notificaciones en background
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'Domi Burguer';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    image: payload.notification?.image,
    data: payload.data,
    actions: [
      {
        action: 'open',
        title: 'Ver',
      },
    ],
    vibrate: [200, 100, 200],
    tag: payload.data?.orderId || 'default',
    renotify: true,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Manejar click en notificación
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click:', event);

  event.notification.close();

  // Determinar a dónde navegar
  let urlToOpen = '/';

  if (event.notification.data) {
    if (event.notification.data.orderId) {
      urlToOpen = `/orders/${event.notification.data.orderId}`;
    } else if (event.notification.data.url) {
      urlToOpen = event.notification.data.url;
    }
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si ya hay una ventana abierta, enfocarla y navegar
      for (const client of clientList) {
        if ('focus' in client && 'navigate' in client) {
          client.focus();
          return client.navigate(urlToOpen);
        }
      }
      // Si no hay ventana, abrir una nueva
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
