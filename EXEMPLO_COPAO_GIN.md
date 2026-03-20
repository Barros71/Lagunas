# 🎬 EXEMPLO PRÁTICO - Copão de Gin com Sabores

## Cenário Completo: Criar e Usar um Produto com Opções

### 📋 Objetivo
Criar um "Copão de Gin com Vários Sabores" e demonstrar todo o fluxo.

---

## PASSO 1: Criar o Produto no Cardápio

### Na Aba "Cardápio"

1. Clique no botão **"Novo Item"** (canto superior direito)

2. Preencha o formulário:
   ```
   Nome do Item: Copão de Gin
   Categoria: Bebidas
   Preço (R$): 45.00
   Preço Promocional: [deixe em branco]
   Em Promoção: [desmarque]
   Disponível: [marque]
   ```

3. **NOVO**: Marque o checkbox **"Item com Múltiplas Opções"**
   - Uma nova seção aparecerá

4. Na seção "Opções/Sabores", adicione cada sabor:
   ```
   Campo de texto: "Morango" → Clique "Adicionar"
   Campo de texto: "Uva" → Clique "Adicionar"
   Campo de texto: "Maracujá" → Clique "Adicionar"
   Campo de texto: "Melancia" → Clique "Adicionar"
   Campo de texto: "Pêssego" → Clique "Adicionar"
   ```

5. Você verá as opções aparecerem como tags:
   ```
   [Morango ×] [Uva ×] [Maracujá ×] [Melancia ×] [Pêssego ×]
   ```
   (Clique no × para remover se necessário)

6. Clique **"Criar"** para salvar

### Resultado no Cardápio
- Um novo card aparece com:
  - ✅ Nome: "Copão de Gin"
  - ✅ Preço: R$ 45,00
  - ✅ Badge roxo com ícone: "🔹 Opções"
  - ✅ Lista dos sabores disponíveis

---

## PASSO 2: Adicionar à Comanda

### Na Aba "Comandas"

1. Abra uma comanda existente ou **crie uma nova**:
   - Clique "Nova Comanda"
   - Digite o nome do cliente
   - Confirme

2. Na modal aberta da comanda, clique **"Adicionar Item"**

3. Uma nova modal aparece "Adicionar Itens à Comanda"

4. **Procure pelo produto**:
   - Categoria: "Bebidas" ou busque "Copão"
   - Encontre o card "Copão de Gin" com o badge "Opções"

5. **IMPORTANTE**: 
   - ❌ NÃO clique em "Adicionar" (ele não existe para produtos com opções)
   - ✅ SIM, clique em **"Selecionar Opções"**

6. Uma **nova modal abre**: "Selecione as Opções"
   ```
   [Selecione a comanda ▼]
   
   Opções Disponíveis:
   [Morango]
   [Uva]
   [Maracujá]
   [Melancia]
   [Pêssego]
   
   Selecionadas: (vazio inicialmente)
   
   [Cancelar] [Adicionar (0)]
   ```

7. **Selecione as opções desejadas**:
   - Clique em "Morango" → Aparece embaixo com quantidade 1
   - Clique novamente em "Morango" → Quantidade muda para 2
   - Clique em "Maracujá" → Adiciona nova opção com quantidade 1
   - Clique em "Pêssego" → Adiciona nova opção com quantidade 1
   
   Resultado:
   ```
   Selecionadas (3):
   - Morango [−] 2 [+] [×]
   - Maracujá [−] 1 [+] [×]
   - Pêssego [−] 1 [+] [×]
   
   [Cancelar] [Adicionar (4)]
   ```
   (Total de 4 itens: 2 morango + 1 maracujá + 1 pêssego)

8. Clique **"Adicionar (4)"**

### Resultado na Comanda
A comanda agora mostra:
```
ITENS:
- Copão de Gin - Morango (X2) ............ R$ 90,00
- Copão de Gin - Maracujá (X1) ........... R$ 45,00
- Copão de Gin - Pêssego (X1) ............ R$ 45,00

TOTAL: R$ 180,00
```

---

## PASSO 3: Visualizar na Cozinha

### Na Aba "Cozinha"

