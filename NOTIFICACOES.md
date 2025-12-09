# 🔔 Sistema de Notificações - Nutrition Pro

## 📱 Como Funciona

### ✅ **Notificações do Navegador (Já Implementado)**

O app agora suporta notificações nativas do navegador que funcionam no celular quando você:

1. **Instala o app como PWA** (Progressive Web App)
2. **Permite notificações** no navegador

### 🚀 Como Instalar no Celular

#### **Android (Chrome):**
1. Abra o app no navegador Chrome
2. Toque no menu (⋮) no canto superior direito
3. Selecione "Adicionar à tela inicial" ou "Instalar app"
4. Confirme a instalação
5. O app aparecerá como um ícone na tela inicial

#### **iPhone (Safari):**
1. Abra o app no Safari
2. Toque no botão de compartilhar (□↑)
3. Role até "Adicionar à Tela de Início"
4. Confirme a instalação
5. O app aparecerá como um ícone na tela inicial

### 🔔 Ativando Notificações

1. Acesse a página "Refeições"
2. Clique no botão "🔔 Ativar Notificações"
3. Permita notificações quando o navegador solicitar
4. Pronto! Você receberá lembretes automaticamente

### 📬 Notificações Disponíveis

- **💧 Água**: Lembretes a cada 2 horas (8h, 10h, 12h, 14h, 16h, 18h, 20h)
- **🍽️ Refeições**: Lembrete 15 minutos antes de cada refeição programada

### ⚠️ Sobre WhatsApp

**Não é possível enviar mensagens diretas para WhatsApp** porque:

1. A API do WhatsApp Business é **paga** (requer plano comercial)
2. Precisa de um **servidor backend** para autenticação
3. Requer **aprovação do WhatsApp** para uso comercial

### 💡 Alternativas Implementadas

✅ **Notificações Push do Navegador** - Funciona quando o app está instalado
✅ **PWA Instalável** - App funciona como nativo no celular
✅ **Notificações Nativas** - Integração com o sistema do celular
✅ **Funciona Offline** - Service Worker permite uso sem internet

### 🔮 Futuras Melhorias Possíveis

- Integração com Telegram Bot (gratuito, mas requer servidor)
- Notificações por Email (requer servidor)
- SMS (requer serviço pago)

### 📝 Notas Técnicas

- As notificações funcionam mesmo com o app fechado (através do Service Worker)
- O app funciona offline após primeira visita
- Dados são salvos localmente no celular
- Não requer conexão com internet para uso básico

