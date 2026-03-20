# Guia de Teste - Sistema de Opções de Produtos

## Resumo das Mudanças Implementadas

Este documento descreve as novas funcionalidades implementadas para adicionar opções/sabores a itens do cardápio.

### 1. **Banco de Dados**
- Adicionadas tabelas:
  - `ProductOption`: Armazena as opções disponíveis para cada produto
  - `TabItemOption`: Rastreia quantidades de cada opção selecionada para um item
- Campo adicionado ao `Product`:
  - `hasOptions`: boolean para indicar se produto tem opções

### 2. **Cardápio (Menu)**
- Na aba "Cardápio", ao criar/editar um item:
  - ✅ Novo checkbox: "Item com Múltiplas Opções"
  - ✅ Quando marcado, aparece uma seção para adicionar opções (ex: Morango, Uva, Maracujá)
  - ✅ Você pode adicionar/remover opções dinamicamente
  - ✅ No card do item, mostra um badge "Opções" com lista das opções disponíveis

### 3. **Comandas (Tabs) - Adição de Itens**
- Na aba "Comandas", ao adicionar itens:
  - **Para itens SEM opções**: 
    - Comportamento normal: entrada de quantidade + botão "Adicionar"
  - **Para itens COM opções**: 
    - Botão "Selecionar Opções" abre modal com:
      - Seleção de comanda (novo ou existente)
      - Lista de opções disponíveis
      - Para cada opção, adiciona quantidade (+ / -)
      - Mostra total de itens selecionados
      - Botão final com quantidade total: "Adicionar (X)"

### 4. **Cozinha (Kitchen)**
- Os itens com opções aparecem como:
  - Exemplo: "2 Gin - Maracujá, 1 Gin - Melancia"
  - Campo `details` na `KitchenOrder` armazena informações das opções

## Passos de Teste

### Teste 1: Criar um produto com opções
1. Vá para "Cardápio"
2. Clique em "Novo Item"
3. Preencha:
   - Nome: "Copão de Gin"
   - Categoria: "Bebidas"
   - Preço: 45.00
4. ✅ Marque "Item com Múltiplas Opções"
5. Adicione opções:
   - "Morango"
   - "Uva"
   - "Maracujá"
   - "Melancia"
6. Clique "Criar"
7. ✅ Verifique se o card mostra badge "Opções" com a lista

### Teste 2: Adicionar item com opções à comanda
1. Vá para "Comandas"
2. Abra uma comanda ou crie uma nova
3. Clique "Adicionar Item"
4. Procure "Copão de Gin"
5. ✅ Clique em "Selecionar Opções" (não "Adicionar")
6. No modal:
   - Selecione a comanda
   - Clique em "Morango" (quantidade fica 1)
   - Clique em "Morango" novamente (quantidade vai para 2)
   - Clique em "Maracujá" (adiciona uma nova opção)
   - Ajuste quantidades conforme necessário
   - ✅ Botão mostra "Adicionar (3)" ou a quantidade total
7. Clique "Adicionar"
8. ✅ Os itens aparecem na comanda como:
   - "Copão de Gin - Morango" (quantidade 2)
   - "Copão de Gin - Maracujá" (quantidade 1)

### Teste 3: Verificar na cozinha
1. Vá para "Cozinha"
2. ✅ Verifique se os itens aparecem com as opções no nome
3. ✅ O campo `details` deve mostrar "2x morango, 1x maracujá"

### Teste 4: Item normal (sem opções)
1. Crie um produto SEM marcar "Item com Múltiplas Opções"
2. Ao adicionar à comanda:
   - ✅ Comportamento normal com campo de quantidade
   - ✅ Não abre modal de opções

### Teste 5: Editar produto com opções
1. No cardápio, clique "Editar" em um produto com opções
2. ✅ Aparecem as opções cadastradas
3. Adicione uma nova opção
4. Remove uma opção
5. ✅ Salve e verifique as mudanças

## Notas Importantes

- ⚠️ **Banco de dados não foi deletado**: Os dados de clientes existentes foram preservados
- ⚠️ **Backward compatible**: Produtos antigos (sem hasOptions) continuam funcionando normalmente
- ⚠️ **Migration criada**: `20260320190313_add_product_options` foi aplicada com sucesso

## Troubleshooting

Se algo não funcionar:

1. **Erro 404 ao salvar produto com opções**:
   - Verifique se o endpoint POST `/api/menu-items` está recebendo `hasOptions` e `options` corretamente
   - Confirme no DevTools (Network tab)

2. **Opções não aparecem no card**:
   - Verifique se `options` está sendo retornado do GET `/api/menu-items`
   - Confirme no DevTools Console

3. **Modal de opções não abre**:
   - Verifique se `product.hasOptions` é `true`
   - Confirme se `ProductOptionsModal` está importado corretamente

## Próximas Melhorias (Opcional)

- [ ] Adicionar ícone visual para produtos com opções no grid
- [ ] Permitir definir opções por faixa de preço
- [ ] Histórico de opções mais populares
- [ ] Estatísticas de vendas por opção
