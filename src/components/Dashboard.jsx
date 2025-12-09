import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { getHistory, getUserData } from '../utils/storage'
import { calculateNutrition } from '../utils/calculations'
import { calculateProjection, calculateWeeklyProjection } from '../utils/projection'
import './Dashboard.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

function Dashboard({ user, onNavigate }) {
  const [currentData, setCurrentData] = useState(null)
  const [history, setHistory] = useState([])
  const [projection, setProjection] = useState(null)
  const [showProjection, setShowProjection] = useState(false)
  const [chartFilter, setChartFilter] = useState('all') // all, week, month, 3months

  useEffect(() => {
    const data = getUserData(user)
    const hist = getHistory(user)
    setCurrentData(data)
    setHistory(hist.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)))
    
    if (data) {
      const results = calculateNutrition(data)
      if (results && data.goal) {
        const proj = calculateProjection(data, results)
        setProjection(proj)
      }
    }
  }, [user])

  const getCurrentResults = () => {
    if (!currentData) return null
    return calculateNutrition(currentData)
  }

  const results = getCurrentResults()

  // Calcular comparação primeiro vs último
  const getComparison = () => {
    if (history.length < 2) return null
    
    const first = history[0]
    const last = history[history.length - 1]
    
    const comparisons = []
    
    if (first.userData?.peso && last.userData?.peso) {
      const pesoChange = parseFloat(last.userData.peso) - parseFloat(first.userData.peso)
      comparisons.push({
        label: 'Peso',
        first: parseFloat(first.userData.peso),
        last: parseFloat(last.userData.peso),
        change: pesoChange,
        unit: 'kg'
      })
    }
    
    if (first.bodyFatPercentage !== null && last.bodyFatPercentage !== null) {
      const bfChange = last.bodyFatPercentage - first.bodyFatPercentage
      comparisons.push({
        label: '% Gordura',
        first: first.bodyFatPercentage,
        last: last.bodyFatPercentage,
        change: bfChange,
        unit: '%'
      })
    }
    
    if (first.leanMass && last.leanMass) {
      const lmChange = last.leanMass - first.leanMass
      comparisons.push({
        label: 'Massa Magra',
        first: first.leanMass,
        last: last.leanMass,
        change: lmChange,
        unit: 'kg'
      })
    }
    
    if (first.userData?.cintura && last.userData?.cintura) {
      const cinturaChange = parseFloat(last.userData.cintura) - parseFloat(first.userData.cintura)
      comparisons.push({
        label: 'Cintura',
        first: parseFloat(first.userData.cintura),
        last: parseFloat(last.userData.cintura),
        change: cinturaChange,
        unit: 'cm'
      })
    }
    
    return comparisons
  }

  const comparison = getComparison()

  // Calcular dados de projeção
  const getProjectionData = () => {
    if (!currentData || !results || history.length === 0) return null

    const sortedHistory = [...history].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    const firstEntry = sortedHistory[0]
    const firstWeight = parseFloat(firstEntry.userData?.peso)
    const firstBF = firstEntry.bodyFatPercentage
    
    if (!firstWeight) return null

    // Calcular semanas desde o primeiro registro
    const weeksSinceStart = Math.ceil(
      (new Date() - new Date(firstEntry.timestamp)) / (1000 * 60 * 60 * 24 * 7)
    )
    
    if (weeksSinceStart < 1) return null

    // Criar dados temporários para calcular projeção a partir do primeiro registro
    const tempData = { ...currentData, peso: firstWeight }
    const tempResults = { ...results }
    if (firstBF !== null && firstBF !== undefined) {
      tempResults.bodyFatPercentage = firstBF
      tempResults.leanMass = firstWeight * (1 - firstBF / 100)
    }

    const weeklyProj = calculateWeeklyProjection(tempData, tempResults, Math.min(weeksSinceStart + 8, 20))
    
    return {
      startDate: new Date(firstEntry.timestamp),
      weeklyProj,
      firstWeight,
      firstBF
    }
  }

  // Preparar dados para gráfico de progressão
  const getProgressData = () => {
    if (history.length === 0) return null

    const sortedHistory = [...history].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    
    // Filtrar por período selecionado
    let filteredHistory = sortedHistory
    const now = new Date()
    if (chartFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filteredHistory = sortedHistory.filter(entry => new Date(entry.timestamp) >= weekAgo)
    } else if (chartFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      filteredHistory = sortedHistory.filter(entry => new Date(entry.timestamp) >= monthAgo)
    } else if (chartFilter === '3months') {
      const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      filteredHistory = sortedHistory.filter(entry => new Date(entry.timestamp) >= threeMonthsAgo)
    }
    
    const firstEntry = sortedHistory[0]
    const firstDate = new Date(firstEntry.timestamp)
    
    // Pegar últimos registros ou todos se menos de 12
    const last12 = filteredHistory.slice(-12)

    // Dados de projeção
    const projectionData = getProjectionData()
    const hasProjection = projectionData && projectionData.weeklyProj && projectionData.weeklyProj.length > 0

    // Criar mapa de datas para alinhar dados reais e projetados
    const dateMap = new Map()
    
    // Adicionar datas reais
    last12.forEach(entry => {
      const date = new Date(entry.timestamp)
      dateMap.set(date.toISOString().split('T')[0], {
        date,
        real: {
          peso: parseFloat(entry.userData?.peso),
          bf: entry.bodyFatPercentage,
          leanMass: entry.leanMass,
          cintura: parseFloat(entry.userData?.cintura),
          braco: parseFloat(entry.userData?.braco)
        }
      })
    })

    // Adicionar datas de projeção
    if (hasProjection) {
      projectionData.weeklyProj.forEach(proj => {
        const projDate = new Date(projectionData.startDate)
        projDate.setDate(projDate.getDate() + (proj.week * 7))
        const dateKey = projDate.toISOString().split('T')[0]
        
        if (!dateMap.has(dateKey)) {
          dateMap.set(dateKey, {
            date: projDate,
            projected: {
              peso: proj.weight,
              bf: proj.bodyFat,
              leanMass: proj.bodyFat && proj.weight ? proj.weight * (1 - proj.bodyFat / 100) : null
            }
          })
        } else {
          // Se já existe, adicionar projeção ao existente
          const existing = dateMap.get(dateKey)
          existing.projected = {
            peso: proj.weight,
            bf: proj.bodyFat,
            leanMass: proj.bodyFat && proj.weight ? proj.weight * (1 - proj.bodyFat / 100) : null
          }
        }
      })
    }

    // Ordenar por data
    const sortedDates = Array.from(dateMap.entries()).sort((a, b) => 
      new Date(a[1].date) - new Date(b[1].date)
    )

    // Criar arrays alinhados
    const allLabels = sortedDates.map(([_, data]) => 
      data.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    )
    
    const pesoData = sortedDates.map(([_, data]) => data.real?.peso || null)
    const pesoProjected = sortedDates.map(([_, data]) => data.projected?.peso || null)
    
    const bfData = sortedDates.map(([_, data]) => data.real?.bf || null)
    const bfProjected = sortedDates.map(([_, data]) => data.projected?.bf || null)
    
    const leanMassData = sortedDates.map(([_, data]) => data.real?.leanMass || null)
    const leanMassProjected = sortedDates.map(([_, data]) => data.projected?.leanMass || null)
    
    const cinturaData = sortedDates.map(([_, data]) => data.real?.cintura || null)
    const bracoData = sortedDates.map(([_, data]) => data.real?.braco || null)

    // Preparar datasets apenas para Peso e % Gordura (com projeções)
    const datasets = []
    
    // Peso Real
    datasets.push({
      label: 'Peso (kg)',
      data: pesoData,
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.15)',
      fill: false,
      tension: 0.4,
      yAxisID: 'y',
      pointRadius: 5,
      pointHoverRadius: 7,
      borderWidth: 3,
      pointBackgroundColor: '#2563eb',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2
    })

    // Peso Projeção
    if (hasProjection && pesoProjected.some(v => v !== null)) {
      datasets.push({
        label: 'Peso - Projeção',
        data: pesoProjected,
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        fill: false,
        tension: 0.4,
        yAxisID: 'y',
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
        borderDash: [10, 5],
        pointBackgroundColor: '#60a5fa',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1
      })
    }

    // % Gordura Real
    if (!bfData.every(v => v === null)) {
      datasets.push({
        label: '% Gordura',
        data: bfData,
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220, 38, 38, 0.15)',
        fill: false,
        tension: 0.4,
        yAxisID: 'y1',
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
        pointBackgroundColor: '#dc2626',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      })
    }

    // % Gordura Projeção
    if (hasProjection && bfProjected.some(v => v !== null)) {
      datasets.push({
        label: '% Gordura - Projeção',
        data: bfProjected,
        borderColor: '#f87171',
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        fill: false,
        tension: 0.4,
        yAxisID: 'y1',
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
        borderDash: [10, 5],
        pointBackgroundColor: '#f87171',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1
      })
    }

    return {
      labels: allLabels,
      datasets
    }
  }

  // Preparar dados para gráfico de circunferências
  const getCircumferencesData = () => {
    if (history.length === 0) return null

    const sortedHistory = [...history].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    
    // Filtrar por período selecionado
    let filteredHistory = sortedHistory
    const now = new Date()
    if (chartFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filteredHistory = sortedHistory.filter(entry => new Date(entry.timestamp) >= weekAgo)
    } else if (chartFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      filteredHistory = sortedHistory.filter(entry => new Date(entry.timestamp) >= monthAgo)
    } else if (chartFilter === '3months') {
      const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      filteredHistory = sortedHistory.filter(entry => new Date(entry.timestamp) >= threeMonthsAgo)
    }
    
    const last12 = filteredHistory.slice(-12)

    const allLabels = last12.map(entry => {
      const date = new Date(entry.timestamp)
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    })
    
    const cinturaData = last12.map(entry => parseFloat(entry.userData?.cintura) || null)
    const bracoData = last12.map(entry => parseFloat(entry.userData?.braco) || null)
    const pescocoData = last12.map(entry => parseFloat(entry.userData?.pescoco) || null)
    const quadrilData = last12.map(entry => parseFloat(entry.userData?.quadril) || null)
    const coxaData = last12.map(entry => parseFloat(entry.userData?.coxa) || null)
    const panturrilhaData = last12.map(entry => parseFloat(entry.userData?.panturrilha) || null)
    const toraxData = last12.map(entry => parseFloat(entry.userData?.torax) || null)
    const ombroData = last12.map(entry => parseFloat(entry.userData?.ombro) || null)

    const datasets = []

    if (!cinturaData.every(v => v === null)) {
      datasets.push({
        label: 'Cintura (cm)',
        data: cinturaData,
        borderColor: '#ea580c',
        backgroundColor: 'rgba(234, 88, 12, 0.15)',
        fill: false,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
        pointBackgroundColor: '#ea580c',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      })
    }

    if (!bracoData.every(v => v === null)) {
      datasets.push({
        label: 'Braço (cm)',
        data: bracoData,
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.15)',
        fill: false,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
        pointBackgroundColor: '#a855f7',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      })
    }

    if (!pescocoData.every(v => v === null)) {
      datasets.push({
        label: 'Pescoço (cm)',
        data: pescocoData,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        fill: false,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      })
    }

    if (!quadrilData.every(v => v === null)) {
      datasets.push({
        label: 'Quadril (cm)',
        data: quadrilData,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        fill: false,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      })
    }

    if (!coxaData.every(v => v === null)) {
      datasets.push({
        label: 'Coxa (cm)',
        data: coxaData,
        borderColor: '#ec4899',
        backgroundColor: 'rgba(236, 72, 153, 0.15)',
        fill: false,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
        pointBackgroundColor: '#ec4899',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      })
    }

    if (!panturrilhaData.every(v => v === null)) {
      datasets.push({
        label: 'Panturrilha (cm)',
        data: panturrilhaData,
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20, 184, 166, 0.15)',
        fill: false,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
        pointBackgroundColor: '#14b8a6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      })
    }

    if (!toraxData.every(v => v === null)) {
      datasets.push({
        label: 'Tórax (cm)',
        data: toraxData,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        fill: false,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      })
    }

    if (!ombroData.every(v => v === null)) {
      datasets.push({
        label: 'Ombro (cm)',
        data: ombroData,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        fill: false,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      })
    }

    if (datasets.length === 0) return null

    return {
      labels: allLabels,
      datasets
    }
  }

  const progressData = getProgressData()
  const circumferencesData = getCircumferencesData()

  // Opções para gráfico de peso e % gordura
  const progressOptions = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 10,
          font: {
            size: 12,
            weight: 600
          },
          color: 'rgba(255, 255, 255, 0.9)',
          boxWidth: 12,
          boxHeight: 12,
          filter: (legendItem) => {
            const dataset = progressData?.datasets[legendItem.datasetIndex]
            return dataset && dataset.data.some(v => v !== null)
          }
        },
        onClick: (e, legendItem) => {
          const index = legendItem.datasetIndex
          const chart = e.chart
          const meta = chart.getDatasetMeta(index)
          meta.hidden = meta.hidden === null ? !chart.data.datasets[index].hidden : null
          chart.update()
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: 'rgba(255, 255, 255, 0.95)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(255, 215, 0, 0.5)',
        borderWidth: 1,
        padding: 14,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(1)
              if (context.dataset.label.includes('kg')) {
                label += ' kg'
              } else if (context.dataset.label.includes('%')) {
                label += '%'
              } else if (context.dataset.label.includes('cm')) {
                label += ' cm'
              }
            }
            return label
          }
        }
      },
      title: {
        display: false
      }
    },
      scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Peso (kg)',
          font: {
            weight: 600,
            size: 13
          },
          color: '#2563eb',
          padding: { top: 10, bottom: 10 }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.08)',
          drawBorder: true,
          borderColor: 'rgba(255, 215, 0, 0.3)',
          lineWidth: 1
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12,
            weight: 600
          },
          padding: 10,
          backdropColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: '% Gordura',
          font: {
            weight: 700,
            size: 13
          },
          color: '#dc2626',
          padding: { top: 10, bottom: 10 }
        },
        grid: {
          drawOnChartArea: false,
          drawBorder: false
        },
        ticks: {
          color: '#dc2626',
          font: {
            size: 12,
            weight: 600
          },
          padding: 10
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.08)',
          drawBorder: true,
          borderColor: 'rgba(255, 215, 0, 0.3)',
          lineWidth: 1
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12,
            weight: 600
          },
          maxRotation: 45,
          minRotation: 0,
          padding: 10
        }
      }
    }
  }

  // Opções para gráfico de circunferências
  const circumferencesOptions = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 10,
          font: {
            size: 12,
            weight: 600
          },
          color: 'rgba(255, 255, 255, 0.9)',
          boxWidth: 12,
          boxHeight: 12,
          filter: (legendItem) => {
            const dataset = circumferencesData?.datasets[legendItem.datasetIndex]
            return dataset && dataset.data.some(v => v !== null)
          }
        },
        onClick: (e, legendItem) => {
          const index = legendItem.datasetIndex
          const chart = e.chart
          const meta = chart.getDatasetMeta(index)
          meta.hidden = meta.hidden === null ? !chart.data.datasets[index].hidden : null
          chart.update()
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: 'rgba(255, 255, 255, 0.95)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(255, 215, 0, 0.5)',
        borderWidth: 1,
        padding: 14,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(1) + ' cm'
            }
            return label
          }
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Circunferências (cm)',
          font: {
            weight: 700,
            size: 13
          },
          color: '#ea580c',
          padding: { top: 10, bottom: 10 }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.08)',
          drawBorder: true,
          borderColor: 'rgba(255, 215, 0, 0.3)',
          lineWidth: 1
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12,
            weight: 600
          },
          padding: 10
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.08)',
          drawBorder: true,
          borderColor: 'rgba(255, 215, 0, 0.3)',
          lineWidth: 1
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12,
            weight: 600
          },
          maxRotation: 45,
          minRotation: 0,
          padding: 10
        }
      }
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>{user.toUpperCase()}</h1>
          <p>Dashboard de Progresso</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn-primary" onClick={() => onNavigate('input')}>
            Editar Dados
          </button>
          <button className="btn-secondary" onClick={() => onNavigate('history')}>
            Histórico
          </button>
        </div>
      </div>

      {!currentData || !results ? (
        <div className="dashboard-empty">
          <div className="empty-icon">💪</div>
          <h2>Bem-vindo, {user}!</h2>
          <p>Preencha seus dados para começar a acompanhar seu progresso nutricional.</p>
          <button className="btn-primary" onClick={() => onNavigate('input')}>
            Preencher Dados
          </button>
        </div>
      ) : (
        <>
          {/* Comparação de Progressão */}
          {comparison && comparison.length > 0 && (
            <div className="progress-comparison">
              <h2>Progressão: Primeiro vs Último</h2>
              <div className="comparison-grid">
                {comparison.map((item, idx) => (
                  <div key={idx} className="comparison-item">
                    <div className="comparison-item-label">{item.label}</div>
                    <div className="comparison-item-value">
                      {item.first.toFixed(1)} → {item.last.toFixed(1)} {item.unit}
                    </div>
                    <div className={`comparison-item-change ${
                      item.change > 0 ? 'positive' : item.change < 0 ? 'negative' : 'neutral'
                    }`}>
                      <span className="change-arrow">
                        {item.change > 0 ? '↑' : item.change < 0 ? '↓' : '→'}
                      </span>
                      {item.change > 0 ? '+' : ''}{item.change.toFixed(1)} {item.unit}
                      {item.change !== 0 && (
                        <span style={{ marginLeft: '8px', fontSize: '0.85rem', opacity: 0.7 }}>
                          ({((item.change / item.first) * 100).toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Tabela de Progressão */}
              {history.length > 0 && (
                <table className="progress-table">
                  <thead>
                    <tr>
                      <th>Data</th>
                      {comparison.map((item, idx) => (
                        <th key={idx}>{item.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice(0, 5).map((entry, idx) => {
                      const date = new Date(entry.timestamp)
                      return (
                        <tr key={idx}>
                          <td>{date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</td>
                          {comparison.map((comp, compIdx) => {
                            let value = null
                            if (comp.label === 'Peso') value = entry.userData?.peso
                            else if (comp.label === '% Gordura') value = entry.bodyFatPercentage
                            else if (comp.label === 'Massa Magra') value = entry.leanMass
                            else if (comp.label === 'Cintura') value = entry.userData?.cintura
                            
                            return (
                              <td key={compIdx}>
                                {value !== null && value !== undefined ? `${parseFloat(value).toFixed(1)} ${comp.unit}` : '-'}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                    {history.length > 5 && (
                      <tr>
                        <td colSpan={comparison.length + 1} style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          ... e mais {history.length - 5} registros
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Resumo Atual */}
          <div className="summary-section">
            <h2>Resumo Atual</h2>
            <div className="summary-grid">
              <div className="summary-card highlight">
                <div className="summary-icon">⚖️</div>
                <div className="summary-label">Peso Atual</div>
                <div className="summary-value">{currentData.peso} kg</div>
              </div>
              
              {results.bodyFatPercentage && (
                <div className="summary-card">
                  <div className="summary-icon">📊</div>
                  <div className="summary-label">% Gordura</div>
                  <div className="summary-value">{results.bodyFatPercentage.toFixed(1)}%</div>
                </div>
              )}
              
              {results.leanMass && (
                <div className="summary-card">
                  <div className="summary-icon">💪</div>
                  <div className="summary-label">Massa Magra</div>
                  <div className="summary-value">{results.leanMass.toFixed(1)} kg</div>
                </div>
              )}
              
              <div className="summary-card">
                <div className="summary-icon">🎯</div>
                <div className="summary-label">Calorias Alvo</div>
                <div className="summary-value">{results.targetCalories?.toFixed(0)} kcal</div>
                <div className="summary-subtitle">{results.goal === 'cutting' ? 'Cutting' : results.goal === 'bulking' ? 'Bulking' : 'Manutenção'}</div>
              </div>
              
              <div className="summary-card">
                <div className="summary-icon">🔥</div>
                <div className="summary-label">TDEE</div>
                <div className="summary-value">{results.tdee?.toFixed(0)} kcal</div>
              </div>
              
              {results.macros && (
                <div className="summary-card macros-summary">
                  <div className="summary-icon">🍽️</div>
                  <div className="summary-label">Macros</div>
                  <div className="macros-mini">
                    <span>P: {results.macros.protein}g</span>
                    <span>C: {results.macros.carbs}g</span>
                    <span>G: {results.macros.fats}g</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Projeção de Resultados */}
          {projection && projection.weeks > 0 && (
            <div className="projection-section">
              <div className="projection-header">
                <h2>Projeção de Resultados</h2>
                <button 
                  className="btn-secondary small"
                  onClick={() => setShowProjection(!showProjection)}
                >
                  {showProjection ? 'Ocultar' : 'Mostrar Detalhes'}
                </button>
              </div>
              
              {showProjection && (
                <div className="projection-card">
                  <div className="projection-info">
                    <div className="projection-item">
                      <strong>Objetivo:</strong> 
                      <span className="projection-value">
                        {currentData.goal === 'cutting' ? 'Cutting' : currentData.goal === 'bulking' ? 'Bulking' : 'Manutenção'}
                      </span>
                    </div>
                    <div className="projection-item">
                      <strong>Déficit/Superávit Diário:</strong>
                      <span className="projection-value">
                        {projection.deficit > 0 ? `-${projection.deficit.toFixed(0)}` : `+${Math.abs(projection.deficit).toFixed(0)}`} kcal
                      </span>
                    </div>
                    <div className="projection-item">
                      <strong>Mudança Semanal:</strong>
                      <span className="projection-value">
                        {projection.weeklyWeightChange > 0 ? '+' : ''}{projection.weeklyWeightChange.toFixed(2)} kg/semana
                      </span>
                    </div>
                    <div className="projection-item highlight">
                      <strong>Peso Atual:</strong>
                      <span className="projection-value">{projection.currentWeight.toFixed(1)} kg</span>
                    </div>
                    <div className="projection-item highlight">
                      <strong>Peso Projetado:</strong>
                      <span className="projection-value">{projection.projectedWeight.toFixed(1)} kg</span>
                    </div>
                    <div className="projection-item">
                      <strong>Tempo Estimado:</strong>
                      <span className="projection-value">
                        {projection.weeks} semanas ({projection.months} meses)
                      </span>
                    </div>
                    {results.bodyFatPercentage && projection.projectedBF && (
                      <>
                        <div className="projection-item">
                          <strong>% Gordura Atual:</strong>
                          <span className="projection-value">{projection.currentBF?.toFixed(1)}%</span>
                        </div>
                        <div className="projection-item">
                          <strong>% Gordura Projetado:</strong>
                          <span className="projection-value">{projection.projectedBF.toFixed(1)}%</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="projection-note">
                    <small>* Projeção baseada em déficit/superávit calórico. Resultados podem variar individualmente. A projeção assume que 1 kg de gordura = 7700 kcal.</small>
                  </div>
                </div>
              )}
              
              {!showProjection && (
                <div className="projection-summary">
                  <div className="summary-box">
                    <div className="summary-label">Peso Projetado</div>
                    <div className="summary-number">{projection.projectedWeight.toFixed(1)} kg</div>
                    <div className="summary-change">
                      {projection.projectedWeight > projection.currentWeight ? '↑' : '↓'} 
                      {Math.abs(projection.projectedWeight - projection.currentWeight).toFixed(1)} kg
                    </div>
                  </div>
                  <div className="summary-box">
                    <div className="summary-label">Tempo Estimado</div>
                    <div className="summary-number">{projection.weeks}</div>
                    <div className="summary-change">semanas</div>
                  </div>
                  {projection.projectedBF && (
                    <div className="summary-box">
                      <div className="summary-label">% Gordura Projetado</div>
                      <div className="summary-number">{projection.projectedBF.toFixed(1)}%</div>
                      <div className="summary-change">
                        {projection.projectedBF < projection.currentBF ? '↓' : '↑'} 
                        {Math.abs(projection.projectedBF - projection.currentBF).toFixed(1)}%
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Gráfico de Peso e % Gordura */}
          {progressData && progressData.datasets && progressData.datasets.length > 0 && progressData.datasets[0].data && progressData.datasets[0].data.length > 0 && (
            <div className="progress-section">
              <div className="progress-section-header">
                <h2>Peso e % Gordura</h2>
                <div className="chart-controls">
                  <div className="period-filter">
                    <button 
                      className={`period-btn ${chartFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setChartFilter('all')}
                    >
                      Todos
                    </button>
                    <button 
                      className={`period-btn ${chartFilter === '3months' ? 'active' : ''}`}
                      onClick={() => setChartFilter('3months')}
                    >
                      3 Meses
                    </button>
                    <button 
                      className={`period-btn ${chartFilter === 'month' ? 'active' : ''}`}
                      onClick={() => setChartFilter('month')}
                    >
                      Mês
                    </button>
                    <button 
                      className={`period-btn ${chartFilter === 'week' ? 'active' : ''}`}
                      onClick={() => setChartFilter('week')}
                    >
                      Semana
                    </button>
                  </div>
                </div>
              </div>
              <div className="chart-wrapper">
                <Line data={progressData} options={progressOptions} />
              </div>
              {getProjectionData() && (
                <div className="projection-note">
                  <small>* A linha tracejada representa a projeção baseada no objetivo e déficit/superávit calórico.</small>
                </div>
              )}
            </div>
          )}

          {/* Gráfico de Circunferências */}
          {circumferencesData && circumferencesData.datasets && circumferencesData.datasets.length > 0 && circumferencesData.datasets[0].data && circumferencesData.datasets[0].data.length > 0 && (
            <div className="progress-section">
              <div className="progress-section-header">
                <h2>Circunferências</h2>
                <div className="chart-controls">
                  <div className="period-filter">
                    <button 
                      className={`period-btn ${chartFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setChartFilter('all')}
                    >
                      Todos
                    </button>
                    <button 
                      className={`period-btn ${chartFilter === '3months' ? 'active' : ''}`}
                      onClick={() => setChartFilter('3months')}
                    >
                      3 Meses
                    </button>
                    <button 
                      className={`period-btn ${chartFilter === 'month' ? 'active' : ''}`}
                      onClick={() => setChartFilter('month')}
                    >
                      Mês
                    </button>
                    <button 
                      className={`period-btn ${chartFilter === 'week' ? 'active' : ''}`}
                      onClick={() => setChartFilter('week')}
                    >
                      Semana
                    </button>
                  </div>
                </div>
              </div>
              <div className="chart-wrapper">
                <Line data={circumferencesData} options={circumferencesOptions} />
              </div>
            </div>
          )}

          {(!progressData || !progressData.datasets || progressData.datasets.length === 0 || !progressData.datasets[0] || !progressData.datasets[0].data || progressData.datasets[0].data.length === 0) && 
           (!circumferencesData || !circumferencesData.datasets || circumferencesData.datasets.length === 0) && (
            <div className="no-progress">
              <p>Salve alguns cálculos no histórico para ver sua progressão aqui.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Dashboard

