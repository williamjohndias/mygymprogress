# 🚀 Configuração do Supabase

## Passo 1: Obter URL do Projeto

### 📍 Onde encontrar a URL:

1. **Acesse o Supabase:**
   - Vá para: https://app.supabase.com
   - Faça login na sua conta

2. **Selecione ou crie um projeto:**
   - Se já tiver um projeto, clique nele na lista
   - Se não tiver, clique em **"New Project"** e crie um novo

3. **Acesse as configurações da API:**
   - No menu lateral esquerdo, clique em **"Settings"** (⚙️ Configurações)
   - Depois clique em **"API"** (ou "APIs" dependendo da versão)

4. **Encontre a Project URL:**
   - Na seção **"Project URL"** você verá algo como:
     ```
     https://xxxxxxxxxxxxx.supabase.co
     ```
   - **Copie essa URL completa** (incluindo o `https://`)

5. **Alternativa - Dashboard:**
   - Você também pode ver a URL no **Dashboard** do projeto
   - Geralmente aparece no topo ou em "Project Settings"

## Passo 2: Configurar o Projeto

1. Abra o arquivo `src/config/supabase.js`
2. Substitua `SUPABASE_URL` pela URL do seu projeto:
   ```javascript
   const SUPABASE_URL = 'https://seu-projeto.supabase.co' // SUBSTITUA AQUI
   ```
3. A secret key já está configurada: `sb_secret_yuMlJrD_D2uMiDwVdORhkA_8mDlnMrW`

## Passo 3: Criar as Tabelas

1. No Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Copie e cole todo o conteúdo do arquivo `supabase-schema.sql`
4. Clique em **Run** (ou pressione Ctrl+Enter)
5. Aguarde a confirmação de sucesso

## Passo 4: Verificar Tabelas

1. Vá em **Table Editor** no Supabase
2. Você deve ver as seguintes tabelas criadas:
   - `user_data`
   - `history`
   - `macro_tracker`
   - `meal_planner`
   - `meal_planner_template`
   - `goals`

## Passo 5: Testar a Conexão

1. Inicie o app: `npm run dev`
2. Abra o console do navegador (F12)
3. Se houver erros de conexão, verifique:
   - A URL está correta em `src/config/supabase.js`?
   - As tabelas foram criadas?
   - A secret key está correta?

## ⚠️ Importante

- **Secret Key**: A secret key fornecida tem acesso total ao banco. Em produção, considere usar Row Level Security (RLS) e a anon key.
- **Backup**: Faça backup regular dos seus dados usando a função de backup no app.
- **Segurança**: Nunca exponha a secret key no código frontend em produção. Use variáveis de ambiente.

## 🔧 Estrutura das Tabelas

### `user_data`
- Armazena dados principais de cada usuário (Liam ou Day)
- Campos: `user_id` (Liam/Day), `data` (JSONB)

### `history`
- Histórico de cálculos nutricionais
- Campos: `user_id`, `entry_data` (JSONB), `timestamp`

### `meal_planner`
- Planejamento de refeições por data
- Campos: `user_id`, `date`, `meals` (JSONB), `water_glasses`

### `meal_planner_template`
- Templates de refeições salvos
- Campos: `user_id`, `template` (JSONB)

### `goals`
- Metas personalizadas
- Campos: `user_id`, `goal_data` (JSONB)

## 📝 Notas

- Todas as tabelas têm `created_at` e `updated_at` automáticos
- Índices foram criados para melhor performance
- Triggers atualizam `updated_at` automaticamente
- Foreign keys garantem integridade dos dados

