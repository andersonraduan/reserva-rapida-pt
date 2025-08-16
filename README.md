# SaaS de Agendamentos com Pagamento

Aplicação React + TypeScript completa para agendamentos com sistema de pagamento de sinal.

## 🚀 Funcionalidades

### ✅ Implementado na v1
- **Autenticação completa** (login/signup com RBAC)
- **Fluxo de agendamento** (selecionar serviço → horário → pagamento)
- **Múltiplos métodos de pagamento** (cartão, MB WAY, Multibanco)
- **Interface responsiva** com design profissional
- **Mocks de API funcionais** com MSW
- **Formatação pt-PT** e moeda EUR
- **Sistema de design consistente**

### 🔄 Próximas versões
- Dashboard do profissional (gestão de serviços, disponibilidade)
- Reagendamento com validações
- Relatórios financeiros
- Notificações por email
- Dashboard administrativo

## 🛠 Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Estado**: Zustand (auth) + React Query (dados)
- **Roteamento**: React Router v6
- **Datas**: Day.js com timezone support
- **Mocks**: MSW (Mock Service Worker)
- **UI**: Componentes shadcn/ui customizados

## 🎨 Design System

**Paleta de cores profissional:**
- Primary: Azul profissional (`#3B82F6`)
- Gradients sutis e shadows elegantes
- Dark mode ready
- Componentes reutilizáveis

## 📱 Páginas Implementadas

1. **Home** (`/`) - Landing + seleção de serviço/profissional
2. **Login** (`/login`) - Autenticação
3. **Signup** (`/signup`) - Registo de nova conta
4. **Horários** (`/availability`) - Calendário de slots disponíveis
5. **Pagamento** (`/checkout/:id`) - Métodos de pagamento
6. **Sucesso** (`/success/:id`) - Confirmação da marcação

## 🔧 Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🧪 Contas de Demonstração

**Cliente:**
- Email: `ana@example.com`
- Password: qualquer

**Profissional:**
- Email: `joao@example.com`
- Password: qualquer

## 📋 API Mockada

Os mocks estão ativos por padrão e simulam:
- Autenticação JWT
- CRUD de serviços
- Disponibilidade de horários
- Criação e pagamento de marcações
- Configurações globais

**Para integrar backend real:**
1. Alterar `baseUrl` em `src/api/client.ts`
2. Remover importação `./api/worker` do `App.tsx`
3. API segue especificação documentada nos types

## 🗂 Estrutura do Projeto

```
src/
├── components/         # Componentes reutilizáveis
├── pages/             # Páginas da aplicação
├── hooks/             # Custom hooks (auth, queries)
├── store/             # Zustand stores
├── api/               # Cliente API + mocks MSW
├── utils/             # Utilities (datas, moeda, RBAC)
└── components/ui/     # Sistema de design (shadcn)
```

## 💰 Fluxo de Pagamento

1. **Selecionar** serviço e profissional
2. **Escolher** horário disponível
3. **Criar** marcação (status: draft)
4. **Pagar** sinal para confirmar
5. **Receber** confirmação

**Métodos suportados:**
- Cartão (redirect simulado para Stripe)
- MB WAY (simulação de autorização)
- Multibanco (referência + countdown)

## 🔐 RBAC (Role-Based Access Control)

- **client**: Agendar e gerir as suas marcações
- **professional**: + Gerir serviços e disponibilidade
- **space_admin**: + Gerir equipa e espaço
- **master_admin**: + Configurações globais e KPIs

## 📈 Próximos Passos

1. **Dashboard profissional** - gestão completa
2. **Reagendamento** - com regras e validações
3. **Relatórios** - financeiros e analytics
4. **Notificações** - email e SMS
5. **Multibanco** - countdown e expiração
6. **Testes** - Vitest + RTL para fluxos críticos

---

Desenvolvido com ❤️ usando React + TypeScript