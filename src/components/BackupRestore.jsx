import React, { useState } from 'react'
import { downloadBackup, restoreFromFile, clearUserData } from '../utils/backup'
import './BackupRestore.css'

function BackupRestore({ user }) {
  const [restoreStatus, setRestoreStatus] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDownload = () => {
    downloadBackup(user)
    setRestoreStatus({ success: true, message: 'Backup baixado com sucesso!' })
    setTimeout(() => setRestoreStatus(null), 3000)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      setRestoreStatus({ success: false, message: 'Por favor, selecione um arquivo JSON válido' })
      return
    }

    restoreFromFile(file, user, (result) => {
      setRestoreStatus(result)
      if (result.success) {
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setTimeout(() => setRestoreStatus(null), 5000)
      }
    })
  }

  const handleClear = () => {
    if (window.confirm(`Tem certeza que deseja limpar TODOS os dados de ${user}? Esta ação não pode ser desfeita!`)) {
      clearUserData(user)
      setRestoreStatus({ success: true, message: 'Dados limpos com sucesso!' })
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  }

  return (
    <div className="backup-restore">
      <h2>Backup e Restauração</h2>
      
      <div className="backup-section">
        <h3>Exportar Dados</h3>
        <p className="section-description">
          Faça backup de todos os seus dados (perfil, histórico, tracker de macros) em um arquivo JSON.
        </p>
        <button className="btn-primary" onClick={handleDownload}>
          📥 Baixar Backup
        </button>
      </div>

      <div className="restore-section">
        <h3>Restaurar Dados</h3>
        <p className="section-description">
          Restaure seus dados a partir de um arquivo de backup anterior.
        </p>
        <label className="file-input-label">
          <input
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="file-input"
          />
          <span className="file-input-button">📤 Escolher Arquivo</span>
        </label>
      </div>

      <div className="danger-section">
        <h3>Zona de Perigo</h3>
        <p className="section-description warning">
          ⚠️ Esta ação irá deletar TODOS os dados de {user}. Certifique-se de ter um backup antes!
        </p>
        <button className="btn-danger" onClick={handleClear}>
          🗑️ Limpar Todos os Dados
        </button>
      </div>

      {restoreStatus && (
        <div className={`status-message ${restoreStatus.success ? 'success' : 'error'}`}>
          {restoreStatus.success ? '✓' : '✗'} {restoreStatus.message}
        </div>
      )}
    </div>
  )
}

export default BackupRestore

