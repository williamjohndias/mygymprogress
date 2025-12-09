import React, { useState, useEffect } from 'react'
import { getHistory, getUserData } from '../utils/storage'
import { calculateNutrition } from '../utils/calculations'
import './UserSelector.css'

function UserSelector({ onSelect }) {
  const [liamData, setLiamData] = useState(null)
  const [dayData, setDayData] = useState(null)
  const [liamHistory, setLiamHistory] = useState([])
  const [dayHistory, setDayHistory] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const liam = await getUserData('Liam')
      const day = await getUserData('Day')
      const liamHist = await getHistory('Liam')
      const dayHist = await getHistory('Day')
      
      setLiamData(liam)
      setDayData(day)
      setLiamHistory(liamHist)
      setDayHistory(dayHist)
    }
    loadData()
  }, [])

  const getLastWeight = (user) => {
    const history = user === 'Liam' ? liamHistory : dayHistory
    if (history.length > 0) {
      const last = history[history.length - 1]
      return last.userData?.peso
    }
    return null
  }

  const getLastBF = (user) => {
    const history = user === 'Liam' ? liamHistory : dayHistory
    if (history.length > 0) {
      const last = history[history.length - 1]
      return last.bodyFatPercentage
    }
    return null
  }

  const getStats = (user) => {
    const data = user === 'Liam' ? liamData : dayData
    const history = user === 'Liam' ? liamHistory : dayHistory
    
    if (!data) return null
    
    const results = calculateNutrition(data)
    return {
      ...results,
      historyCount: history.length,
      lastUpdate: history.length > 0 ? new Date(history[history.length - 1].timestamp) : null
    }
  }

  const liamStats = getStats('Liam')
  const dayStats = getStats('Day')

  return (
    <div className="user-selector">
      <div className="selector-container">
        <div className="selector-header">
          <h1>App de Nutrição</h1>
          <p className="subtitle">Selecione um perfil para começar</p>
        </div>
        
        <div className="user-cards">
          <div className="user-card" onClick={() => onSelect('Liam')}>
            <div className="user-card-header">
              <div className="user-icon">👨</div>
              <div className="user-info">
                <h2>Liam</h2>
                <p className="user-gender">Masculino</p>
              </div>
            </div>
            
            {liamStats ? (
              <div className="user-stats">
                <div className="stat-item">
                  <span className="stat-label">Peso Atual</span>
                  <span className="stat-value">{liamData.peso} kg</span>
                </div>
                {liamStats.bodyFatPercentage && (
                  <div className="stat-item">
                    <span className="stat-label">% Gordura</span>
                    <span className="stat-value">{liamStats.bodyFatPercentage.toFixed(1)}%</span>
                  </div>
                )}
                {liamStats.targetCalories && (
                  <div className="stat-item">
                    <span className="stat-label">Calorias Alvo</span>
                    <span className="stat-value">{liamStats.targetCalories.toFixed(0)} kcal</span>
                  </div>
                )}
                <div className="stat-item">
                  <span className="stat-label">Registros</span>
                  <span className="stat-value">{liamStats.historyCount}</span>
                </div>
              </div>
            ) : (
              <div className="user-empty">
                <p>Nenhum dado cadastrado</p>
                <span className="empty-hint">Clique para começar</span>
              </div>
            )}
          </div>
          
          <div className="user-card" onClick={() => onSelect('Day')}>
            <div className="user-card-header">
              <div className="user-icon">👩</div>
              <div className="user-info">
                <h2>Day</h2>
                <p className="user-gender">Feminino</p>
              </div>
            </div>
            
            {dayStats ? (
              <div className="user-stats">
                <div className="stat-item">
                  <span className="stat-label">Peso Atual</span>
                  <span className="stat-value">{dayData.peso} kg</span>
                </div>
                {dayStats.bodyFatPercentage && (
                  <div className="stat-item">
                    <span className="stat-label">% Gordura</span>
                    <span className="stat-value">{dayStats.bodyFatPercentage.toFixed(1)}%</span>
                  </div>
                )}
                {dayStats.targetCalories && (
                  <div className="stat-item">
                    <span className="stat-label">Calorias Alvo</span>
                    <span className="stat-value">{dayStats.targetCalories.toFixed(0)} kcal</span>
                  </div>
                )}
                <div className="stat-item">
                  <span className="stat-label">Registros</span>
                  <span className="stat-value">{dayStats.historyCount}</span>
                </div>
              </div>
            ) : (
              <div className="user-empty">
                <p>Nenhum dado cadastrado</p>
                <span className="empty-hint">Clique para começar</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserSelector

