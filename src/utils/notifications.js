/**
 * Sistema de Notificações para o App
 */

// Solicitar permissão de notificações
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Este navegador não suporta notificações')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

// Enviar notificação simples
export const showNotification = (title, options = {}) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    console.log('Notificações não permitidas')
    return
  }

  const defaultOptions = {
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    requireInteraction: false,
    ...options
  }

  return new Notification(title, defaultOptions)
}

// Agendar notificação para um horário específico
export const scheduleNotification = (title, body, targetTime, tag = null) => {
  const now = new Date()
  const target = new Date(targetTime)
  const delay = target - now

  if (delay <= 0) {
    console.log('Horário já passou')
    return null
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      // Enviar mensagem para o service worker
      registration.active?.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        title,
        body,
        delay,
        tag: tag || `notification-${Date.now()}`
      })
    })
  } else {
    // Fallback para notificação simples
    setTimeout(() => {
      showNotification(title, { body })
    }, delay)
  }
}

// Lembrete de água
export const scheduleWaterReminder = (targetHour) => {
  const now = new Date()
  const reminderTime = new Date()
  reminderTime.setHours(targetHour, 0, 0, 0)
  
  // Se já passou hoje, agendar para amanhã
  if (reminderTime <= now) {
    reminderTime.setDate(reminderTime.getDate() + 1)
  }

  scheduleNotification(
    '💧 Hora de Beber Água!',
    'Lembre-se de manter-se hidratado durante o dia.',
    reminderTime,
    `water-${targetHour}`
  )
}

// Lembrete de refeição
export const scheduleMealReminder = (mealName, mealTime, minutesBefore = 15) => {
  const [hours, minutes] = mealTime.split(':').map(Number)
  const reminderTime = new Date()
  reminderTime.setHours(hours, minutes - minutesBefore, 0, 0)
  
  // Se já passou hoje, agendar para amanhã
  const now = new Date()
  if (reminderTime <= now) {
    reminderTime.setDate(reminderTime.getDate() + 1)
  }

  scheduleNotification(
    `🍽️ ${mealName} em ${minutesBefore} minutos!`,
    `Não esqueça de preparar sua refeição: ${mealName} às ${mealTime}`,
    reminderTime,
    `meal-${mealName.toLowerCase().replace(/\s+/g, '-')}`
  )
}

// Agendar múltiplos lembretes de água
export const scheduleAllWaterReminders = (hours = [8, 10, 12, 14, 16, 18, 20]) => {
  hours.forEach(hour => {
    scheduleWaterReminder(hour)
  })
}

// Verificar se pode enviar notificações
export const canSendNotifications = () => {
  return 'Notification' in window && Notification.permission === 'granted'
}

// Explicação sobre WhatsApp (não implementável sem API paga)
export const getWhatsAppInfo = () => {
  return {
    possible: false,
    reason: 'WhatsApp requer API Business paga e servidor backend',
    alternatives: [
      'Notificações do navegador (já implementado)',
      'Instalar como PWA no celular',
      'Usar notificações nativas do sistema',
      'Integração futura com Telegram Bot (gratuito)'
    ]
  }
}