Você verá:
```
┌─────────────────────────────────────┐
│ ⏱️ NOVO PEDIDO                       │
├─────────────────────────────────────┤
│ Cliente: João Silva                 │
│                                     │
│ 📋 PREPARAR:                         │
│ • Copão de Gin - Morango (X2)       │
│ • Copão de Gin - Maracujá (X1)      │
│ • Copão de Gin - Pêssego (X1)       │
│                                     │
│ [Pronto]  [Cancelar]                │
└─────────────────────────────────────┘
```

O bartender/barista vê claramente:
- Qual bebida preparar
- Qual sabor usar
- Em qual quantidade

---

## COMPARAÇÃO: Produto SEM Opções

Para entender melhor, veja a diferença com um produto comum:

### Produto: Chopp (SEM opções)
```
Cardápio → Novo Item:
Nome: Chopp
Categoria: Bebidas
Preço: 8.00
❌ Não marque "Item com Múltiplas Opções"
Criar
```

### Ao Adicionar à Comanda:
```
1. Clique "Adicionar Item"
2. Encontre "Chopp"
3. ✅ Clique em "Adicionar" (normal)
4. Modal abre com:
   - Seleção de comanda
   - Campo de QUANTIDADE (não opções)
   - Digite: 3
5. Clique "Adicionar"
```

### Resultado:
```
ITENS:
- Chopp (X3) ............................ R$ 24,00
```

**Diferença**: Chopp é 1 item com quantidade 3, enquanto Copão de Gin são 3 itens separados (um para cada sabor).

---

## FLUXO VISUAL COMPLETO

```
┌─────────────────────────────────────────────┐
│          CARDÁPIO                           │
│  Criar: Copão de Gin                        │
│  ✅ Item com Múltiplas Opções              │
│  Adicionar opções:                          │
│  • Morango, Uva, Maracujá, Melancia, Pêssego
│  Salvar                                     │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│          COMANDAS                           │
│  Abrir comanda do cliente                   │
│  "Adicionar Item" → Selecionar Opções       │
│  • 2x Morango                               │
│  • 1x Maracujá                              │
│  • 1x Pêssego                               │
│  Confirmar                                  │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│          COZINHA                            │
│  Pedido para João Silva:                    │
│  □ 2x Copão de Gin - Morango                │
│  □ 1x Copão de Gin - Maracujá               │
│  □ 1x Copão de Gin - Pêssego                │
│  [Pronto] [Cancelar]                        │
└─────────────────────────────────────────────┘
```

---

## CASOS DE USO REAIS

### 1️⃣ Loja de Bebidas Alcoólicas
```
Copão de Gin com 5 sabores diferentes
Drink da Casa com 3 combinações
Chopp com variações (puro, com limão, com gengibre)
```

### 2️⃣ Pizzaria
```
Meia Massa com 2 tipos diferentes
Refrigerante com vários sabores
Sorvete com 4 opções de cobertura
```

### 3️⃣ Sorveteria
```
Sorvete com 8 sabores à escolha
Açaí com toppings selecionáveis
Milkshake com opções de frutas
```

### 4️⃣ Restaurante
```
Prato Principal com 3 acompanhamentos à escolha
Sanduíche com 5 molhos diferentes
Café especial com 4 tipos de leite
```

---

## 💡 DICAS

✅ **Boas Práticas**
- Use opções para itens que naturalmente têm variações
- Mantenha o número de opções entre 3-7 (mais fica confuso)
- Nomes de opções devem ser claros e concisos
- Todos os sabores devem estar sempre disponíveis

❌ **Evite**
- Usar para itens simples (chopp comum, água)
- Muito muitas opções (mais de 10)
- Nomes genéricos ("Opção 1", "Opção 2")
- Opções que variam de preço (todas custam R$ 45,00)

---

## 🎯 RESUMO

| Passo | Ação | Onde |
|-------|------|------|
| 1 | Criar produto com opções | Cardápio |
| 2 | Adicionar à comanda com seleção | Comandas |
| 3 | Visualizar para preparação | Cozinha |

**Resultado**: Sistema intuitivo e profissional para gerenciar itens com variações! 🚀

---

*Exemplo prático completo - 20 de março de 2026*
