# App de Nutrição - Liam & Day

Aplicação web completa para cálculo nutricional com suporte a dois usuários fixos (Liam e Day). Cada usuário possui perfil próprio, histórico separado e cálculos independentes.

## 🚀 Funcionalidades

### Perfis de Usuário
- **Liam** (Masculino) - Perfil pré-configurado
- **Day** (Feminino) - Perfil pré-configurado
- Dados salvos separadamente no navegador (localStorage)
- Troca de perfil a qualquer momento

### Entrada de Dados
- **Dados Básicos Obrigatórios:**
  - Peso (kg)
  - Altura (cm)
  - Idade
  - Sexo (pré-configurado por usuário)
  
- **Configurações:**
  - Nível de atividade física
  - Objetivo (Cutting, Manutenção, Bulking)
  - Fórmula TMB (automática ou manual)

- **Dobras Cutâneas (Pollock 7 dobras) - Opcional:**
  - Peitoral
  - Axilar média
  - Tríceps
  - Subescapular
  - Abdominal
  - Supra-ilíaca
  - Coxa

- **Circunferências - Opcional:**
  - Cintura
  - Pescoço
  - Quadril (apenas para Day)

- **Ajustes Avançados:**
  - Proteína (g/kg)
  - Gorduras (g/kg ou % das calorias)
  - Água (ml/kg)

### Cálculos Implementados

#### 1. % Gordura Corporal
- **Fórmula:** Pollock 7 dobras
- Cálculo específico para homens e mulheres
- Requer todas as 7 dobras preenchidas

#### 2. Massa Magra
- **Fórmula:** `massa magra = peso × (1 − BF%)`
- Calculada automaticamente quando % gordura está disponível

#### 3. TMB (Taxa Metabólica Basal)
Três fórmulas disponíveis:
- **Mifflin-St Jeor** (padrão)
- **Harris-Benedict Revisada**
- **Katch-McArdle** (requer % gordura - sugerido automaticamente)

#### 4. TDEE (Gasto Energético Total Diário)
- **Fórmula:** `TDEE = TMB × fator de atividade`
- Fatores de atividade:
  - Sedentário: 1.2x
  - Leve: 1.375x
  - Moderado: 1.55x
  - Alto: 1.725x
  - Muito Alto: 1.9x

#### 5. Calorias Alvo
Baseado no objetivo:
- **Cutting:** Déficit de 15% (média entre 10-20%)
- **Manutenção:** 100% do TDEE
- **Bulking:** Superávit de 12.5% (média entre 10-15%)

#### 6. Macronutrientes
- **Proteína:**
  - Cutting: 1.8-2.2 g/kg (padrão: 2.0)
  - Manutenção: 1.6-2.0 g/kg (padrão: 1.8)
  - Bulking: 1.6-2.4 g/kg (padrão: 2.0)
  - Ajustável manualmente

- **Gorduras:**
  - Padrão: 25% das calorias ou 1 g/kg (o maior)
  - Ajustável por g/kg ou % das calorias
  - Faixa recomendada: 20-30%

- **Carboidratos:**
  - Calculado automaticamente (calorias restantes)

#### 7. Água Diária
- **Fórmula:** `peso × ml/kg`
- Padrão: 35 ml/kg
- Faixa recomendada: 30-45 ml/kg
- Ajustável

#### 8. TEF (Thermic Effect of Food)
- ~10% do TDEE
- Explicação incluída na interface

### Interface Visual

- **Cards Informativos:**
  - % Gordura
  - Massa Magra
  - TMB (com fórmula usada)
  - TDEE
  - Calorias Alvo (destacado)
  - Água Diária
  - TEF

- **Gráficos:**
  - Gráfico de pizza: Distribuição de macronutrientes
  - Gráfico de barras: TMB × TDEE × Calorias Alvo

- **Macronutrientes:**
  - Cards coloridos com valores em gramas, calorias e percentuais

### Histórico

- Registro de todos os cálculos salvos
- Visualização por usuário (separado)
- Exclusão de registros individuais
- Exportação para CSV (apenas do usuário atual)
- Informações completas de cada registro:
  - Data e hora
  - Dados básicos
  - Resultados calculados
  - Macronutrientes

### Validações e Avisos

- Avisos quando dados obrigatórios estão incompletos
- Sugestão automática de Katch-McArdle quando % gordura está disponível
- Mensagens informativas sobre fórmulas e cálculos

## 📱 Notificações e PWA

### Instalar no Celular

O app pode ser instalado como **Progressive Web App (PWA)** no celular:

**Android:**
1. Abra no Chrome
2. Menu (⋮) → "Adicionar à tela inicial"
3. O app aparecerá como ícone na tela inicial

**iPhone:**
1. Abra no Safari
2. Botão Compartilhar (□↑) → "Adicionar à Tela de Início"
3. O app aparecerá como ícone na tela inicial

