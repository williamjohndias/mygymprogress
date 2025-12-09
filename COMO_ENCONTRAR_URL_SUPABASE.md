# 🔍 Como Encontrar a URL do Supabase - Guia Visual

## Método 1: Através de Settings → API (Recomendado)

### Passo a Passo:

1. **Acesse o Supabase Dashboard**
   ```
   https://app.supabase.com
   ```

2. **Selecione seu Projeto**
   - Se você já tem um projeto, clique nele
   - Se não tem, clique em **"New Project"** e crie um

3. **Vá para Settings**
   - No menu lateral esquerdo, procure por **"Settings"** ou **"⚙️ Configurações"**
   - Clique nele

4. **Acesse API**
   - Dentro de Settings, procure por **"API"** ou **"APIs"**
   - Clique nessa opção

5. **Encontre a Project URL**
   - Você verá uma seção chamada **"Project URL"** ou **"URL do Projeto"**
   - A URL será algo assim:
     ```
     https://abcdefghijklmnop.supabase.co
     ```
   - **Copie essa URL completa** (todo o texto com https://)

## Método 2: Através do Dashboard do Projeto

1. **No Dashboard do seu projeto**
2. **Procure por informações do projeto**
   - Geralmente aparece no topo da página
   - Ou em um card com informações do projeto
3. **A URL geralmente está visível lá**

## Método 3: Através de Project Settings

1. **Clique no nome do projeto** (canto superior esquerdo)
2. **Vá em "Project Settings"** ou "Configurações do Projeto"
3. **Procure por "API"** ou "URLs"
4. **A Project URL estará lá**

## 📋 O que você está procurando:

A URL tem este formato:
```
https://[código-único].supabase.co
```

Exemplo real:
```
https://abcdefghijklmnopqrstuvwxyz.supabase.co
```

## ⚠️ Importante:

- **NÃO confunda** com outras URLs que você pode ver:
  - ❌ Anon/Public Key (é uma chave, não uma URL)
  - ❌ Service Role Key (é uma chave secreta)
  - ✅ **Project URL** (é a URL que você precisa!)

## 🎯 Depois de encontrar:

1. Copie a URL completa
2. Abra o arquivo `src/config/supabase.js`
3. Substitua esta linha:
   ```javascript
   const SUPABASE_URL = 'https://seu-projeto.supabase.co' // SUBSTITUA AQUI
   ```
4. Pela sua URL:
   ```javascript
   const SUPABASE_URL = 'https://abcdefghijklmnop.supabase.co' // SUA URL AQUI
   ```

## 🆘 Ainda não encontrou?

Se você não conseguir encontrar:

1. **Verifique se está logado** na conta correta
2. **Verifique se selecionou o projeto correto**
3. **Tente criar um novo projeto** se não tiver nenhum
4. A URL também pode estar em:
   - **Project Overview** (Visão Geral do Projeto)
   - **General Settings** (Configurações Gerais)

## 📸 Onde aparece visualmente:

```
┌─────────────────────────────────────┐
│  Supabase Dashboard                  │
├─────────────────────────────────────┤
│  Settings → API                      │
│                                      │
│  Project URL:                        │
│  ┌──────────────────────────────┐  │
│  │ https://xxxxx.supabase.co    │  │ ← COPIE ESTA URL
│  └──────────────────────────────┘  │
│                                      │
│  Anon public: eyJhbGc...            │
│  Service role: eyJhbGc...            │
└─────────────────────────────────────┘
```

