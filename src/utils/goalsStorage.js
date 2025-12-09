// Funções para gerenciar metas no Supabase
import { supabase } from '../config/supabase'

/**
 * Carrega metas do usuário
 */
export const loadGoals = async (user) => {
  try {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user)
      .maybeSingle()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data?.goal_data || null
  } catch (error) {
    console.error('Erro ao carregar metas:', error)
    return null
  }
}

/**
 * Salva metas do usuário
 */
export const saveGoals = async (user, goalData) => {
  try {
    const { error } = await supabase
      .from('goals')
      .upsert({
        user_id: user,
        goal_data: goalData,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Erro ao salvar metas:', error)
    return { success: false, error: error.message }
  }
}

