# ✅ Solução Definitiva para Erro 401

## 🔍 Problema Identificado

O erro **"Forbidden use of secret API key in browser"** acontece porque:
- ❌ A **secret key** não pode ser usada no navegador (proteção do Supabase)
- ✅ Precisamos usar a **Publishable key** no frontend

## ✅ Solução Aplicada

### 1. Código Atualizado

O arquivo `src/config/supabase.js` foi atualizado para usar a **Publishable key**:
```javascript
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_WCQD9s3axKJUSKz5-_uSAw_ssyKFM8V'
```

### 2. SQL Atualizado

O arquivo `supabase-schema.sql` foi atualizado com:
- ✅ RLS habilitado (mais seguro)
- ✅ Políticas que permitem acesso total (para app pessoal)

## 🚀 Próximos Passos

### Passo 1: Executar o SQL Atualizado

1. **Acesse o Supabase:**
   - Vá em https://app.supabase.com
   - Selecione seu projeto

2. **Vá em SQL Editor:**
   - Clique em **SQL Editor**
   - Clique em **New Query**

3. **Execute o SQL completo:**
   - Abra o arquivo `supabase-schema.sql`
   - Copie **TODO o conteúdo**
   - Cole no SQL Editor
   - Clique em **Run**

   **OU** execute apenas as políticas (se já criou as tabelas):

```sql
-- Habilitar RLS
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
ALTER TABLE macro_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_planner ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_planner_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Criar políticas que permitem acesso total
CREATE POLICY "Allow all operations on user_data" ON user_data
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on history" ON history
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on macro_tracker" ON macro_tracker
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on meal_planner" ON meal_planner
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on meal_planner_template" ON meal_planner_template
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on goals" ON goals
  FOR ALL USING (true) WITH CHECK (true);
```

### Passo 2: Recarregar o App

1. **Recarregue a página** (F5 ou Ctrl+R)
2. **Limpe o cache** se necessário (Ctrl+Shift+R)
3. **Teste novamente:**
   - Tente salvar dados
   - Verifique o console (F12)
   - Não deve aparecer mais erro 401

## ✅ Verificação

Após executar o SQL e recarregar:

- ✅ Não deve aparecer erro 401
- ✅ Dados devem salvar normalmente
- ✅ Console não deve mostrar erros de autenticação

## 🔐 Sobre as Chaves

- **Publishable Key** (`sb_publishable_...`): ✅ Segura para usar no navegador
- **Secret Key** (`sb_secret_...`): ❌ NUNCA use no navegador (apenas em backends)

## 📝 Notas

- As políticas RLS permitem acesso total porque é um app pessoal
- Em produção, você pode criar políticas mais restritivas
- A publishable key é pública, mas protegida pelas políticas RLS