### Ativar Notificações

1. Acesse a página **"Refeições"**
2. Clique em **"🔔 Ativar Notificações"**
3. Permita notificações quando solicitado
4. Você receberá lembretes de:
   - 💧 **Água**: A cada 2 horas (8h, 10h, 12h, 14h, 16h, 18h, 20h)
   - 🍽️ **Refeições**: 15 minutos antes de cada refeição programada

### ⚠️ Sobre WhatsApp

**Não é possível enviar mensagens diretas para WhatsApp** porque requer:
- API WhatsApp Business (paga)
- Servidor backend
- Aprovação comercial

**Alternativas implementadas:**
- ✅ Notificações push do navegador (funcionam mesmo com app fechado)
- ✅ PWA instalável no celular
- ✅ Notificações nativas do sistema

## 📋 Requisitos

- Node.js 16+ e npm (ou yarn)
- Navegador moderno com suporte a localStorage
- Para notificações: Navegador com suporte a Service Workers e Notifications API

## 🛠️ Instalação e Execução

### Opção 1: Desenvolvimento Local (Recomendado)

1. **Instalar dependências:**
```bash
npm install
```

2. **Iniciar servidor de desenvolvimento:**
```bash
npm run dev
```

3. **Abrir no navegador:**
   - O servidor iniciará em `http://localhost:5173` (ou outra porta disponível)
   - Abra a URL no navegador

### Opção 2: Build de Produção

1. **Instalar dependências:**
```bash
npm install
```

2. **Criar build:**
```bash
npm run build
```

3. **Visualizar build:**
```bash
npm run preview
```

4. **Ou servir a pasta `dist` com um servidor estático:**
   - Os arquivos estarão na pasta `dist`
   - Pode ser servido com qualquer servidor HTTP estático

## 📁 Estrutura do Projeto

```
gymprogress/
├── src/
│   ├── components/
│   │   ├── UserSelector.jsx      # Seleção de usuário
│   │   ├── DataInput.jsx         # Formulário de entrada
│   │   ├── Results.jsx           # Exibição de resultados
│   │   ├── History.jsx           # Histórico de cálculos
│   │   └── *.css                 # Estilos dos componentes
│   ├── utils/
│   │   ├── calculations.js       # Funções de cálculo
│   │   └── storage.js            # Gerenciamento de localStorage
│   ├── App.jsx                   # Componente principal
│   ├── App.css
│   ├── main.jsx                  # Ponto de entrada
│   └── index.css                 # Estilos globais
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 💾 Armazenamento de Dados

Todos os dados são salvos no **localStorage** do navegador:

- **Dados do usuário:** `nutrition_userData_Liam` e `nutrition_userData_Day`
- **Histórico:** `nutrition_history_Liam` e `nutrition_history_Day`

Os dados persistem mesmo após fechar o navegador, mas são específicos do navegador e dispositivo.

## 🎨 Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool e dev server
- **Chart.js** - Gráficos interativos
- **React Chart.js 2** - Wrapper React para Chart.js
- **CSS3** - Estilização moderna com gradientes e animações

## 📝 Notas Importantes

1. **Dados Obrigatórios:** Pelo menos Peso, Altura e Idade são necessários para calcular valores básicos.

2. **% Gordura:** Requer todas as 7 dobras cutâneas preenchidas. Se disponível, a fórmula Katch-McArdle será sugerida automaticamente para o cálculo de TMB.

3. **Exportação CSV:** O arquivo CSV exportado inclui todos os dados do histórico do usuário atual, formatado para fácil importação em planilhas.

4. **Responsividade:** A interface é totalmente responsiva e funciona bem em dispositivos móveis, tablets e desktops.

## 🔧 Personalização

### Ajustar Valores Padrão

Os valores padrão de macronutrientes podem ser ajustados no arquivo `src/utils/calculations.js`:

```javascript
const proteinRanges = {
  cutting: 2.0,      // Ajustar aqui
  manutencao: 1.8,   // Ajustar aqui
  bulking: 2.0       // Ajustar aqui
}
```

### Modificar Fatores de Atividade

No mesmo arquivo, função `calculateTDEE`:

```javascript
const factors = {
  sedentario: 1.2,
  leve: 1.375,
  moderado: 1.55,
  alto: 1.725,
  muitoAlto: 1.9
}
```

## 📄 Licença

Este projeto foi desenvolvido para uso pessoal.

## 🤝 Suporte

Para dúvidas ou problemas:
1. Verifique se todos os dados obrigatórios estão preenchidos
2. Certifique-se de que o navegador suporta localStorage
3. Verifique o console do navegador para erros

---

**Desenvolvido com ❤️ para acompanhamento nutricional de Liam e Day**

