# 🔧 Solução para Erro 406 (Not Acceptable)

## ❌ Problema

O erro **406 (Not Acceptable)** acontece quando:
- O Supabase rejeita o formato da requisição
- A query está usando `.single()` quando deveria usar `.maybeSingle()`
- O formato do `select` está incorreto

## ✅ Correções Aplicadas

### 1. `getUserData` - Corrigido
- ✅ Mudado de `.select('data')` para `.select('*')`
- ✅ Mudado de `.single()` para `.maybeSingle()`
- ✅ Melhor tratamento de erros

### 2. `loadGoals` - Corrigido
- ✅ Mudado de `.select('goal_data')` para `.select('*')`
- ✅ Mudado de `.single()` para `.maybeSingle()`

### 3. `loadMealPlannerDay` - Corrigido
- ✅ Mudado de `.single()` para `.maybeSingle()`

### 4. `loadMealPlannerTemplate` - Corrigido
- ✅ Mudado de `.select('template')` para `.select('*')`
- ✅ Mudado de `.single()` para `.maybeSingle()`

### 5. `backup.js` - Corrigido
- ✅ Mudado para `.select('*')` e `.maybeSingle()`

## 🔍 Diferença entre `.single()` e `.maybeSingle()`

- **`.single()`**: Espera exatamente 1 resultado, **erro se não encontrar**
- **`.maybeSingle()`**: Retorna 1 resultado ou `null` se não encontrar (sem erro)

## 🚀 Próximos Passos

### 1. Recarregar o App

1. **Recarregue a página** (F5 ou Ctrl+R)
2. **Limpe o cache** se necessário (Ctrl+Shift+R)
3. **Teste novamente**

### 2. Verificar

- ✅ Não deve aparecer erro 406
- ✅ Dados devem carregar normalmente
- ✅ Console não deve mostrar erros

## ⚠️ Importante

**Certifique-se de que executou o SQL no Supabase!**

Se ainda aparecer erro 406:
1. Verifique se executou o `supabase-schema.sql` completo
2. Verifique se as políticas RLS foram criadas
3. Verifique o console para mensagens de erro mais específicas

## 📝 Checklist

- [x] Código corrigido para usar `.maybeSingle()`
- [x] Queries atualizadas para usar `.select('*')`
- [ ] **Executar SQL no Supabase** (se ainda não executou)
- [ ] Testar carregamento de dados
- [ ] Verificar no console

