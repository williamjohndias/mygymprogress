import { createClient } from '@supabase/supabase-js'

// URL do projeto Supabase
const SUPABASE_URL = 'https://cqnsrnavwpccnfiqzdvn.supabase.co'

// IMPORTANTE: Use a PUBLISHABLE KEY (não a secret key) no frontend!
// A secret key não pode ser usada no navegador por segurança
// Encontre em: Supabase -> Settings -> API -> Publishable key
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_WCQD9s3axKJUSKz5-_uSAw_ssyKFM8V'

// Cliente Supabase com publishable key (para uso no frontend)
// Esta key é segura para usar no navegador quando RLS está configurado
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

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

