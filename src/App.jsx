import React, { useState, useEffect } from 'react'
import UserSelector from './components/UserSelector'
import Dashboard from './components/Dashboard'
import DataInput from './components/DataInput'
import Results from './components/Results'
import History from './components/History'
import MealPlanner from './components/MealPlanner'
import BackupRestore from './components/BackupRestore'
import Goals from './components/Goals'
import MotivationalQuote from './components/MotivationalQuote'
import { calculateNutrition } from './utils/calculations'
import { saveUserData, getUserData, saveHistoryEntry, getHistory } from './utils/storage'
import './App.css'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [results, setResults] = useState(null)
  const [currentView, setCurrentView] = useState('dashboard') // dashboard, input, history, planner, backup, goals
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Carregar dados do usuário quando selecionado
  useEffect(() => {
    if (currentUser) {
      const data = getUserData(currentUser)
      setUserData(data)
      if (data && hasRequiredData(data)) {
        calculateAndSetResults(data)
      }
    }
  }, [currentUser])

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.querySelector('.user-dropdown-menu')
      const button = document.querySelector('.user-selector-btn')
      if (dropdown && button && !dropdown.contains(event.target) && !button.contains(event.target)) {
        dropdown.classList.remove('show')
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const hasRequiredData = (data) => {
    return data && data.peso && data.altura && data.idade
  }

  const calculateAndSetResults = (data) => {
    if (hasRequiredData(data)) {
      const calculated = calculateNutrition(data)
      setResults(calculated)
    }
  }

  const handleUserSelect = (user) => {
    setCurrentUser(user)
    setCurrentView('dashboard')
  }

  const handleNavigate = (view) => {
    setCurrentView(view)
  }

  const handleDataChange = (newData) => {
    setUserData(newData)
    saveUserData(currentUser, newData)
    if (hasRequiredData(newData)) {
      calculateAndSetResults(newData)
    } else {
      setResults(null)
    }
  }

  const handleSaveCalculation = () => {
    if (results && currentUser) {
      const entry = {
        ...results,
        timestamp: new Date().toISOString(),
        userData: { ...userData }
      }
      saveHistoryEntry(currentUser, entry)
      alert('Cálculo salvo no histórico!')
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>🏆 Nutrition Pro</h1>
          {currentUser && (
            <div className="user-selector-dropdown">
              <button 
                className="user-selector-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  const dropdown = document.querySelector('.user-dropdown-menu')
                  dropdown?.classList.toggle('show')
                }}
              >
                <span className="user-selector-icon">{currentUser === 'Liam' ? '👨' : '👩'}</span>
                <span className="user-selector-name">{currentUser}</span>
                <span className="user-selector-arrow">▼</span>
              </button>
              <div className="user-dropdown-menu">
                <div 
                  className="user-dropdown-item"
                  onClick={() => {
                    handleUserSelect('Liam')
                    document.querySelector('.user-dropdown-menu')?.classList.remove('show')
                  }}
                >
                  <span className="user-icon-small">👨</span>
                  <div>
                    <div className="user-name">Liam</div>
                    <div className="user-desc">Masculino</div>
                  </div>
                  {currentUser === 'Liam' && <span className="check-mark">✓</span>}
                </div>
                <div 
                  className="user-dropdown-item"
                  onClick={() => {
                    handleUserSelect('Day')
                    document.querySelector('.user-dropdown-menu')?.classList.remove('show')
                  }}
                >
                  <span className="user-icon-small">👩</span>
                  <div>
                    <div className="user-name">Day</div>
                    <div className="user-desc">Feminino</div>
                  </div>
                  {currentUser === 'Day' && <span className="check-mark">✓</span>}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {currentUser ? (
          <>
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <nav className={`app-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
              <button 
                className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
                onClick={() => {
                  handleNavigate('dashboard')
                  setMobileMenuOpen(false)
                }}
              >
                <span className="nav-icon">📊</span>
                <span className="nav-text">Dashboard</span>
              </button>
              <button 
                className={`nav-btn ${currentView === 'input' ? 'active' : ''}`}
                onClick={() => {
                  handleNavigate('input')
                  setMobileMenuOpen(false)
                }}
              >
                <span className="nav-icon">✏️</span>
                <span className="nav-text">Dados</span>
              </button>
              <button 
                className={`nav-btn ${currentView === 'planner' ? 'active' : ''}`}
                onClick={() => {
                  handleNavigate('planner')
                  setMobileMenuOpen(false)
                }}
              >
                <span className="nav-icon">🍽️</span>
                <span className="nav-text">Dieta</span>
              </button>
              <button 
                className={`nav-btn ${currentView === 'history' ? 'active' : ''}`}
                onClick={() => {
                  handleNavigate('history')
                  setMobileMenuOpen(false)
                }}
              >
                <span className="nav-icon">📜</span>
                <span className="nav-text">Histórico</span>
              </button>
              <button 
                className={`nav-btn ${currentView === 'goals' ? 'active' : ''}`}
                onClick={() => {
                  handleNavigate('goals')
                  setMobileMenuOpen(false)
                }}
              >
                <span className="nav-icon">🎯</span>
                <span className="nav-text">Metas</span>
              </button>
              <button 
                className={`nav-btn ${currentView === 'backup' ? 'active' : ''}`}
                onClick={() => {
                  handleNavigate('backup')
                  setMobileMenuOpen(false)
                }}
              >
                <span className="nav-icon">💾</span>
                <span className="nav-text">Backup</span>
              </button>
            </nav>
          </>
        ) : (
          <div className="header-actions">
            <button className="btn-primary" onClick={() => handleUserSelect('Liam')}>
              Entrar como Liam
            </button>
            <button className="btn-primary" onClick={() => handleUserSelect('Day')}>
              Entrar como Day
            </button>
          </div>
        )}
      </header>

      {!currentUser ? (
        <UserSelector onSelect={handleUserSelect} />
      ) : (
        <main className="app-main">
          <MotivationalQuote />
          {currentView === 'dashboard' ? (
            <Dashboard 
              user={currentUser}
              onNavigate={handleNavigate}
            />
          ) : currentView === 'input' ? (
            <>
              <DataInput 
                user={currentUser}
                data={userData}
                onChange={handleDataChange}
              />
              
              {!hasRequiredData(userData) && (
                <div className="warning-message">
                  <div className="warning-icon">⚠️</div>
                  <div className="warning-content">
                    <h3>Dados Incompletos</h3>
                    <p>Preencha pelo menos os campos obrigatórios (Peso, Altura e Idade) para calcular seus valores nutricionais.</p>
                  </div>
                </div>
              )}
              
              {results && (
                <>
                  <Results 
                    results={results}
                    userData={userData}
                  />
                  <div className="save-button-container">
                    <button 
                      className="btn-primary"
                      onClick={handleSaveCalculation}
                    >
                      Salvar Cálculo no Histórico
                    </button>
                  </div>
                </>
              )}
            </>
          ) : currentView === 'planner' ? (
            <MealPlanner 
              user={currentUser}
            />
          ) : currentView === 'goals' ? (
            <Goals 
              user={currentUser}
            />
          ) : currentView === 'backup' ? (
            <BackupRestore 
              user={currentUser}
            />
          ) : (
            <History 
              user={currentUser} 
              onBack={() => handleNavigate('dashboard')}
            />
          )}
        </main>
      )}
    </div>
  )
}

export default App

