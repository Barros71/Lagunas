# 🧪 Guia de Testes - BG Lagunas Auth

Este arquivo descreve como testar os endpoints de autenticação usando Thunder Client, Insomnia ou Postman.

## 📋 Checklist de Testes

- [ ] ✓ O cadastro funciona
- [ ] ✓ O login retorna token e salva o cookie
- [ ] ✓ O middleware bloqueia requisições sem token
- [ ] ✓ O refresh gera um novo token
- [ ] ✓ O acesso a rotas protegidas funciona apenas com cookie válido

---

## 🚀 Passo a Passo

### 1️⃣ **CADASTRO** (POST `/api/auth/register`)

**URL:** `http://localhost:3000/api/auth/register`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body (raw JSON):**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "phone": "11999999999"
}
```

**Resposta esperada (200):**
```json
{
  "message": "Usuario registrado com sucesso",
  "user": {
    "id": "cuid-aqui",
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

✅ **Teste:** Se retornar 200 com dados do usuário, o cadastro funciona!

---

### 2️⃣ **LOGIN** (POST `/api/auth/login`)

**URL:** `http://localhost:3000/api/auth/login`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body (raw JSON):**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta esperada (200):**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "cuid-aqui",
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

**⚠️ Importante:**
- ✅ Copie o `token` para os testes posteriores
- ✅ Copie o `refreshToken` para testar o refresh
- ✅ Verifique se um **cookie** foi setado (veja em "Cookies" na aba de resposta)

✅ **Teste:** Se retornar 200, token está presente e cookie foi salvo!

---

### 3️⃣ **ACESSO PROTEGIDO SEM TOKEN** (GET `/api/protegido`)

**URL:** `http://localhost:3000/api/protegido`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:** Vazio

**Resposta esperada (401 ou 403):**
```json
{
  "error": "Token inválido ou ausente"
}
```

✅ **Teste:** Se retornar 401/403, o middleware está bloqueando corretamente!

---

### 4️⃣ **ACESSO PROTEGIDO COM COOKIE** (GET `/api/protegido`)

**URL:** `http://localhost:3000/api/protegido`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Cookie": "token=eyJhbGc... (copie do login)"
}
```

**Body:** Vazio

**Resposta esperada (200):**
```json
{
  "message": "Acesso autorizado",
  "user": {
    "id": "cuid-aqui",
    "email": "joao@example.com"
  }
}
```

✅ **Teste:** Se retornar 200, o middleware está validando o cookie corretamente!

---

### 5️⃣ **ACESSO PROTEGIDO COM TOKEN NO HEADER** (GET `/api/protegido`)

**URL:** `http://localhost:3000/api/protegido`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGc... (copie do login)"
}
```

**Body:** Vazio

**Resposta esperada (200):**
```json
{
  "message": "Acesso autorizado",
  "user": {
    "id": "cuid-aqui",
    "email": "joao@example.com"
  }
}
```

✅ **Teste:** Se retornar 200, o middleware aceita Authorization header!

---

### 6️⃣ **REFRESH TOKEN** (POST `/api/auth/refresh`)

**URL:** `http://localhost:3000/api/auth/refresh`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body (raw JSON):**
```json
{
  "refreshToken": "eyJhbGc... (copie do login)"
}
```

**Resposta esperada (200):**
```json
{
  "message": "Token renovado com sucesso",
  "token": "eyJhbGc... (novo token)",
  "refreshToken": "eyJhbGc... (novo refresh token)"
}
```

✅ **Teste:** Se retornar 200 com novo token, o refresh funciona!

---

## 📊 Resumo da Validação

| Teste | Endpoint | Esperado | Status |
|-------|----------|----------|--------|
| Cadastro | POST `/api/auth/register` | 200 ✓ | ⬜ |
| Login | POST `/api/auth/login` | 200 + Token + Cookie | ⬜ |
| Sem Token | GET `/api/protegido` | 401/403 ❌ | ⬜ |
| Com Cookie | GET `/api/protegido` | 200 ✓ | ⬜ |
| Com Header | GET `/api/protegido` | 200 ✓ | ⬜ |
| Refresh | POST `/api/auth/refresh` | 200 + Novo Token | ⬜ |

---

## 🔧 Como Usar no Thunder Client

1. **Abrir Thunder Client** (extensão VS Code)
2. **Clicar em "Collections"**
3. **Clicar em "Import" → selecionar `thunder-client-tests.json`**
4. **Executar testes na ordem:**
   - Cadastro
   - Login (copiar token e cookie)
   - Acesso sem token
   - Acesso com cookie
   - Acesso com header
   - Refresh token

---

## 💡 Dicas

- **Copiar Cookie:** Após o login, verifique a aba "Cookies" para copiar o valor
- **Copiar Token:** O token vem na resposta JSON como `token`
- **Bearer Token:** Use o formato `Bearer {token}` no Authorization header
- **Ambiente:** Certifique-se que o servidor está rodando em `localhost:3000`

---

## 🐛 Troubleshooting

**"Token inválido ou ausente" em tudo:**
- Verifique se o servidor está rodando: `npm run dev`
- Verifique se o token foi copiado corretamente

**"CORS error":**
- Verifique se há CORS middleware configurado

**Cookie não aparece:**
- Verifique se o endpoint está setando o cookie com `Set-Cookie` header
- Verifique permissões de HttpOnly e Secure

---

Boa sorte nos testes! 🚀
