# 🧪 Como Testar a Integração com Supabase

## 📋 Pré-requisitos

Antes de testar, certifique-se de que:

1. ✅ A URL do Supabase está configurada em `src/config/supabase.js`
2. ✅ Você executou o script SQL no Supabase (criou as tabelas)
3. ✅ O projeto está rodando (`npm run dev`)

---

## 🚀 Método 1: Teste Rápido (Recomendado para começar)

### Passo 1: Abrir o arquivo de teste

1. No seu projeto, encontre o arquivo `test-supabase.html`
2. Clique com o botão direito nele
3. Selecione **"Abrir com"** → **Chrome** (ou seu navegador preferido)

**OU** simplesmente arraste o arquivo `test-supabase.html` para o navegador

### Passo 2: Executar o teste

1. Você verá uma página com um botão **"Testar Conexão"**
2. Clique no botão
3. Aguarde alguns segundos

### Passo 3: Verificar resultado

**✅ Se aparecer mensagem verde:**
- Conexão funcionando!
- Se disser que as tabelas não existem, você precisa executar o SQL no Supabase

**❌ Se aparecer mensagem vermelha:**
- Verifique a URL e a secret key
- Veja a mensagem de erro para mais detalhes

---

## 🔬 Método 2: Teste Completo no App

### Passo 1: Iniciar o servidor

Abra o terminal no diretório do projeto e execute:

```bash
npm run dev
```

Você verá algo como:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Passo 2: Abrir o app

1. Abra o navegador
2. Acesse: `http://localhost:5173`
3. Abra o **Console do Desenvolvedor** (F12)

### Passo 3: Testar funcionalidades

#### Teste 1: Selecionar Usuário
1. Clique em **"Entrar como Liam"** ou **"Entrar como Day"**
2. Verifique se não há erros no console

#### Teste 2: Salvar Dados
1. Vá em **"Dados"** no menu
2. Preencha pelo menos:
   - Peso (ex: 80)
   - Altura (ex: 180)
   - Idade (ex: 30)
3. Clique fora dos campos (os dados devem salvar automaticamente)
4. Verifique o console - não deve ter erros

#### Teste 3: Salvar no Histórico
1. Preencha os dados básicos
2. Vá até o final da página
3. Clique em **"Salvar Cálculo no Histórico"**
4. Deve aparecer: "Cálculo salvo no histórico!"
5. Verifique o console - não deve ter erros

#### Teste 4: Ver Histórico
1. Vá em **"Histórico"** no menu
2. Você deve ver o registro que acabou de salvar
3. Se não aparecer, verifique o console

#### Teste 5: Testar Dieta
1. Vá em **"Dieta"** no menu
2. Adicione uma refeição
3. Preencha os macros
4. Marque como consumido (checkbox)
5. Verifique se salva automaticamente

#### Teste 6: Verificar no Supabase
1. Acesse https://app.supabase.com
2. Vá em **Table Editor**
3. Clique na tabela `user_data`
4. Você deve ver uma linha com `user_id: "Liam"` ou `"Day"`
5. Clique na tabela `history`
6. Você deve ver o registro que salvou

---

## 🔍 Verificando Erros

### No Console do Navegador (F12)

**Erro comum 1: "relation does not exist"**
```
❌ Erro: relation "user_data" does not exist
```
**Solução:** Execute o script SQL no Supabase (supabase-schema.sql)

**Erro comum 2: "Invalid API key"**
```
❌ Erro: Invalid API key
```
**Solução:** Verifique a secret key em `src/config/supabase.js`

**Erro comum 3: "Failed to fetch"**
```
❌ Erro: Failed to fetch
```
**Solução:** Verifique a URL do Supabase em `src/config/supabase.js`

**Erro comum 4: "Network error"**
```
❌ Erro: Network request failed
```
**Solução:** Verifique sua conexão com internet e se o projeto Supabase está ativo

---

## ✅ Checklist de Teste Completo

Marque conforme testa:

- [ ] Teste rápido (`test-supabase.html`) passou
- [ ] App inicia sem erros (`npm run dev`)
- [ ] Console não mostra erros ao abrir
- [ ] Consegue selecionar usuário (Liam/Day)
- [ ] Consegue salvar dados básicos
- [ ] Dados aparecem no Supabase (Table Editor)
- [ ] Consegue salvar no histórico
- [ ] Histórico aparece na página
- [ ] Consegue adicionar refeições na dieta
- [ ] Refeições salvam automaticamente
- [ ] Backup funciona (exportar dados)
- [ ] Restaurar funciona (importar dados)

---

## 🐛 Troubleshooting

### Problema: "Tabelas não existem"

**Solução:**
1. Vá em https://app.supabase.com
2. SQL Editor → New Query
3. Copie todo o conteúdo de `supabase-schema.sql`
4. Cole e execute (Run)
5. Aguarde confirmação

### Problema: "Dados não salvam"

**Solução:**
1. Abra o console (F12)
2. Veja a mensagem de erro
3. Verifique se a URL está correta
4. Verifique se as tabelas foram criadas

### Problema: "App não inicia"

**Solução:**
```bash
# Reinstalar dependências
npm install

# Tentar novamente
npm run dev
```

---

## 📞 Próximos Passos

Se todos os testes passaram:

1. ✅ Integração funcionando!
2. ✅ Dados sendo salvos no Supabase
3. ✅ Pode usar o app normalmente

Se algum teste falhou:

1. Verifique a mensagem de erro no console
2. Consulte a seção "Troubleshooting" acima
3. Verifique se executou o SQL no Supabase

---

## 💡 Dica

Mantenha o **Console do Navegador (F12)** aberto enquanto testa. Ele mostrará:
- ✅ Mensagens de sucesso
- ❌ Erros detalhados
- 📊 Requisições ao Supabase

