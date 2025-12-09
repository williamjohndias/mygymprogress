import React from 'react'
import { Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js'
import './Results.css'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
)

function Results({ results, userData }) {
  if (!results) return null

  // Dados para gráfico de pizza (macros)
  const macroData = {
    labels: ['Proteína', 'Carboidratos', 'Gorduras'],
    datasets: [{
      data: [
        results.macros?.proteinCalories || 0,
        results.macros?.carbCalories || 0,
        results.macros?.fatCalories || 0
      ],
      backgroundColor: [
        '#4CAF50',
        '#2196F3',
        '#FF9800'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  }

  // Dados para gráfico de barras (calorias)
  const caloriesData = {
    labels: ['TMB', 'TDEE', 'Calorias Alvo'],
    datasets: [{
      label: 'Calorias (kcal)',
      data: [
        results.tmb || 0,
        results.tdee || 0,
        results.targetCalories || 0
      ],
      backgroundColor: [
        '#667eea',
        '#764ba2',
        '#4CAF50'
      ],
      borderRadius: 8
    }]
  }

  const macroOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || ''
            const value = context.parsed || 0
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value.toFixed(0)} kcal (${percentage}%)`
          }
        }
      }
    }
  }

  const caloriesOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.parsed.y.toFixed(0)} kcal`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toFixed(0) + ' kcal'
          }
        }
      }
    }
  }

  return (
    <div className="results">
      <h2>Resultados do Cálculo</h2>
      
      <div className="results-grid">
        {/* Card % Gordura */}
        {results.bodyFatPercentage !== null && (
          <div className="result-card">
            <div className="card-icon">📊</div>
            <h3>% Gordura</h3>
            <div className="card-value">{results.bodyFatPercentage.toFixed(2)}%</div>
            <div className="card-subtitle">Pollock 7 dobras</div>
          </div>
        )}

        {/* Card Massa Magra */}
        {results.leanMass && (
          <div className="result-card">
            <div className="card-icon">💪</div>
            <h3>Massa Magra</h3>
            <div className="card-value">{results.leanMass.toFixed(2)} kg</div>
            <div className="card-subtitle">Peso × (1 - BF%)</div>
          </div>
        )}

        {/* Card TMB */}
        <div className="result-card">
          <div className="card-icon">🔥</div>
          <h3>TMB</h3>
          <div className="card-value">{results.tmb?.toFixed(0)} kcal</div>
          <div className="card-subtitle">{results.tmbFormula}</div>
        </div>

        {/* Card TDEE */}
        <div className="result-card">
          <div className="card-icon">⚡</div>
          <h3>TDEE</h3>
          <div className="card-value">{results.tdee?.toFixed(0)} kcal</div>
          <div className="card-subtitle">TMB × Fator Atividade</div>
        </div>

        {/* Card Calorias Alvo */}
        <div className="result-card highlight">
          <div className="card-icon">🎯</div>
          <h3>Calorias Alvo</h3>
          <div className="card-value">{results.targetCalories?.toFixed(0)} kcal</div>
          <div className="card-subtitle">{results.goal === 'cutting' ? 'Cutting' : results.goal === 'bulking' ? 'Bulking' : 'Manutenção'}</div>
        </div>

        {/* Card Água */}
        {results.water && (
          <div className="result-card">
            <div className="card-icon">💧</div>
            <h3>Água Diária</h3>
            <div className="card-value">{(results.water / 1000).toFixed(2)} L</div>
            <div className="card-subtitle">{results.water.toFixed(0)} ml</div>
          </div>
        )}

        {/* Card TEF */}
        {results.tef && (
          <div className="result-card">
            <div className="card-icon">🍽️</div>
            <h3>TEF</h3>
            <div className="card-value">{results.tef.toFixed(0)} kcal</div>
            <div className="card-subtitle">~10% do TDEE</div>
          </div>
        )}
      </div>

      {/* Macros */}
      {results.macros && (
        <div className="macros-section">
          <h3>Macronutrientes</h3>
          <div className="macros-grid">
            <div className="macro-card protein">
              <h4>Proteína</h4>
              <div className="macro-value">{results.macros.protein}g</div>
              <div className="macro-calories">{results.macros.proteinCalories.toFixed(0)} kcal</div>
              <div className="macro-percentage">
                {((results.macros.proteinCalories / results.targetCalories) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="macro-card carbs">
              <h4>Carboidratos</h4>
              <div className="macro-value">{results.macros.carbs}g</div>
              <div className="macro-calories">{results.macros.carbCalories.toFixed(0)} kcal</div>
              <div className="macro-percentage">
                {((results.macros.carbCalories / results.targetCalories) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="macro-card fats">
              <h4>Gorduras</h4>
              <div className="macro-value">{results.macros.fats}g</div>
              <div className="macro-calories">{results.macros.fatCalories.toFixed(0)} kcal</div>
              <div className="macro-percentage">
                {((results.macros.fatCalories / results.targetCalories) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gráficos */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Distribuição de Macros</h3>
          <Doughnut data={macroData} options={macroOptions} />
        </div>
        <div className="chart-container">
          <h3>Calorias (TMB × TDEE × Alvo)</h3>
          <Bar data={caloriesData} options={caloriesOptions} />
        </div>
      </div>

      {/* Informações adicionais */}
      <div className="info-section">
        <h3>Informações Adicionais</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>TEF (Thermic Effect of Food):</strong>
            <p>O efeito térmico dos alimentos representa ~10% do TDEE. É a energia gasta para digerir, absorver e processar os nutrientes.</p>
          </div>
          <div className="info-item">
            <strong>NEAT (Non-Exercise Activity Thermogenesis):</strong>
            <p>Atividades não relacionadas ao exercício (caminhar, gesticular, etc.) já estão incluídas no fator de atividade do TDEE.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Results

