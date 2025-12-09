import React from 'react'
import { getHistory, deleteHistoryEntry, exportHistoryToCSV } from '../utils/storage'
import './History.css'

function History({ user, onBack }) {
  const [history, setHistory] = React.useState([])

  React.useEffect(() => {
    const loadHistory = async () => {
      const userHistory = await getHistory(user)
      setHistory(userHistory)
    }
    loadHistory()
  }, [user])

  const handleDelete = async (entryId) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      const updatedHistory = await deleteHistoryEntry(user, entryId)
      setHistory(updatedHistory)
    }
  }

  const handleExport = async () => {
    await exportHistoryToCSV(user)
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString('pt-BR')
  }

  if (history.length === 0) {
    return (
      <div className="history">
        <div className="history-header">
          <h2>Histórico - {user}</h2>
          <button className="btn-secondary" onClick={onBack}>
            Voltar
          </button>
        </div>
        <div className="empty-history">
          <p>Nenhum registro no histórico ainda.</p>
          <p>Calcule seus valores e salve para ver o histórico aqui.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="history">
      <div className="history-header">
        <h2>Histórico - {user}</h2>
        <div className="history-actions">
          <button className="btn-primary" onClick={handleExport}>
            Exportar CSV
          </button>
          <button className="btn-secondary" onClick={onBack}>
            Voltar
          </button>
        </div>
      </div>

      <div className="history-stats">
        <p>Total de registros: <strong>{history.length}</strong></p>
      </div>

      <div className="history-list">
        {history.map((entry) => (
          <div key={entry.id || entry.timestamp} className="history-card">
            <div className="history-card-header">
              <h3>Registro #{entry.id || 'N/A'}</h3>
              <span className="history-date">{formatDate(entry.timestamp)}</span>
            </div>
            
            <div className="history-content">
              <div className="history-section">
                <h4>Dados Básicos</h4>
                <div className="history-grid">
                  <div>
                    <strong>Peso:</strong> {entry.userData?.peso || 'N/A'} kg
                  </div>
                  <div>
                    <strong>Altura:</strong> {entry.userData?.altura || 'N/A'} cm
                  </div>
                  <div>
                    <strong>Idade:</strong> {entry.userData?.idade || 'N/A'} anos
                  </div>
                  <div>
                    <strong>Objetivo:</strong> {
                      entry.goal === 'cutting' ? 'Cutting' : 
                      entry.goal === 'bulking' ? 'Bulking' : 
                      'Manutenção'
                    }
                  </div>
                </div>
              </div>

              {(entry.userData?.cintura || entry.userData?.braco || entry.userData?.antebraco || 
                entry.userData?.coxaCircunferencia || entry.userData?.panturrilha || 
                entry.userData?.peito || entry.userData?.ombro || entry.userData?.pescoco || 
                entry.userData?.quadril) && (
                <div className="history-section">
                  <h4>Medidas Corporais</h4>
                  <div className="history-grid">
                    {entry.userData?.cintura && (
                      <div><strong>Cintura:</strong> {entry.userData.cintura} cm</div>
                    )}
                    {entry.userData?.pescoco && (
                      <div><strong>Pescoço:</strong> {entry.userData.pescoco} cm</div>
                    )}
                    {entry.userData?.quadril && (
                      <div><strong>Quadril:</strong> {entry.userData.quadril} cm</div>
                    )}
                    {entry.userData?.braco && (
                      <div><strong>Braço:</strong> {entry.userData.braco} cm</div>
                    )}
                    {entry.userData?.antebraco && (
                      <div><strong>Antebraço:</strong> {entry.userData.antebraco} cm</div>
                    )}
                    {entry.userData?.coxaCircunferencia && (
                      <div><strong>Coxa:</strong> {entry.userData.coxaCircunferencia} cm</div>
                    )}
                    {entry.userData?.panturrilha && (
                      <div><strong>Panturrilha:</strong> {entry.userData.panturrilha} cm</div>
                    )}
                    {entry.userData?.peito && (
                      <div><strong>Peito:</strong> {entry.userData.peito} cm</div>
                    )}
                    {entry.userData?.ombro && (
                      <div><strong>Ombro:</strong> {entry.userData.ombro} cm</div>
                    )}
                  </div>
                </div>
              )}

              <div className="history-section">
                <h4>Resultados</h4>
                <div className="history-grid">
                  {entry.bodyFatPercentage !== null && entry.bodyFatPercentage !== undefined && (
                    <div>
                      <strong>% Gordura:</strong> {entry.bodyFatPercentage.toFixed(2)}%
                    </div>
                  )}
                  {entry.leanMass && (
                    <div>
                      <strong>Massa Magra:</strong> {entry.leanMass.toFixed(2)} kg
                    </div>
                  )}
                  <div>
                    <strong>TMB:</strong> {entry.tmb?.toFixed(0)} kcal ({entry.tmbFormula})
                  </div>
                  <div>
                    <strong>TDEE:</strong> {entry.tdee?.toFixed(0)} kcal
                  </div>
                  <div>
                    <strong>Calorias Alvo:</strong> {entry.targetCalories?.toFixed(0)} kcal
                  </div>
                  {entry.water && (
                    <div>
                      <strong>Água:</strong> {(entry.water / 1000).toFixed(2)} L
                    </div>
                  )}
                </div>
              </div>

              {entry.macros && (
                <div className="history-section">
                  <h4>Macronutrientes</h4>
                  <div className="history-macros">
                    <div className="macro-badge protein">
                      <strong>Proteína:</strong> {entry.macros.protein}g
                    </div>
                    <div className="macro-badge carbs">
                      <strong>Carbs:</strong> {entry.macros.carbs}g
                    </div>
                    <div className="macro-badge fats">
                      <strong>Gorduras:</strong> {entry.macros.fats}g
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="history-card-footer">
              <button 
                className="btn-delete"
                onClick={() => handleDelete(entry.id)}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default History

