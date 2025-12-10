# BG LAGUNAS - Painel Administrativo

Sistema de gerenciamento para tatuaria, bar e drinks com agendamentos, cardápio e sistema de comandas.

## 🚀 Stack Tecnológico

- **Framework**: Next.js 16.0.7 (App Router)
- **UI**: React 19.2.0 + shadcn/ui
- **Banco de Dados**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS v4.1.17
- **Autenticação**: JWT com cookies
- **Estado**: @tanstack/react-query
- **Validação**: Zod
- **Datas**: date-fns (português)
- **HTTP**: Axios
- **TypeScript**: 5.x

## 📁 Estrutura do Projeto

```
bg_lagunas/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (dashboard)/              # Route group para páginas autenticadas
│   │   │   ├── dashboard/            # Dashboard principal
│   │   │   ├── agenda/               # Gerenciamento de agendamentos
│   │   │   ├── comandas/             # Gerenciamento de comandas/tabs
│   │   │   ├── cardapio/             # Gerenciamento de menu
│   │   │   └── layout.tsx            # Layout com sidebar
│   │   ├── api/                      # API routes
│   │   │   ├── auth/                 # Autenticação
│   │   │   ├── appointments/         # Agendamentos
│   │   │   ├── menu-items/           # Itens do menu
│   │   │   ├── tabs/                 # Comandas
│   │   │   └── dashboard/            # Stats do dashboard
│   │   ├── layout.tsx                # Layout raiz
│   │   ├── page.tsx                  # Redirect para /dashboard
│   │   ├── globals.css               # Estilos globais
│   │   └── providers.tsx             # React Query Provider
│   │
│   ├── components/                   # Componentes React
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── agenda/                   # Componentes de agendamento
│   │   │   ├── AppointmentCard.tsx
│   │   │   └── AppointmentModal.tsx
│   │   ├── tabs/                     # Componentes de comandas
│   │   │   ├── TabCard.tsx
│   │   │   ├── TabDetailModal.tsx
│   │   │   ├── NewTabModal.tsx
│   │   │   └── PaymentModal.tsx
│   │   └── menu/                     # Componentes de menu
│   │       ├── MenuItemCard.tsx
│   │       └── MenuItemModal.tsx
│   │
│   ├── hooks/
│   │   └── useApi.ts                 # Hooks de React Query para API
│   │
│   ├── lib/
│   │   ├── utils.ts                  # Utilitários gerais
│   │   └── helpers.ts                # Funções auxiliares (datas, formatação)
│   │
│   ├── types/
│   │   └── api.ts                    # Tipos TypeScript para API
│   │
│   ├── constants/
│   │   └── index.ts                  # Constantes da aplicação
│   │
│   ├── middleware.ts                 # Middleware Next.js (autenticação)
│   └── env.d.ts                      # Tipos de env
│
├── prisma/
│   ├── schema.prisma                 # Schema do banco de dados
│   └── migrations/                   # Migrações do Prisma
│
├── .env                              # Variáveis de ambiente
├── .env.example                      # Template de variáveis
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.ts
├── postcss.config.mjs
├── prettier.config.js
└── README.md
```

## 🔧 Configuração

### Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/bg_lagunas"
JWT_SECRET="sua_chave_secreta_aqui"
REFRESH_TOKEN_SECRET="sua_chave_de_refresh_aqui"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### Instalação

```bash
# Instalar dependências
npm install

# Executar migrações do Prisma
npm run prisma:migrate

# Iniciar servidor de desenvolvimento
npm run dev
```

## 📱 Páginas

### Dashboard (`/dashboard`)
- **KPIs**: Agendamentos hoje/semana, faturamento mês, comandas abertas
- **Próximos agendamentos**: Lista dos 5 próximos agendamentos
- **Comandas abertas**: Lista das comandas em aberto
- **API**: GET `/api/dashboard/stats`

