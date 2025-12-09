import React, { useState, useEffect } from 'react'
import { getUserData } from '../utils/storage'
import { calculateNutrition } from '../utils/calculations'
import './MacroTracker.css'

function MacroTracker({ user, onNavigate }) {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])
  const [meals, setMeals] = useState([])
  const [showAddMeal, setShowAddMeal] = useState(false)
  const [currentMeal, setCurrentMeal] = useState({
    name: '',
    protein: '',
    carbs: '',
    fats: '',
    calories: ''
  })
  const [targets, setTargets] = useState(null)

  useEffect(() => {
    loadDayData()
    loadTargets()
  }, [user, currentDate])

  const loadTargets = () => {
    const data = getUserData(user)
    if (data) {
      const results = calculateNutrition(data)
      if (results && results.macros) {
        setTargets({
          calories: results.targetCalories || 0,
          protein: results.macros.protein || 0,
          carbs: results.macros.carbs || 0,
          fats: results.macros.fats || 0
        })
      }
    }
  }

  const loadDayData = () => {
    const key = `macroTracker_${user}_${currentDate}`
    const saved = localStorage.getItem(key)
    if (saved) {
      setMeals(JSON.parse(saved))
    } else {
      setMeals([])
    }
  }

  const saveDayData = (newMeals) => {
    const key = `macroTracker_${user}_${currentDate}`
    localStorage.setItem(key, JSON.stringify(newMeals))
    setMeals(newMeals)
  }

  const handleAddMeal = () => {
    if (!currentMeal.name) return

    const protein = parseFloat(currentMeal.protein) || 0
    const carbs = parseFloat(currentMeal.carbs) || 0
    const fats = parseFloat(currentMeal.fats) || 0
    const calories = parseFloat(currentMeal.calories) || (protein * 4 + carbs * 4 + fats * 9)

    const newMeal = {
      id: Date.now(),
      name: currentMeal.name,
      protein,
      carbs,
      fats,
      calories,
      timestamp: new Date().toISOString()
    }

    const newMeals = [...meals, newMeal]
    saveDayData(newMeals)
    
    setCurrentMeal({ name: '', protein: '', carbs: '', fats: '', calories: '' })
    setShowAddMeal(false)
  }

  const handleDeleteMeal = (id) => {
    const newMeals = meals.filter(meal => meal.id !== id)
    saveDayData(newMeals)
  }

  const calculateTotals = () => {
    return meals.reduce((acc, meal) => {
      acc.protein += meal.protein
      acc.carbs += meal.carbs
      acc.fats += meal.fats
      acc.calories += meal.calories
      return acc
    }, { protein: 0, carbs: 0, fats: 0, calories: 0 })
  }

  const totals = calculateTotals()

  const calculateProgress = (current, target) => {
    if (!target || target === 0) return 0
    return Math.min((current / target) * 100, 100)
  }

  const calculateRemaining = (current, target) => {
    if (!target) return 0
    return Math.max(target - current, 0)
  }

  const getProgressColor = (progress) => {
    if (progress >= 100) return '#10b981'
    if (progress >= 80) return '#f59e0b'
    return '#ef4444'
  }

  if (!targets) {
    return (
      <div className="macro-tracker-empty">
        <p>Configure seus dados primeiro para ver suas metas de macros.</p>
        <button className="btn-primary" onClick={() => onNavigate('input')}>
          Configurar Dados
        </button>
      </div>
    )
  }

  return (
    <div className="macro-tracker">
      <div className="macro-tracker-header">
        <h2>Tracker de Macros</h2>
        <input
          type="date"
          value={currentDate}
          onChange={(e) => setCurrentDate(e.target.value)}
          className="date-picker"
        />
      </div>

      {/* Resumo do Dia */}
      <div className="daily-summary">
        <div className="summary-card calories-card">
          <div className="summary-label">Calorias</div>
          <div className="summary-main">
            <span className="current-value">{totals.calories.toFixed(0)}</span>
            <span className="target-value">/ {targets.calories.toFixed(0)}</span>
          </div>
          <div className="summary-remaining">
            {calculateRemaining(totals.calories, targets.calories).toFixed(0)} restantes
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${calculateProgress(totals.calories, targets.calories)}%`,
                backgroundColor: getProgressColor(calculateProgress(totals.calories, targets.calories))
              }}
            />
          </div>
        </div>

        <div className="macros-grid">
          <div className="macro-card">
            <div className="macro-label">Proteína</div>
            <div className="macro-value">{totals.protein.toFixed(1)}g</div>
            <div className="macro-target">Meta: {targets.protein.toFixed(1)}g</div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${calculateProgress(totals.protein, targets.protein)}%`,
                  backgroundColor: getProgressColor(calculateProgress(totals.protein, targets.protein))
                }}
              />
            </div>
          </div>

          <div className="macro-card">
            <div className="macro-label">Carboidratos</div>
            <div className="macro-value">{totals.carbs.toFixed(1)}g</div>
            <div className="macro-target">Meta: {targets.carbs.toFixed(1)}g</div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${calculateProgress(totals.carbs, targets.carbs)}%`,
                  backgroundColor: getProgressColor(calculateProgress(totals.carbs, targets.carbs))
                }}
              />
            </div>
          </div>

          <div className="macro-card">
            <div className="macro-label">Gorduras</div>
            <div className="macro-value">{totals.fats.toFixed(1)}g</div>
            <div className="macro-target">Meta: {targets.fats.toFixed(1)}g</div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${calculateProgress(totals.fats, targets.fats)}%`,
                  backgroundColor: getProgressColor(calculateProgress(totals.fats, targets.fats))
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Refeições */}
      <div className="meals-section">
        <div className="meals-header">
          <h3>Refeições ({meals.length})</h3>
          <button className="btn-primary small" onClick={() => setShowAddMeal(!showAddMeal)}>
            + Adicionar Refeição
          </button>
        </div>

        {showAddMeal && (
          <div className="add-meal-form">
            <input
              type="text"
              placeholder="Nome da refeição"
              value={currentMeal.name}
              onChange={(e) => setCurrentMeal({ ...currentMeal, name: e.target.value })}
              className="meal-input"
            />
            <div className="macro-inputs">
              <input
                type="number"
                placeholder="Proteína (g)"
                value={currentMeal.protein}
                onChange={(e) => setCurrentMeal({ ...currentMeal, protein: e.target.value })}
                className="macro-input"
              />
              <input
                type="number"
                placeholder="Carbs (g)"
                value={currentMeal.carbs}
                onChange={(e) => setCurrentMeal({ ...currentMeal, carbs: e.target.value })}
                className="macro-input"
              />
              <input
                type="number"
                placeholder="Gorduras (g)"
                value={currentMeal.fats}
                onChange={(e) => setCurrentMeal({ ...currentMeal, fats: e.target.value })}
                className="macro-input"
              />
              <input
                type="number"
                placeholder="Calorias (opcional)"
                value={currentMeal.calories}
                onChange={(e) => setCurrentMeal({ ...currentMeal, calories: e.target.value })}
                className="macro-input"
              />
            </div>
            <div className="form-actions">
              <button className="btn-primary" onClick={handleAddMeal}>
                Adicionar
              </button>
              <button className="btn-secondary" onClick={() => setShowAddMeal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="meals-list">
          {meals.length === 0 ? (
            <div className="empty-meals">
              <p>Nenhuma refeição registrada hoje. Adicione sua primeira refeição!</p>
            </div>
          ) : (
            meals.map((meal) => (
              <div key={meal.id} className="meal-item">
                <div className="meal-info">
                  <div className="meal-name">{meal.name}</div>
                  <div className="meal-time">
                    {new Date(meal.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="meal-macros">
                  <span>P: {meal.protein.toFixed(1)}g</span>
                  <span>C: {meal.carbs.toFixed(1)}g</span>
                  <span>G: {meal.fats.toFixed(1)}g</span>
                  <span className="meal-calories">{meal.calories.toFixed(0)} kcal</span>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteMeal(meal.id)}
                  title="Remover"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default MacroTracker

