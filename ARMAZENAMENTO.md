# 💾 Sistema de Armazenamento - Nutrition Pro

## 📍 Onde os Dados São Armazenados

Todos os dados são salvos no **localStorage** do navegador, que é um armazenamento local do dispositivo.

### 🔑 Chaves de Armazenamento

O app usa as seguintes chaves no localStorage:

#### **Dados do Usuário:**
- `nutrition_userData_Liam` - Dados do perfil do Liam
- `nutrition_userData_Day` - Dados do perfil do Day

#### **Histórico de Cálculos:**
- `nutrition_history_Liam` - Histórico completo do Liam
- `nutrition_history_Day` - Histórico completo do Day

#### **Tracker de Macros:**
- `macroTracker_Liam_YYYY-MM-DD` - Dados do tracker por data (ex: `macroTracker_Liam_2025-01-15`)
- `macroTracker_Day_YYYY-MM-DD` - Dados do tracker por data (ex: `macroTracker_Day_2025-01-15`)

#### **Planejamento de Refeições:**
- `mealPlanner_Liam_YYYY-MM-DD` - Refeições planejadas por data
- `mealPlanner_Day_YYYY-MM-DD` - Refeições planejadas por data
- `mealPlanner_template_Liam` - Template de refeições do Liam
- `mealPlanner_template_Day` - Template de refeições do Day

#### **Metas Personalizadas:**
- `goals_Liam` - Metas do Liam
- `goals_Day` - Metas do Day

## 📱 Localização Física no Dispositivo

### **Windows (Chrome/Edge):**
```
C:\Users\[SEU_USUARIO]\AppData\Local\Google\Chrome\User Data\Default\Local Storage\leveldb\
```

### **Windows (Firefox):**
```
C:\Users\[SEU_USUARIO]\AppData\Roaming\Mozilla\Firefox\Profiles\[PROFILE]\storage\default\
```

### **Android (Chrome):**
```
/data/data/com.android.chrome/app_chrome/Default/Local Storage/leveldb/
```

### **iOS (Safari):**
```
/var/mobile/Library/Safari/LocalStorage/
```

## 🔍 Como Ver os Dados Armazenados

### **No Navegador (F12):**

1. Abra o DevTools (F12)
2. Vá na aba **Application** (Chrome) ou **Armazenamento** (Firefox)
3. No menu lateral, expanda **Local Storage**
4. Clique na URL do site
5. Você verá todas as chaves e valores armazenados

### **Via Console do Navegador:**

```javascript
// Ver todos os dados do Liam
localStorage.getItem('nutrition_userData_Liam')

// Ver histórico do Day
localStorage.getItem('nutrition_history_Day')

// Ver todas as chaves
Object.keys(localStorage).filter(k => k.includes('nutrition') || k.includes('macro') || k.includes('meal') || k.includes('goals'))

// Ver todos os dados
for (let key in localStorage) {
  if (key.startsWith('nutrition') || key.startsWith('macro') || key.startsWith('meal') || key.startsWith('goals')) {
    console.log(key, localStorage.getItem(key))
  }
}
```

## ⚠️ Características do localStorage

### ✅ **Vantagens:**
- Dados persistem após fechar o navegador
- Rápido e eficiente
- Não requer servidor
- Funciona offline
- Privado (só visível no seu navegador)

### ⚠️ **Limitações:**
- **Específico do navegador**: Dados do Chrome não aparecem no Firefox
- **Específico do dispositivo**: Dados do PC não aparecem no celular
- **Limite de tamanho**: ~5-10 MB (geralmente suficiente)
- **Pode ser limpo**: Se limpar dados do navegador, os dados são perdidos
- **Não sincroniza**: Não sincroniza entre dispositivos automaticamente

## 💾 Backup dos Dados

### **Exportar Backup:**
O app tem uma função de backup que exporta TODOS os dados em um arquivo JSON:
- Vá em **Backup** no menu
- Clique em **"📥 Baixar Backup"**
- Um arquivo JSON será baixado com todos os seus dados

### **Importar Backup:**
- Vá em **Backup** no menu
- Clique em **"📤 Escolher Arquivo"**
- Selecione o arquivo JSON de backup
- Todos os dados serão restaurados

## 🔐 Segurança e Privacidade

- ✅ Dados ficam **apenas no seu dispositivo**
- ✅ **Não são enviados** para nenhum servidor
- ✅ **Não são compartilhados** com terceiros
- ✅ Apenas você tem acesso aos dados
- ⚠️ Se limpar o cache do navegador, os dados serão perdidos (faça backup!)

## 📊 Estrutura dos Dados

### **Dados do Usuário:**
```json
{
  "peso": 80,
  "altura": 180,
  "idade": 30,
  "sexo": "masculino",
  "nivelAtividade": "moderado",
  "goal": "cutting",
  "tmbFormula": "mifflin",
  "proteinPerKg": 2.0,
  "fatPerKg": 1.0,
  "waterPerKg": 35,
  // ... outros dados
}
```

### **Histórico:**
```json
[
  {
    "timestamp": "2025-01-15T10:30:00.000Z",
    "bodyFatPercentage": 12.5,
    "leanMass": 70.0,
    "tmb": 1800,
    "tdee": 2790,
    "targetCalories": 2371,
    "userData": { /* dados completos */ },
    "macros": { /* macros */ }
  }
]
```

## 🆘 Recuperação de Dados

Se você perder os dados:

1. **Verifique o backup**: Se você exportou um backup, importe-o
2. **Verifique outros navegadores**: Se usou outro navegador, os dados estão lá
3. **Verifique outros dispositivos**: Se usou no celular, os dados estão no celular
4. **⚠️ Limpeza acidental**: Se limpou os dados do navegador, não há como recuperar (por isso o backup é importante!)

## 💡 Dicas

- **Faça backup regularmente** - Use a função de backup pelo menos uma vez por semana
- **Use o mesmo navegador** - Para manter os dados consistentes
- **Não limpe o cache** - Ou faça backup antes
- **Exporte antes de formatar** - Se for formatar o PC, exporte o backup primeiro

