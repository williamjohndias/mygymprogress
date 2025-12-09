// Funções para gerenciar armazenamento no Supabase por usuário
import { supabase } from '../config/supabase'

/**
 * Salva ou atualiza dados do usuário
 */
export const saveUserData = async (user, data) => {
  try {
    const { error } = await supabase
      .from('user_data')
      .upsert({
        user_id: user,
        data: data,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      })

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Erro ao salvar dados do usuário:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Carrega dados do usuário
 */
export const getUserData = async (user) => {
  try {
    const { data, error } = await supabase
      .from('user_data')
      .select('*')
      .eq('user_id', user)
      .maybeSingle()

    if (error) {
      // PGRST116 = nenhum resultado encontrado (OK)
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data?.data || null
  } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error)
    return null
  }
}

/**
 * Salva uma entrada no histórico
 */
export const saveHistoryEntry = async (user, entry) => {
  try {
    const { error } = await supabase
      .from('history')
      .insert({
        user_id: user,
        entry_data: entry,
        timestamp: entry.timestamp || new Date().toISOString()
      })

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Erro ao salvar histórico:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Carrega histórico do usuário
 */
export const getHistory = async (user) => {
  try {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('user_id', user)
      .order('timestamp', { ascending: false })

    if (error) throw error
    
    // Converter para o formato esperado pelo app
    return data.map(row => ({
      ...row.entry_data,
      id: row.id,
      timestamp: row.timestamp
    }))
  } catch (error) {
    console.error('Erro ao carregar histórico:', error)
    return []
  }
}

/**
 * Deleta uma entrada do histórico
 */
export const deleteHistoryEntry = async (user, entryId) => {
  try {
    const { error } = await supabase
      .from('history')
      .delete()
      .eq('id', entryId)
      .eq('user_id', user)

    if (error) throw error
    
    // Retornar histórico atualizado
    return await getHistory(user)
  } catch (error) {
    console.error('Erro ao deletar entrada do histórico:', error)
    return []
  }
}

/**
 * Exporta histórico para CSV
 */
export const exportHistoryToCSV = async (user) => {
  try {
    const history = await getHistory(user)
    
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
  } catch (error) {
    console.error('Erro ao exportar histórico:', error)
    alert('Erro ao exportar histórico: ' + error.message)
  }
}