### Agenda (`/agenda`)
- **Calendário semanal**: Navegação por semana
- **Listagem por data**: Agendamentos filtrados por data
- **CRUD de agendamentos**: Criar, editar, deletar
- **Status**: agendado, confirmado, em_andamento, concluído, cancelado
- **API**: 
  - GET `/api/appointments?date=YYYY-MM-DD`
  - POST `/api/appointments`
  - PUT `/api/appointments/{id}`
  - DELETE `/api/appointments/{id}`

### Comandas (`/comandas`)
- **Abas**: Abertas, fechadas, pagas
- **Cartões**: Exibem cliente, quantidade de itens, total
- **Modal de detalhes**: Lista de itens da comanda
- **Modal de novo**: Criar nova comanda
- **Modal de pagamento**: Selecionar método de pagamento
- **API**:
  - GET `/api/tabs?status=aberta|fechada|paga`
  - POST `/api/tabs`
  - PATCH `/api/tabs/{id}` (atualizar status)
  - POST `/api/tabs/{id}/items` (adicionar item)
  - DELETE `/api/tabs/{id}/items/{itemId}` (remover item)
  - POST `/api/tabs/{id}/pay` (registrar pagamento)

### Cardápio (`/cardapio`)
- **Filtro por categoria**: bebidas, cervejas, drinks, petiscos, outros
- **Busca**: Buscar por nome
- **Cartões**: Nome, categoria, preço, preço promocional, disponibilidade
- **CRUD de itens**: Criar, editar, deletar
- **API**:
  - GET `/api/menu-items?category=bebidas|cervejas|drinks|petiscos|outros`
  - POST `/api/menu-items`
  - PUT `/api/menu-items/{id}`
  - DELETE `/api/menu-items/{id}`

## 🎨 Tema

### Cores Neon

- **Fundo**: `#0a0a0a` (Black)
- **Cards**: `#151515` (Dark Gray)
- **Borders**: `#2a2a2a` (Gray)
- **Primária**: `#00d4ff` (Cyan) - Dashboard
- **Secundária**: `#ff6b35` (Orange) - Comandas
- **Terciária**: `#ffd700` (Yellow) - Cardápio
- **Texto**: `#ffffff` (White)
- **Texto Secundário**: `#a0a0a0` (Light Gray)

## 🔐 Autenticação

- **Tipo**: JWT com cookies HTTP-only
- **Refresh**: Token de refresh automático
- **Middleware**: Valida token em todas as requisições protegidas
- **Rotas protegidas**: Todas as rotas em `(dashboard)`

## 📦 Tipos de Dados

### Appointment (Agendamento)

```typescript
{
  id: string;
  client_name: string;
  client_phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration: number; // minutos
  tattoo_description: string;
  tattoo_size: 'pequena' | 'media' | 'grande' | 'fechamento';
  price_estimate: number;
  status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### MenuItem (Item de Menu)

```typescript
{
  id: string;
  name: string;
  category: 'bebidas' | 'cervejas' | 'drinks' | 'petiscos' | 'outros';
  price: number;
  promo_price?: number;
  is_promo: boolean;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Tab (Comanda)

```typescript
{
  id: string;
  client_name: string;
  table_number?: number;
  items: TabItem[];
  total_amount: number;
  status: 'aberta' | 'fechada' | 'paga';
  payment_method?: 'dinheiro' | 'pix' | 'credito' | 'debito';
  createdAt: string;
  updatedAt: string;
}
```

## 🎯 Próximos Passos

1. **Implementar API routes** - Criar os endpoints RESTful
2. **Conectar banco de dados** - Criar modelos Prisma
3. **Implementar autenticação** - Login/Register
4. **Testes** - Unit e E2E tests
5. **Deployment** - Preparar para produção

## 📝 Scripts Disponíveis

```bash
npm run dev              # Iniciar dev server
npm run build            # Build para produção
npm run start            # Iniciar servidor produção
npm run lint             # Executar linter
npm run prisma:migrate   # Executar migrações Prisma
npm run prisma:studio    # Abrir Prisma Studio
```

## 🤝 Contribuindo

Entre em contato para detalhes sobre como contribuir.

## 📄 Licença

Propriedade do BG LAGUNAS
