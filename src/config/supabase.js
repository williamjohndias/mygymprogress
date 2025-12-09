import { createClient } from '@supabase/supabase-js'

// IMPORTANTE: Substitua pela URL do seu projeto Supabase
// Você encontra isso em: https://app.supabase.com -> Seu Projeto -> Settings -> API
const SUPABASE_URL = 'https://cqnsrnavwpccnfiqzdvn.supabase.co' // SUBSTITUA AQUI
const SUPABASE_ANON_KEY = 'sua-anon-key-aqui' // Opcional, mas recomendado para produção

// Para operações administrativas, usamos a service_role key (secret key)
// ATENÇÃO: Esta key deve ser mantida em segredo e nunca exposta no frontend em produção
// Em produção, use Row Level Security (RLS) e a anon key
const SUPABASE_SECRET_KEY = 'sb_secret_yuMlJrD_D2uMiDwVdORhkA_8mDlnMrW'

// Cliente Supabase com service_role (para operações administrativas)
// Em produção, considere usar um backend para operações sensíveis
export const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Função para verificar conexão
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('user_data').select('count').limit(1)
    if (error && error.code !== 'PGRST116') { // PGRST116 = tabela não existe (esperado na primeira vez)
      throw error
    }
    return { success: true, message: 'Conexão com Supabase estabelecida!' }
  } catch (error) {
    return { success: false, message: `Erro na conexão: ${error.message}` }
  }
}

