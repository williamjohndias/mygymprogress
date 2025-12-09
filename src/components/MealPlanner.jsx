import React, { useState, useEffect } from 'react'
import { getUserData } from '../utils/storage'
import { calculateNutrition } from '../utils/calculations'
import { 
  requestNotificationPermission, 
  scheduleAllWaterReminders,
  scheduleMealReminder,
  canSendNotifications 
} from '../utils/notifications'
import './MealPlanner.css'

function MealPlanner({ user }) {
  const [meals, setMeals] = useState([
    { id: 1, name: 'Café da Manhã', time: '07:00', protein: '', carbs: '', fats: '', calories: '', checked: false },
    { id: 2, name: 'Lanche da Manhã', time: '10:00', protein: '', carbs: '', fats: '', calories: '', checked: false },
    { id: 3, name: 'Almoço', time: '12:30', protein: '', carbs: '', fats: '', calories: '', checked: false },
    { id: 4, name: 'Lanche da Tarde', time: '16:00', protein: '', carbs: '', fats: '', calories: '', checked: false },
    { id: 5, name: 'Jantar', time: '19:30', protein: '', carbs: '', fats: '', calories: '', checked: false },
    { id: 6, name: 'Ceia', time: '22:00', protein: '', carbs: '', fats: '', calories: '', checked: false }
  ])
  const [waterGlasses, setWaterGlasses] = useState(0)
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])
  const [targets, setTargets] = useState(null)
  const [editingMeal, setEditingMeal] = useState(null)
  const [notificationStatus, setNotificationStatus] = useState(null)

  useEffect(() => {
    loadDayData()
    loadTargets()
    
    // Verificar status de notificações
    if (canSendNotifications()) {
      setNotificationStatus('enabled')
    } else if (Notification.permission === 'denied') {
      setNotificationStatus('denied')
    } else {
      setNotificationStatus('pending')
    }
  }, [user, currentDate])

  useEffect(() => {
    if (notificationStatus === 'enabled') {
      scheduleAllWaterReminders()
      meals.forEach(meal => {
        if (meal.time && meal.name) {
          scheduleMealReminder(meal.name, meal.time, 15)
        }
      })
    }
    
    // Verificar lembretes a cada minuto
    const interval = setInterval(() => {
      checkWaterReminders()
    }, 60000)
    return () => clearInterval(interval)
  }, [meals, waterGlasses, targets, notificationStatus])

  const loadTargets = () => {
    const data = getUserData(user)
    if (data) {
      const results = calculateNutrition(data)
      if (results && results.macros) {
        setTargets({
          calories: results.targetCalories || 0,
          protein: results.macros.protein || 0,
          carbs: results.macros.carbs || 0,
          fats: results.macros.fats || 0,
          water: results.water || 0
        })
      }
    }
  }

  const loadDayData = () => {
    const key = `mealPlanner_${user}_${currentDate}`
    const saved = localStorage.getItem(key)
    if (saved) {
      const data = JSON.parse(saved)
      setMeals(data.meals || meals)
      setWaterGlasses(data.waterGlasses || 0)
    } else {
      // Carregar template padrão se não houver dados
      loadDefaultMeals()
    }
  }

  const loadDefaultMeals = () => {
    const key = `mealPlanner_template_${user}`
    const saved = localStorage.getItem(key)
    if (saved) {
      const template = JSON.parse(saved)
      setMeals(template.map(meal => ({ ...meal, checked: false })))
    }
  }

  const saveDayData = () => {
    const key = `mealPlanner_${user}_${currentDate}`
    localStorage.setItem(key, JSON.stringify({
      meals,
      waterGlasses,
      date: currentDate
    }))
  }

  const saveTemplate = () => {
    const key = `mealPlanner_template_${user}`
    const mealsWithoutChecked = meals.map(({ checked, ...rest }) => rest)
    localStorage.setItem(key, JSON.stringify(mealsWithoutChecked))
    alert('Template de refeições salvo!')
  }

  const handleMealChange = (id, field, value) => {
    const updatedMeals = meals.map(meal => {
      if (meal.id === id) {
        const updated = { ...meal, [field]: value }
        // Calcular calorias automaticamente se não fornecidas
        if (field !== 'calories' && (field === 'protein' || field === 'carbs' || field === 'fats')) {
          const protein = field === 'protein' ? parseFloat(value) || 0 : parseFloat(meal.protein) || 0
          const carbs = field === 'carbs' ? parseFloat(value) || 0 : parseFloat(meal.carbs) || 0
          const fats = field === 'fats' ? parseFloat(value) || 0 : parseFloat(meal.fats) || 0
          updated.calories = (protein * 4 + carbs * 4 + fats * 9).toFixed(0)
        }
        return updated
      }
      return meal
    })
    setMeals(updatedMeals)
  }

  const handleMealCheck = (id) => {
    const updatedMeals = meals.map(meal => {
      if (meal.id === id) {
        return { ...meal, checked: !meal.checked }
      }
      return meal
    })
    setMeals(updatedMeals)
  }

  const handleWaterGlass = () => {
    const newGlasses = waterGlasses + 1
    setWaterGlasses(newGlasses)
  }

  const handleTimeChange = (id, time) => {
    handleMealChange(id, 'time', time)
  }

  const calculateTotals = () => {
    const checkedMeals = meals.filter(m => m.checked)
    return checkedMeals.reduce((acc, meal) => {
      acc.protein += parseFloat(meal.protein) || 0
      acc.carbs += parseFloat(meal.carbs) || 0
      acc.fats += parseFloat(meal.fats) || 0
      acc.calories += parseFloat(meal.calories) || 0
      return acc
    }, { protein: 0, carbs: 0, fats: 0, calories: 0 })
  }

  const calculatePlannedTotals = () => {
    return meals.reduce((acc, meal) => {
      acc.protein += parseFloat(meal.protein) || 0
      acc.carbs += parseFloat(meal.carbs) || 0
      acc.fats += parseFloat(meal.fats) || 0
      acc.calories += parseFloat(meal.calories) || 0
      return acc
    }, { protein: 0, carbs: 0, fats: 0, calories: 0 })
  }

  const totals = calculateTotals()
  const plannedTotals = calculatePlannedTotals()

  const waterPerGlass = 250 // ml
  const waterConsumed = waterGlasses * waterPerGlass
  const waterProgress = targets ? (waterConsumed / targets.water) * 100 : 0

  const checkWaterReminders = () => {
    if (!targets) return
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    // Lembretes de água a cada 2 horas (8h, 10h, 12h, 14h, 16h, 18h, 20h)
    const reminderHours = [8, 10, 12, 14, 16, 18, 20]
    if (reminderHours.includes(currentHour) && currentMinute === 0) {
      const expectedProgress = ((currentHour - 6) / 14) * 100
      if (waterProgress < expectedProgress) {
        // Notificação (pode usar Notification API se permitido)
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('💧 Hora de Beber Água!', {
            body: `Você já bebeu ${waterGlasses} copos hoje. Meta: ${Math.round(targets.water / waterPerGlass)} copos.`,
            icon: '/favicon.ico'
          })
        }
      }
    }

    // Verificar lembretes de refeições
    meals.forEach(meal => {
      if (meal.time && !meal.checked) {
        const [hours, minutes] = meal.time.split(':').map(Number)
        if (currentHour === hours && currentMinute === minutes - 15) {
          // Lembrete 15 minutos antes
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`🍽️ ${meal.name} em 15 minutos!`, {
              body: `Não esqueça de preparar sua refeição: ${meal.name} às ${meal.time}`,
              icon: '/favicon.ico'
            })
          }
        }
      }
    })
  }

  useEffect(() => {
    saveDayData()
  }, [meals, waterGlasses])

  const getNextMealTime = () => {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()

    const upcomingMeals = meals
      .filter(meal => !meal.checked && meal.time)
      .map(meal => {
        const [hours, minutes] = meal.time.split(':').map(Number)
        const mealTime = hours * 60 + minutes
        return { ...meal, mealTime, diff: mealTime - currentTime }
      })
      .filter(meal => meal.diff >= 0)
      .sort((a, b) => a.diff - b.diff)

    return upcomingMeals[0] || null
  }

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission()
    if (granted) {
      setNotificationStatus('enabled')
      scheduleAllWaterReminders()
      meals.forEach(meal => {
        if (meal.time && meal.name) {
          scheduleMealReminder(meal.name, meal.time, 15)
        }
      })
      alert('Notificações ativadas! Você receberá lembretes de água e refeições.')
    } else {
      setNotificationStatus('denied')
      alert('Notificações bloqueadas. Por favor, permita no navegador e tente novamente.')
    }
  }

  const nextMeal = getNextMealTime()

  if (!targets) {
    return (
      <div className="meal-planner-empty">
        <p>Configure seus dados primeiro para ver suas metas nutricionais.</p>
      </div>
    )
  }

  return (
    <div className="meal-planner">
      <div className="planner-header">
        <h2>Planejamento de Refeições</h2>
        <div className="header-actions">
          <input
            type="date"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
            className="date-picker"
          />
          {notificationStatus === 'pending' && (
            <button className="btn-notification" onClick={handleEnableNotifications}>
              🔔 Ativar Notificações
            </button>
          )}
          {notificationStatus === 'enabled' && (
            <span className="notification-badge">🔔 Ativo</span>
          )}
        </div>
      </div>

      {/* Resumo Rápido */}
      <div className="quick-summary">
        <div className="summary-box">
          <div className="summary-label">Total Planejado</div>
          <div className="summary-macros">
            <span>C: {plannedTotals.calories.toFixed(0)}</span>
            <span>P: {plannedTotals.protein.toFixed(0)}g</span>
            <span>C: {plannedTotals.carbs.toFixed(0)}g</span>
            <span>G: {plannedTotals.fats.toFixed(0)}g</span>
          </div>
        </div>
        <div className="summary-box">
          <div className="summary-label">Total Consumido</div>
          <div className="summary-macros">
            <span>C: {totals.calories.toFixed(0)}</span>
            <span>P: {totals.protein.toFixed(0)}g</span>
            <span>C: {totals.carbs.toFixed(0)}g</span>
            <span>G: {totals.fats.toFixed(0)}g</span>
          </div>
        </div>
        <div className="summary-box">
          <div className="summary-label">Restante</div>
          <div className="summary-macros">
            <span>C: {(targets.calories - totals.calories).toFixed(0)}</span>
            <span>P: {(targets.protein - totals.protein).toFixed(0)}g</span>
            <span>C: {(targets.carbs - totals.carbs).toFixed(0)}g</span>
            <span>G: {(targets.fats - totals.fats).toFixed(0)}g</span>
          </div>
        </div>
      </div>

      {/* Água */}
      <div className="water-section">
        <div className="water-header">
          <h3>💧 Água</h3>
          <div className="water-progress">
            <span>{waterGlasses} copos</span>
            <span>{waterConsumed.toFixed(0)} / {targets.water.toFixed(0)} ml</span>
          </div>
        </div>
        <div className="water-bar">
          <div
            className="water-fill"
            style={{
              width: `${Math.min(waterProgress, 100)}%`,
              backgroundColor: waterProgress >= 100 ? '#10b981' : '#06b6d4'
            }}
          />
        </div>
        <button className="btn-water" onClick={handleWaterGlass}>
          + 1 Copo (250ml)
        </button>
      </div>

      {/* Próxima Refeição */}
      {nextMeal && (
        <div className="next-meal-reminder">
          <span className="reminder-icon">⏰</span>
          <div className="reminder-content">
            <div className="reminder-title">Próxima Refeição</div>
            <div className="reminder-meal">{nextMeal.name} às {nextMeal.time}</div>
          </div>
        </div>
      )}

      {/* Lista de Refeições */}
      <div className="meals-list">
        <div className="meals-header">
          <h3>Refeições do Dia</h3>
          <button className="btn-secondary small" onClick={saveTemplate}>
            Salvar Template
          </button>
        </div>

        {meals.map((meal) => (
          <div key={meal.id} className={`meal-card ${meal.checked ? 'checked' : ''}`}>
            <div className="meal-checkbox">
              <input
                type="checkbox"
                checked={meal.checked}
                onChange={() => handleMealCheck(meal.id)}
                id={`meal-${meal.id}`}
              />
              <label htmlFor={`meal-${meal.id}`}></label>
            </div>

            <div className="meal-content">
              <div className="meal-header">
                <div className="meal-name-time">
                  <span className="meal-name">{meal.name}</span>
                  <input
                    type="time"
                    value={meal.time}
                    onChange={(e) => handleTimeChange(meal.id, e.target.value)}
                    className="time-input"
                  />
                </div>
              </div>

              {editingMeal === meal.id ? (
                <div className="meal-inputs">
                  <input
                    type="number"
                    placeholder="Proteína (g)"
                    value={meal.protein}
                    onChange={(e) => handleMealChange(meal.id, 'protein', e.target.value)}
                    className="macro-input-small"
                  />
                  <input
                    type="number"
                    placeholder="Carbs (g)"
                    value={meal.carbs}
                    onChange={(e) => handleMealChange(meal.id, 'carbs', e.target.value)}
                    className="macro-input-small"
                  />
                  <input
                    type="number"
                    placeholder="Gorduras (g)"
                    value={meal.fats}
                    onChange={(e) => handleMealChange(meal.id, 'fats', e.target.value)}
                    className="macro-input-small"
                  />
                  <input
                    type="number"
                    placeholder="Calorias"
                    value={meal.calories}
                    onChange={(e) => handleMealChange(meal.id, 'calories', e.target.value)}
                    className="macro-input-small"
                  />
                  <button
                    className="btn-small"
                    onClick={() => setEditingMeal(null)}
                  >
                    ✓
                  </button>
                </div>
              ) : (
                <div className="meal-macros-display">
                  {meal.protein || meal.carbs || meal.fats ? (
                    <>
                      <span>P: {parseFloat(meal.protein) || 0}g</span>
                      <span>C: {parseFloat(meal.carbs) || 0}g</span>
                      <span>G: {parseFloat(meal.fats) || 0}g</span>
                      <span className="calories-display">{parseFloat(meal.calories) || 0} kcal</span>
                    </>
                  ) : (
                    <span className="no-data">Sem dados - Clique para editar</span>
                  )}
                  <button
                    className="edit-btn"
                    onClick={() => setEditingMeal(meal.id)}
                  >
                    ✏️
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MealPlanner

