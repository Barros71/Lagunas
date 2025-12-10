"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Search } from 'lucide-react';
import { useMenuItems, useAddTabItem } from '@/hooks/useApi';
import { formatCurrency } from '@/lib/helpers';
import { MENU_CATEGORIES, MENU_CATEGORY_LABELS, MENU_CATEGORY_COLORS } from '@/constants';
import { Badge } from '@/components/ui/badge';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tabId: string;
}

type MenuCategory = typeof MENU_CATEGORIES[keyof typeof MENU_CATEGORIES];

export default function AddMenuToTabModal({ isOpen, onClose, tabId }: Props) {
  const { data: allMenuItems } = useMenuItems();
  const addItem = useAddTabItem();
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'todos'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const filteredItems = (allMenuItems || []).filter(item => {
    const matchesCategory = selectedCategory === 'todos' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAdd = async (product: any) => {
    const qty = quantities[product.id] || 1;
    setLoadingMap((s) => ({ ...s, [product.id]: true }));
    try {
      const unit_price = (product.is_promo && product.promo_price) ? product.promo_price : product.price;
      await addItem.mutateAsync({ tab_id: tabId, product_id: product.id, quantity: qty, unit_price });
      setQuantities((s) => ({ ...s, [product.id]: 1 }));
    } catch (err) {
      console.error('Erro ao adicionar item:', err);
    } finally {
      setLoadingMap((s) => ({ ...s, [product.id]: false }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#151515] border-[#2a2a2a] max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white">Adicionar Itens à Comanda</DialogTitle>
          <DialogDescription className="text-[#a0a0a0]">Selecione itens do cardápio para adicionar</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-4">
          {/* Filtros */}
          <div className="space-y-3 sticky top-0 bg-[#151515] z-10 pb-3">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-[#a0a0a0]" />
              <Input
                placeholder="Buscar itens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-[#a0a0a0]"
              />
            </div>

            {/* Categorias */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('todos')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  selectedCategory === 'todos'
                    ? 'bg-[#ffd700] text-black'
                    : 'bg-[#0a0a0a] border border-[#2a2a2a] text-white hover:border-[#ffd700]/50'
                }`}
              >
                Todos
              </button>
              {Object.entries(MENU_CATEGORY_LABELS).map(([key, label]) => {
                const categoryColor = MENU_CATEGORY_COLORS[key as MenuCategory];
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key as MenuCategory)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      selectedCategory === key
                        ? `${categoryColor} text-white`
                        : 'bg-[#0a0a0a] border border-[#2a2a2a] text-white hover:border-[#ffd700]/50'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Items Grid */}
          {filteredItems && filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((p: any) => {
                const categoryColor = MENU_CATEGORY_COLORS[p.category as MenuCategory];
                return (
                  <Card key={p.id} className="p-4 border-[#2a2a2a] bg-[#0a0a0a] hover:border-[#ff6b35]/50 transition-colors">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-white font-semibold text-sm">{p.name}</p>
                          <Badge className={`${categoryColor} border text-xs mt-1`}>
                            {MENU_CATEGORY_LABELS[p.category]}
                          </Badge>
                        </div>
                        {p.is_promo && (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500 text-xs">PROMO</Badge>
                        )}
                      </div>

                      {/* Preço */}
                      <div className="space-y-1">
                        {p.promo_price && p.is_promo ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[#a0a0a0] line-through text-xs">
                              {formatCurrency(p.price)}
                            </span>
                            <span className="text-green-400 font-bold text-sm">
                              {formatCurrency(p.promo_price)}
                            </span>
                          </div>
                        ) : (
                          <p className="text-white font-semibold text-sm">{formatCurrency(p.price)}</p>
                        )}
                      </div>

                      {/* Quantidade e Botão */}
                      <div className="flex items-center gap-2 pt-2">
                        <Input
                          type="number"
                          min={1}
                          value={quantities[p.id] || 1}
                          onChange={(e) => setQuantities((s) => ({ ...s, [p.id]: Number(e.target.value) }))}
                          className="w-16 bg-[#0a0a0a] border-[#2a2a2a] text-white h-8 text-center"
                        />
                        <Button
                          onClick={() => handleAdd(p)}
                          disabled={loadingMap[p.id]}
                          className="flex-1 bg-[#ff6b35] hover:bg-[#ff6b35]/80 text-white h-8"
                          size="sm"
                        >
                          {loadingMap[p.id] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Adicionar'
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-[#a0a0a0] p-4 text-center">Nenhum item encontrado</p>
          )}
        </div>

        <div className="pt-4 border-t border-[#2a2a2a]">
          <Button variant="outline" onClick={onClose} className="w-full border-[#2a2a2a] hover:bg-[#2a2a2a]">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
