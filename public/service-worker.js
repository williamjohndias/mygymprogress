// Service Worker para notificações push e funcionamento offline
const CACHE_NAME = 'nutrition-pro-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx'
]

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      )
    })
  )
})

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request)
      })
  )
})

// Receber mensagens do app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    scheduleNotification(event.data)
  }
})

// Agendar notificação
function scheduleNotification(data) {
  const { title, body, delay, tag } = data
  
  setTimeout(() => {
    self.registration.showNotification(title, {
      body: body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: tag || 'nutrition-reminder',
      requireInteraction: false,
      vibrate: [200, 100, 200],
      data: {
        url: '/'
      }
    })
  }, delay || 0)
}

// Notificações programadas
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    }
  }

  event.waitUntil(
    self.registration.showNotification('Nutrition Pro', options)
  )
})

// Clique na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  )
})

// Agendar notificações recorrentes
function scheduleRecurringNotifications() {
  // Lembretes de água - a cada 2 horas
  const waterHours = [8, 10, 12, 14, 16, 18, 20]
  const now = new Date()
  
  waterHours.forEach(hour => {
    const reminderTime = new Date()
    reminderTime.setHours(hour, 0, 0, 0)
    
    if (reminderTime > now) {
      const delay = reminderTime - now
      setTimeout(() => {
        self.registration.showNotification('💧 Hora de Beber Água!', {
          body: 'Lembre-se de manter-se hidratado!',
          icon: '/icon-192.png',
          tag: `water-${hour}`,
          vibrate: [200, 100, 200]
        })
      }, delay)
    }
  })
}

// Executar ao ativar
scheduleRecurringNotifications()

