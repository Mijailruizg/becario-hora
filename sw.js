// Service Worker para UniBecario
// Maneja notificaciones persistentes de jornadas y recordatorios

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Manejar clics en la notificación
self.addEventListener('notificationclick', (event) => {
  const tag = event.notification.tag;
  
  // Notificación de jornada en progreso
  if (tag === 'unibecario-jornada') {
    if (event.action === 'finish') {
      event.notification.close();
      event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
          for (let client of clientList) {
            if (client.url.includes('index.html')) {
              client.focus();
              client.postMessage({ type: 'FINISH_FROM_NOTIFICATION' });
              return client;
            }
          }
          if (clients.openWindow) {
            return clients.openWindow('/index.html').then(client => {
              if (client) {
                setTimeout(() => {
                  client.postMessage({ type: 'FINISH_FROM_NOTIFICATION' });
                }, 500);
              }
            });
          }
        })
      );
    } else {
      event.notification.close();
      event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
          for (let client of clientList) {
            if (client.url.includes('index.html')) {
              client.focus();
              return client;
            }
          }
          if (clients.openWindow) {
            return clients.openWindow('/index.html');
          }
        })
      );
    }
  }
  
  // Recordatorio de inicio
  else if (tag === 'unibecario-reminder-start') {
    event.notification.close();
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (let client of clientList) {
          if (client.url.includes('index.html')) {
            client.focus();
            client.postMessage({ type: 'START_JORNADA_FROM_REMINDER' });
            return client;
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/index.html').then(client => {
            if (client) {
              setTimeout(() => {
                client.postMessage({ type: 'START_JORNADA_FROM_REMINDER' });
              }, 500);
            }
          });
        }
      })
    );
  }
  
  // Recordatorio de finalización
  else if (tag === 'unibecario-reminder-end') {
    event.notification.close();
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (let client of clientList) {
          if (client.url.includes('index.html')) {
            client.focus();
            client.postMessage({ type: 'FINISH_FROM_NOTIFICATION' });
            return client;
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/index.html').then(client => {
            if (client) {
              setTimeout(() => {
                client.postMessage({ type: 'FINISH_FROM_NOTIFICATION' });
              }, 500);
            }
          });
        }
      })
    );
  }
});

// Mantener el Service Worker activo
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'KEEP_ALIVE') {
    // Solo para mantener el worker activo
  }
  if (event.data && event.data.type === 'UPDATE_NOTIFICATION') {
    // Actualizar notificación si es necesario
    self.registration.getNotifications().then(notifications => {
      notifications.forEach(notification => {
        if (notification.tag === 'unibecario-jornada') {
          notification.close();
        }
      });
    });
  }
});
