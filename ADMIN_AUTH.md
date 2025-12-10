# 🔒 Setup de Autenticação Admin

## Configuração Inicial

### 1. Criar Migração no Prisma (campos isAdmin e password)

```bash
npm run prisma:migrate
```

Confirme e crie a migração com os novos campos `password` e `isAdmin` no modelo `Client`.

### 2. Criar Usuário Admin "don"

```bash
npm run prisma:seed
```

Isso criará automaticamente um usuário admin com:
- **Nome**: don
- **Senha**: lagunas123
- **Permissões**: Acesso admin a todas as rotas de criação/edição/deleção

## 📋 Rotas Protegidas por Admin

As seguintes operações **requerem privilégio admin** (POST/PUT/PATCH/DELETE):

- ✅ Criar/Editar/Deletar **Agendamentos** (`/api/appointments`)
- ✅ Criar/Editar/Deletar **Cardápio** (`/api/menu-items`)
- ✅ Criar/Editar/Deletar **Comandas** (`/api/tabs`)
- ✅ Adicionar/Remover Items de Comandas (`/api/tabs/[id]/items`)
- ✅ Registrar Pagamento de Comanda (`/api/tabs/[id]/pay`)

## 🔐 Fluxo de Login

1. **Login de Usuário Admin**:
   ```json
   POST /api/auth/login
   {
     "phone": "+55 (11) 99999-9999",
     "password": "lagunas123"
   }
   ```
   Retorna JWT token com `isAdmin: true` no payload.

2. **Verificação**:
   - Middleware bloqueia rotas protegidas sem token válido → redireciona para `/login`
   - Rotas admin adicionam verificação extra de `requireAdmin()` nos handlers

3. **Logout**:
   ```
   POST /api/auth/logout
   ```
   Remove cookie de token e redireciona para `/login`.

## 📝 Variáveis de Ambiente Necessárias

No `.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/bg_lagunas
JWT_SECRET=sua_chave_secreta_aqui
```

---

**Status**: ✅ Autenticação com sistema admin implementado e pronto para uso.
