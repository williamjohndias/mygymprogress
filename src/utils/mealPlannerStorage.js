// Funções para gerenciar meal planner no Supabase
import { supabase } from '../config/supabase'

/**
 * Carrega dados do meal planner para uma data específica
 */
export const loadMealPlannerDay = async (user, date) => {
  try {
    const { data, error } = await supabase
      .from('meal_planner')
      .select('*')
      .eq('user_id', user)
      .eq('date', date)
      .maybeSingle()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    
    if (data) {
      return {
        meals: data.meals || [],
        waterGlasses: data.water_glasses || 0
      }
    }
    return null
  } catch (error) {
    console.error('Erro ao carregar meal planner:', error)
    return null
  }
}

/**
 * Salva dados do meal planner para uma data específica
 */
export const saveMealPlannerDay = async (user, date, meals, waterGlasses) => {
  try {
    const { error } = await supabase
      .from('meal_planner')
      .upsert({
        user_id: user,
        date: date,
        meals: meals,
        water_glasses: waterGlasses,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,date'
      })

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Erro ao salvar meal planner:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Carrega template de refeições
 */
export const loadMealPlannerTemplate = async (user) => {
  try {
    const { data, error } = await supabase
      .from('meal_planner_template')
      .select('*')
      .eq('user_id', user)
      .maybeSingle()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data?.template || null
  } catch (error) {
    console.error('Erro ao carregar template:', error)
    return null
  }
}

/**
 * Salva template de refeições
 */
export const saveMealPlannerTemplate = async (user, template) => {
  try {
    const { error } = await supabase
      .from('meal_planner_template')
      .upsert({
        user_id: user,
        template: template,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Erro ao salvar template:', error)
    return { success: false, error: error.message }
  }
}

