// Funções para gerenciar armazenamento local por usuário

const USER_DATA_KEY = (user) => `nutrition_userData_${user}`
const USER_HISTORY_KEY = (user) => `nutrition_history_${user}`

export const saveUserData = (user, data) => {
  try {
    localStorage.setItem(USER_DATA_KEY(user), JSON.stringify(data))
  } catch (error) {
    console.error('Erro ao salvar dados do usuário:', error)
  }
}

export const getUserData = (user) => {
  try {
    const data = localStorage.getItem(USER_DATA_KEY(user))
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error)
    return null
  }
}

export const saveHistoryEntry = (user, entry) => {
  try {
    const history = getHistory(user) || []
    history.push(entry)
    localStorage.setItem(USER_HISTORY_KEY(user), JSON.stringify(history))
  } catch (error) {
    console.error('Erro ao salvar histórico:', error)
  }
}

export const getHistory = (user) => {
  try {
    const history = localStorage.getItem(USER_HISTORY_KEY(user))
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error('Erro ao carregar histórico:', error)
    return []
  }
}

export const deleteHistoryEntry = (user, index) => {
  try {
    const history = getHistory(user)
    history.splice(index, 1)
    localStorage.setItem(USER_HISTORY_KEY(user), JSON.stringify(history))
    return history
  } catch (error) {
    console.error('Erro ao deletar entrada do histórico:', error)
    return []
  }
}

export const exportHistoryToCSV = (user) => {
  const history = getHistory(user)
  if (history.length === 0) {
    alert('Nenhum histórico disponível para exportar')
    return
  }

  // Cabeçalhos CSV
  const headers = [
    'Data',
    'Peso (kg)',
    'Altura (cm)',
    'Idade',
    '% Gordura',
    'Massa Magra (kg)',
    'TMB (kcal)',
    'TDEE (kcal)',
    'Calorias Alvo (kcal)',
    'Proteína (g)',
    'Carboidratos (g)',
    'Gorduras (g)',
    'Água (ml)',
    'Fórmula TMB',
    'Objetivo'
  ]

  // Converter dados para CSV
  const rows = history.map(entry => {
    const date = new Date(entry.timestamp).toLocaleString('pt-BR')
    return [
      date,
      entry.userData?.peso || '',
      entry.userData?.altura || '',
      entry.userData?.idade || '',
      entry.bodyFatPercentage?.toFixed(2) || '',
      entry.leanMass?.toFixed(2) || '',
      entry.tmb?.toFixed(2) || '',
      entry.tdee?.toFixed(2) || '',
      entry.targetCalories?.toFixed(2) || '',
      entry.macros?.protein?.toFixed(2) || '',
      entry.macros?.carbs?.toFixed(2) || '',
      entry.macros?.fats?.toFixed(2) || '',
      entry.water?.toFixed(2) || '',
      entry.tmbFormula || '',
      entry.goal || ''
    ]
  })

  // Criar conteúdo CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  // Criar e baixar arquivo
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `historico_nutricao_${user}_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

