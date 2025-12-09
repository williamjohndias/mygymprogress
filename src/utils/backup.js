/**
 * Utilitários para backup e restauração de dados usando Supabase
 */
import { supabase } from '../config/supabase'
import { getUserData, getHistory } from './storage'

/**
 * Exporta todos os dados de um usuário para JSON
 */
export const exportUserData = async (user) => {
  try {
    const userData = await getUserData(user)
    const history = await getHistory(user)
    
    // Coletar todos os dados do meal planner
    const { data: mealPlannerData } = await supabase
      .from('meal_planner')
      .select('*')
      .eq('user_id', user)

    const mealPlanner = {}
    if (mealPlannerData) {
      mealPlannerData.forEach(row => {
        mealPlanner[row.date] = {
          meals: row.meals,
          waterGlasses: row.water_glasses
        }
      })
    }

    // Coletar template de refeições
    const { data: templateData } = await supabase
      .from('meal_planner_template')
      .select('*')
      .eq('user_id', user)
      .maybeSingle()

    // Coletar metas
    const { data: goalsData } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user)
      .maybeSingle()

    const exportData = {
      user,
      exportDate: new Date().toISOString(),
      userData: userData,
      history: history,
      mealPlanner: mealPlanner,
      mealPlannerTemplate: templateData?.template || null,
      goals: goalsData?.goal_data || null,
      version: '2.0'
    }

    return JSON.stringify(exportData, null, 2)
  } catch (error) {
    console.error('Erro ao exportar dados:', error)
    throw error
  }
}

/**
 * Exporta todos os dados para download
 */
export const downloadBackup = async (user) => {
  try {
    const data = await exportUserData(user)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nutrition_backup_${user}_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    alert('Erro ao fazer backup: ' + error.message)
  }
}

/**
 * Importa dados de um arquivo JSON
 */
export const importUserData = async (jsonData, user) => {
  try {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData

    if (!data.user || data.user !== user) {
      throw new Error('Os dados não correspondem ao usuário selecionado')
    }

    // Importar dados do usuário
    if (data.userData) {
      await supabase
        .from('user_data')
        .upsert({
          user_id: user,
          data: data.userData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
    }

    // Importar histórico
    if (data.history && Array.isArray(data.history)) {
      // Deletar histórico existente primeiro
      await supabase
        .from('history')
        .delete()
        .eq('user_id', user)

      // Inserir novo histórico
      if (data.history.length > 0) {
        const historyEntries = data.history.map(entry => ({
          user_id: user,
          entry_data: entry,
          timestamp: entry.timestamp || new Date().toISOString()
        }))

        await supabase
          .from('history')
          .insert(historyEntries)
      }
    }

    // Importar meal planner
    if (data.mealPlanner && typeof data.mealPlanner === 'object') {
      const mealPlannerEntries = Object.keys(data.mealPlanner).map(date => ({
        user_id: user,
        date: date,
        meals: data.mealPlanner[date].meals || [],
        water_glasses: data.mealPlanner[date].waterGlasses || 0
      }))

      if (mealPlannerEntries.length > 0) {
        await supabase
          .from('meal_planner')
          .upsert(mealPlannerEntries, { onConflict: 'user_id,date' })
      }
    }

    // Importar template
    if (data.mealPlannerTemplate) {
      await supabase
        .from('meal_planner_template')
        .upsert({
          user_id: user,
          template: data.mealPlannerTemplate,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
    }

    // Importar metas
    if (data.goals) {
      await supabase
        .from('goals')
        .upsert({
          user_id: user,
          goal_data: data.goals,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
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
  
  reader.onload = async (e) => {
    const result = await importUserData(e.target.result, user)
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
export const clearUserData = async (user) => {
  try {
    // Limpar todas as tabelas relacionadas
    await supabase.from('history').delete().eq('user_id', user)
    await supabase.from('meal_planner').delete().eq('user_id', user)
    await supabase.from('meal_planner_template').delete().eq('user_id', user)
    await supabase.from('goals').delete().eq('user_id', user)
    await supabase.from('user_data').delete().eq('user_id', user)

    return { success: true, message: 'Todos os dados foram removidos!' }
  } catch (error) {
    return { success: false, message: `Erro ao limpar dados: ${error.message}` }
  }
}
