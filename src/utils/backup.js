/**
 * Utilitários para backup e restauração de dados
 */

/**
 * Exporta todos os dados de um usuário para JSON
 */
export const exportUserData = (user) => {
  const userData = localStorage.getItem(`userData_${user}`)
  const history = localStorage.getItem(`history_${user}`)
  
  // Coletar todos os dados do tracker de macros
  const trackerData = {}
  const keys = Object.keys(localStorage)
  keys.forEach(key => {
    if (key.startsWith(`macroTracker_${user}_`)) {
      const date = key.replace(`macroTracker_${user}_`, '')
      trackerData[date] = localStorage.getItem(key)
    }
  })

  const exportData = {
    user,
    exportDate: new Date().toISOString(),
    userData: userData ? JSON.parse(userData) : null,
    history: history ? JSON.parse(history) : [],
    macroTracker: trackerData,
    version: '1.0'
  }

  return JSON.stringify(exportData, null, 2)
}

/**
 * Exporta todos os dados para download
 */
export const downloadBackup = (user) => {
  const data = exportUserData(user)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `nutrition_backup_${user}_${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Importa dados de um arquivo JSON
 */
export const importUserData = (jsonData, user) => {
  try {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData

    if (!data.user || data.user !== user) {
      throw new Error('Os dados não correspondem ao usuário selecionado')
    }

    // Importar dados do usuário
    if (data.userData) {
      localStorage.setItem(`userData_${user}`, JSON.stringify(data.userData))
    }

    // Importar histórico
    if (data.history && Array.isArray(data.history)) {
      localStorage.setItem(`history_${user}`, JSON.stringify(data.history))
    }

    // Importar dados do tracker de macros
    if (data.macroTracker && typeof data.macroTracker === 'object') {
      Object.keys(data.macroTracker).forEach(date => {
        localStorage.setItem(`macroTracker_${user}_${date}`, data.macroTracker[date])
      })
    }

    return { success: true, message: 'Dados importados com sucesso!' }
  } catch (error) {
    return { success: false, message: `Erro ao importar: ${error.message}` }
  }
}

/**
 * Restaura dados de um arquivo
 */
export const restoreFromFile = (file, user, onComplete) => {
  const reader = new FileReader()
  
  reader.onload = (e) => {
    const result = importUserData(e.target.result, user)
    onComplete(result)
  }

  reader.onerror = () => {
    onComplete({ success: false, message: 'Erro ao ler o arquivo' })
  }

  reader.readAsText(file)
}

/**
 * Limpa todos os dados de um usuário
 */
export const clearUserData = (user) => {
  // Limpar dados principais
  localStorage.removeItem(`userData_${user}`)
  localStorage.removeItem(`history_${user}`)

  // Limpar dados do tracker
  const keys = Object.keys(localStorage)
  keys.forEach(key => {
    if (key.startsWith(`macroTracker_${user}_`)) {
      localStorage.removeItem(key)
    }
  })
}

