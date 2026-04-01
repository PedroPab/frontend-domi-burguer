# Push Notifications - Domi Burguer

Este documento explica cómo funcionan las notificaciones push en la aplicación.

## Arquitectura

La app soporta **dos métodos** de notificaciones push:

1. **Web Push Nativo** (Principal) - Independiente de Firebase
2. **Firebase Cloud Messaging** (Fallback) - Si Web Push falla

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │     │     Backend     │     │  Push Service   │
│   (Next.js)     │     │   (Node.js)     │     │ (FCM/Web Push)  │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │ 1. Pedir permiso      │                       │
         │ 2. Obtener suscripción│                       │
         │ 3. Enviar al backend ─┼──────────────────────►│
         │                       │                       │
         │                       │ 4. Guardar suscripción│
         │                       │                       │
         │                       │ 5. Enviar notificación│
         │◄──────────────────────┼───────────────────────│
         │ 6. Mostrar notif      │                       │
```

---

## Configuración

### Variables de Entorno (.env)

```env
# Web Push (Nativo - Principal)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BLSmg-k2K0jjakDduIIRgwHTfzz4JrWtf6IhQi7Kl31kF0qEiRtDZyePjDYTzH8jk10VU1HAy9-EwWKSEqEvAcs
VAPID_PRIVATE_KEY=JbaU3tLzEGUolq1yzkRkZbEapS7bZWwz0A-K3qGXtWo

# Firebase (Fallback)
NEXT_PUBLIC_FIREBASE_VAPID_KEY=tu_firebase_vapid_key
```

### Generar nuevas VAPID keys

Si necesitas generar nuevas keys:

```bash
npx web-push generate-vapid-keys
```

---

## Frontend

### Archivos principales

| Archivo | Descripción |
|---------|-------------|
| `src/hooks/useNotifications.ts` | Hook principal para manejar notificaciones |
| `src/lib/webPush.ts` | Servicio de Web Push nativo |
| `src/lib/firebase.ts` | Configuración de Firebase Messaging |
| `src/components/pwa/NotificationBanner.tsx` | Banner para pedir permiso |
| `src/sw.ts` | Service Worker con manejo de push |
| `public/firebase-messaging-sw.js` | SW específico para Firebase |

### Usar el hook

```tsx
import { useNotifications } from '@/hooks/useNotifications';

function MyComponent() {
  const {
    permission,        // 'granted' | 'denied' | 'default' | 'unsupported'
    isLoading,         // boolean
    error,             // string | null
    requestPermission, // () => Promise<boolean>
    isSupported,       // boolean
    method,            // 'webpush' | 'firebase' | null
    subscription,      // PushSubscriptionData | null (Web Push)
    fcmToken,          // string | null (Firebase)
  } = useNotifications();

  const handleEnable = async () => {
    const success = await requestPermission();
    if (success) {
      console.log('Notificaciones activadas');
      // subscription o fcmToken contendrán los datos
    }
  };

  return (
    <button onClick={handleEnable} disabled={isLoading}>
      {isLoading ? 'Activando...' : 'Activar notificaciones'}
    </button>
  );
}
```

### Enviar suscripción al backend

Modifica `src/lib/webPush.ts`:

```typescript
export async function saveSubscriptionToBackend(
  subscription: PushSubscriptionData,
  userId?: string
): Promise<boolean> {
  const response = await fetch('/api/notifications/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription, userId }),
  });
  return response.ok;
}
```

---

## Backend

### Instalación

```bash
npm install web-push
```

### Configuración (Node.js)

```javascript
const webpush = require('web-push');

