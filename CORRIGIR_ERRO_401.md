# 🔧 Como Corrigir o Erro 401 (Unauthorized)

## ❌ Problema

O erro **401 (Unauthorized)** significa que o Supabase está bloqueando as requisições porque:
- O Row Level Security (RLS) está ativado nas tabelas
- A service_role key precisa de RLS desabilitado para funcionar no frontend

## ✅ Solução

### Opção 1: Desabilitar RLS (Mais Rápido)

1. **Acesse o Supabase:**
   - Vá em https://app.supabase.com
   - Selecione seu projeto

2. **Vá em SQL Editor:**
   - Clique em **SQL Editor** no menu lateral
   - Clique em **New Query**

3. **Execute este SQL:**
   ```sql
   -- Desabilitar RLS em todas as tabelas
   ALTER TABLE user_data DISABLE ROW LEVEL SECURITY;
   ALTER TABLE history DISABLE ROW LEVEL SECURITY;
   ALTER TABLE macro_tracker DISABLE ROW LEVEL SECURITY;
   ALTER TABLE meal_planner DISABLE ROW LEVEL SECURITY;
   ALTER TABLE meal_planner_template DISABLE ROW LEVEL SECURITY;
   ALTER TABLE goals DISABLE ROW LEVEL SECURITY;
   ```

4. **Clique em Run**

5. **Teste novamente:**
   - Recarregue a página do app (F5)
   - Tente salvar dados novamente

### Opção 2: Atualizar o Script SQL (Recomendado)

O arquivo `supabase-schema.sql` já foi atualizado com os comandos para desabilitar RLS.

1. **Se você ainda não executou o SQL:**
   - Execute o arquivo `supabase-schema.sql` completo no SQL Editor
   - Ele já inclui os comandos para desabilitar RLS

2. **Se você já executou o SQL antes:**
   - Execute apenas os comandos ALTER TABLE acima
   - Ou execute o `supabase-schema.sql` novamente (não vai dar erro)

## 🔍 Verificar se Funcionou

1. **Recarregue o app** (F5)
2. **Abra o Console** (F12)
3. **Tente salvar dados**
4. **Verifique:**
   - ✅ Não deve aparecer mais erro 401
   - ✅ Dados devem salvar normalmente
   - ✅ Console não deve mostrar erros

## ⚠️ Importante

**Desabilitar RLS significa:**
- ✅ Funciona com service_role key no frontend
- ⚠️ Menos seguro (qualquer um com a key pode acessar)
- 💡 Para produção, considere:
  - Usar anon key + RLS configurado
  - Ou criar um backend

**Para este projeto pessoal, está OK desabilitar RLS.**

## 🐛 Se ainda não funcionar

1. **Verifique a secret key:**
   - Abra `src/config/supabase.js`
   - Confirme que a secret key está correta
   - Você encontra em: Supabase → Settings → API → Service Role Key

2. **Verifique a URL:**
   - Confirme que a URL está correta
   - Deve ser: `https://cqnsrnavwpccnfiqzdvn.supabase.co`

3. **Verifique se as tabelas existem:**
   - Vá em Table Editor no Supabase
   - Deve ver todas as 6 tabelas

4. **Limpe o cache:**
   - Pressione Ctrl+Shift+R (hard refresh)
   - Ou limpe o cache do navegador

