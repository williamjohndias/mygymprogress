# 🔄 Migração para Supabase - Guia Completo

## ✅ O que foi feito

O projeto foi completamente migrado do `localStorage` para o **Supabase** como banco de dados.

### Arquivos Criados/Modificados:

1. **`src/config/supabase.js`** - Configuração do cliente Supabase
2. **`supabase-schema.sql`** - Script SQL para criar todas as tabelas
3. **`src/utils/storage.js`** - Atualizado para usar Supabase (async/await)
4. **`src/utils/backup.js`** - Atualizado para usar Supabase
5. **`src/utils/mealPlannerStorage.js`** - Novo arquivo para gerenciar meal planner
6. **`src/utils/goalsStorage.js`** - Novo arquivo para gerenciar metas
7. **Todos os componentes** - Atualizados para usar async/await

### Tabelas Criadas:

- `user_data` - Dados principais (Liam/Day)
- `history` - Histórico de cálculos
- `meal_planner` - Refeições planejadas por data
- `meal_planner_template` - Templates de refeições
- `goals` - Metas personalizadas

## 🚀 Como Configurar

### 1. Obter URL do Supabase

1. Acesse https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie a **Project URL**

### 2. Configurar o Projeto

Edite `src/config/supabase.js`:

```javascript
const SUPABASE_URL = 'https://SEU-PROJETO.supabase.co' // SUBSTITUA AQUI
```

A secret key já está configurada.

### 3. Criar Tabelas

1. No Supabase, vá em **SQL Editor**
2. Abra o arquivo `supabase-schema.sql`
3. Copie todo o conteúdo
4. Cole no SQL Editor
5. Clique em **Run**

### 4. Testar

```bash
npm run dev
```

Abra o console do navegador (F12) para verificar erros.

## 📊 Estrutura de Dados

Todos os dados são armazenados em formato JSONB no Supabase:

- **user_data.data** - Objeto completo com todos os dados do usuário
- **history.entry_data** - Objeto completo de cada cálculo
- **meal_planner.meals** - Array de refeições
- **goals.goal_data** - Objeto com metas

## ⚠️ Importante

- **Secret Key**: A secret key tem acesso total. Em produção, considere usar RLS.
- **Backup**: Use a função de backup no app regularmente.
- **Migração**: Dados antigos do localStorage não são migrados automaticamente.

## 🔄 Migrar Dados Antigos

Se você tinha dados no localStorage:

1. Use a função de **Backup** no app (ainda funciona com localStorage)
2. Configure o Supabase
3. Use a função de **Restaurar** para importar os dados

## 🐛 Troubleshooting

### Erro: "relation does not exist"
- Execute o script SQL no Supabase

### Erro: "Invalid API key"
- Verifique a URL e secret key em `src/config/supabase.js`

### Dados não aparecem
- Verifique o console do navegador (F12)
- Confirme que as tabelas foram criadas no Supabase