// Configurar VAPID
webpush.setVapidDetails(
  'mailto:contacto@domiburguer.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);
```

### Guardar suscripción

```javascript
// POST /api/notifications/subscribe
app.post('/api/notifications/subscribe', async (req, res) => {
  const { subscription, userId } = req.body;

  // Guardar en base de datos
  await db.collection('push_subscriptions').doc(userId || subscription.endpoint).set({
    subscription,
    userId,
    createdAt: new Date(),
  });

  res.json({ success: true });
});
```

### Enviar notificación individual

```javascript
// Ejemplo: Notificar que el pedido está listo
async function notifyOrderReady(userId, orderId) {
  // Obtener suscripción del usuario
  const doc = await db.collection('push_subscriptions').doc(userId).get();
  if (!doc.exists) return;

  const { subscription } = doc.data();

  const payload = JSON.stringify({
    title: '¡Tu pedido está listo!',
    body: 'Tu hamburguesa te espera en el mostrador',
    orderId: orderId,
    url: `/orders/${orderId}`,
    icon: '/icons/icon-192x192.png',
  });

  try {
    await webpush.sendNotification(subscription, payload);
    console.log('Notificación enviada');
  } catch (error) {
    if (error.statusCode === 410) {
      // Suscripción expirada, eliminar
      await db.collection('push_subscriptions').doc(userId).delete();
    }
    console.error('Error enviando notificación:', error);
  }
}
```

### Enviar notificación masiva (promociones)

```javascript
async function sendPromotion(title, body, url) {
  // Obtener todas las suscripciones
  const snapshot = await db.collection('push_subscriptions').get();

  const payload = JSON.stringify({
    title,
    body,
    url,
    icon: '/icons/icon-192x192.png',
  });

  const results = await Promise.allSettled(
    snapshot.docs.map(doc =>
      webpush.sendNotification(doc.data().subscription, payload)
    )
  );

  // Contar resultados
  const sent = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  console.log(`Promoción enviada: ${sent} exitosas, ${failed} fallidas`);
}

// Uso
sendPromotion(
  '🍔 ¡2x1 en hamburguesas!',
  'Solo por hoy, aprovecha esta promoción especial',
  '/'
);
```

### Estados de pedido

```javascript
// Cuando cambia el estado del pedido
async function onOrderStatusChange(orderId, newStatus, userId) {
  const messages = {
    'preparing': {
      title: '👨‍🍳 Preparando tu pedido',
      body: 'Estamos cocinando tu hamburguesa'
    },
    'ready': {
      title: '✅ ¡Tu pedido está listo!',
      body: 'Puedes pasar a recogerlo'
    },
    'on_the_way': {
      title: '🛵 ¡Tu pedido va en camino!',
      body: 'El repartidor salió con tu orden'
    },
    'delivered': {
      title: '🎉 ¡Pedido entregado!',
      body: '¡Buen provecho! Déjanos tu opinión'
    }
  };

  const message = messages[newStatus];
  if (!message) return;

  await notifyUser(userId, {
    ...message,
    orderId,
    url: `/orders/${orderId}`
  });
}
```

---

## Firebase (Alternativa)

Si prefieres usar solo Firebase:

### Backend con Firebase Admin

```javascript
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Enviar a un usuario
await admin.messaging().send({
  token: fcmToken,
  notification: {
    title: '¡Tu pedido está listo!',
    body: 'Tu hamburguesa te espera',
  },
  data: {
    orderId: '12345',
    url: '/orders/12345'
  }
});

// Enviar a múltiples usuarios
await admin.messaging().sendEachForMulticast({
  tokens: [token1, token2, token3],
  notification: {
    title: '🍔 ¡Promoción especial!',
    body: '2x1 en hamburguesas hoy'
  }
});
```

---

## Probar localmente

1. Las notificaciones **NO funcionan en desarrollo** (`npm run dev`)
2. Debes hacer build y correr en producción:

```bash
npm run build
npm run start
```

3. Abre http://localhost:3000
4. Verás el banner "Activa las notificaciones"
5. Al activar, el token/suscripción aparecerá en la consola

### Probar envío manual

```javascript
// En Node.js REPL o script de prueba
const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:test@test.com',
  'TU_PUBLIC_KEY',
  'TU_PRIVATE_KEY'
);

// Copia la suscripción de la consola del navegador
const subscription = {
  endpoint: 'https://...',
  keys: { p256dh: '...', auth: '...' }
};

webpush.sendNotification(subscription, JSON.stringify({
  title: 'Prueba',
  body: 'Esta es una notificación de prueba'
}));
```

---

## Troubleshooting

### La notificación no aparece

1. Verifica que el permiso esté concedido: `Notification.permission === 'granted'`
2. Verifica que el Service Worker esté registrado: DevTools > Application > Service Workers
3. Verifica la consola por errores

### Error 401 al enviar

- Las VAPID keys no coinciden entre frontend y backend

### Error 410 Gone

- La suscripción expiró. Elimínala de la base de datos.

### No funciona en iOS

- Safari en iOS tiene soporte limitado para Web Push
- Solo funciona si la PWA está instalada (Add to Home Screen)
- Requiere iOS 16.4 o superior
