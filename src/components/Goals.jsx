import React, { useState, useEffect } from 'react'
import { getUserData } from '../utils/storage'
import { calculateNutrition } from '../utils/calculations'
import './Goals.css'

function Goals({ user }) {
  const [goals, setGoals] = useState({
    targetWeight: '',
    targetBodyFat: '',
    targetDate: '',
    notes: ''
  })
  const [currentStats, setCurrentStats] = useState(null)

  useEffect(() => {
    loadGoals()
    loadCurrentStats()
  }, [user])

  const loadGoals = () => {
    const key = `goals_${user}`
    const saved = localStorage.getItem(key)
    if (saved) {
      setGoals(JSON.parse(saved))
    }
  }

  const saveGoals = () => {
    const key = `goals_${user}`
    localStorage.setItem(key, JSON.stringify(goals))
    alert('Metas salvas com sucesso!')
  }

  const loadCurrentStats = () => {
    const data = getUserData(user)
    if (data) {
      const results = calculateNutrition(data)
      setCurrentStats({
        weight: data.peso,
        bodyFat: results.bodyFatPercentage,
        leanMass: results.leanMass
      })
    }
  }

  const handleChange = (field, value) => {
    setGoals({ ...goals, [field]: value })
  }

  const calculateProgress = () => {
    if (!currentStats || !goals.targetWeight) return null

    const weightDiff = parseFloat(goals.targetWeight) - parseFloat(currentStats.weight || 0)
    const weightProgress = currentStats.weight 
      ? ((parseFloat(currentStats.weight) - parseFloat(goals.targetWeight)) / Math.abs(weightDiff)) * 100
      : 0

    const bfDiff = goals.targetBodyFat 
      ? parseFloat(goals.targetBodyFat) - parseFloat(currentStats.bodyFat || 0)
      : null
    const bfProgress = goals.targetBodyFat && currentStats.bodyFat
      ? ((parseFloat(currentStats.bodyFat) - parseFloat(goals.targetBodyFat)) / Math.abs(bfDiff)) * 100
      : null

    return {
      weight: {
        current: parseFloat(currentStats.weight || 0),
        target: parseFloat(goals.targetWeight),
        diff: weightDiff,
        progress: Math.min(Math.max(weightProgress, 0), 100)
      },
      bodyFat: bfDiff !== null ? {
        current: parseFloat(currentStats.bodyFat || 0),
        target: parseFloat(goals.targetBodyFat),
        diff: bfDiff,
        progress: bfProgress !== null ? Math.min(Math.max(bfProgress, 0), 100) : 0
      } : null
    }
  }

  const progress = calculateProgress()

  const getDaysRemaining = () => {
    if (!goals.targetDate) return null
    const target = new Date(goals.targetDate)
    const today = new Date()
    const diff = target - today
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const daysRemaining = getDaysRemaining()

  return (
    <div className="goals">
      <h2>Metas Personalizadas</h2>

      <div className="goals-form">
        <div className="form-group">
          <label>Peso Alvo (kg)</label>
          <input
            type="number"
            step="0.1"
            value={goals.targetWeight}
            onChange={(e) => handleChange('targetWeight', e.target.value)}
            placeholder="Ex: 75.0"
          />
        </div>

        <div className="form-group">
          <label>% Gordura Alvo</label>
          <input
            type="number"
            step="0.1"
            value={goals.targetBodyFat}
            onChange={(e) => handleChange('targetBodyFat', e.target.value)}
            placeholder="Ex: 12.0"
          />
        </div>

        <div className="form-group">
          <label>Data Alvo</label>
          <input
            type="date"
            value={goals.targetDate}
            onChange={(e) => handleChange('targetDate', e.target.value)}
          />
        </div>

        <div className="form-group full-width">
          <label>Observações</label>
          <textarea
            value={goals.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Notas sobre suas metas..."
            rows="4"
          />
        </div>

        <button className="btn-primary" onClick={saveGoals}>
          Salvar Metas
        </button>
      </div>

      {progress && (
        <div className="progress-section">
          <h3>Progresso em Direção às Metas</h3>

          {currentStats && (
            <div className="current-stats">
              <div className="stat-item">
                <span className="stat-label">Peso Atual:</span>
                <span className="stat-value">{currentStats.weight?.toFixed(1)} kg</span>
              </div>
              {currentStats.bodyFat && (
                <div className="stat-item">
                  <span className="stat-label">% Gordura Atual:</span>
                  <span className="stat-value">{currentStats.bodyFat.toFixed(1)}%</span>
                </div>
              )}
            </div>
          )}

          {progress.weight && (
            <div className="progress-card">
              <div className="progress-header">
                <span className="progress-title">Peso</span>
                <span className="progress-target">{progress.weight.target} kg</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${progress.weight.progress}%`,
                      backgroundColor: progress.weight.diff > 0 ? '#10b981' : '#ef4444'
                    }}
                  />
                </div>
                <div className="progress-info">
                  <span>{progress.weight.current.toFixed(1)} kg</span>
                  <span className="progress-diff">
                    {progress.weight.diff > 0 ? '+' : ''}{progress.weight.diff.toFixed(1)} kg
                  </span>
                </div>
              </div>
            </div>
          )}

          {progress.bodyFat && (
            <div className="progress-card">
              <div className="progress-header">
                <span className="progress-title">% Gordura</span>
                <span className="progress-target">{progress.bodyFat.target}%</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${progress.bodyFat.progress}%`,
                      backgroundColor: progress.bodyFat.diff > 0 ? '#10b981' : '#ef4444'
                    }}
                  />
                </div>
                <div className="progress-info">
                  <span>{progress.bodyFat.current.toFixed(1)}%</span>
                  <span className="progress-diff">
                    {progress.bodyFat.diff > 0 ? '+' : ''}{progress.bodyFat.diff.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {daysRemaining !== null && (
            <div className="days-remaining">
              <span className="days-label">
                {daysRemaining > 0 
                  ? `${daysRemaining} dias restantes`
                  : daysRemaining === 0
                  ? 'Meta atingida hoje!'
                  : `Meta expirou há ${Math.abs(daysRemaining)} dias`
                }
              </span>
            </div>
          )}
        </div>
      )}

      {!currentStats && (
        <div className="no-stats">
          <p>Configure seus dados primeiro para ver o progresso em relação às metas.</p>
        </div>
      )}
    </div>
  )
}

export default Goals

