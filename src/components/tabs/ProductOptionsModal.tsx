"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useTabs, useAddTabItem, useCreateTab } from '@/hooks/useApi';
import { Loader2, Plus, Minus } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

interface SelectedOption {
  id: string;
  name: string;
  quantity: number;
}

export default function ProductOptionsModal({ isOpen, onClose, product }: Props) {
  const [selectedTab, setSelectedTab] = useState<string>('');
  const [creating, setCreating] = useState(false);
  const [clientName, setClientName] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const tabsQuery = useTabs('aberta');
  const addItem = useAddTabItem();
  const createTab = useCreateTab();

  const handleAddOption = (option: any) => {
    const existing = selectedOptions.find(o => o.id === option.id);
    if (existing) {
      setSelectedOptions(selectedOptions.map(o => 
        o.id === option.id ? { ...o, quantity: o.quantity + 1 } : o
      ));
    } else {
      setSelectedOptions([...selectedOptions, { id: option.id, name: option.name, quantity: 1 }]);
    }
  };

  const handleRemoveOption = (optionId: string) => {
    setSelectedOptions(selectedOptions.filter(o => o.id !== optionId));
  };

  const handleIncreaseQuantity = (optionId: string) => {
    setSelectedOptions(selectedOptions.map(o => 
      o.id === optionId ? { ...o, quantity: o.quantity + 1 } : o
    ));
  };

  const handleDecreaseQuantity = (optionId: string) => {
    setSelectedOptions(selectedOptions.map(o => 
      o.id === optionId ? { ...o, quantity: Math.max(1, o.quantity - 1) } : o
    ));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (selectedOptions.length === 0) {
      alert('Selecione pelo menos uma opção');
      return;
    }

    setIsLoading(true);
    try {
      let tabId = selectedTab;
      if (creating) {
        const created = await createTab.mutateAsync({ client_name: clientName || 'Cliente' });
        tabId = created.id;
      }

      const unit_price = (product.is_promo && product.promo_price) ? product.promo_price : product.price;

      // Add each selected option as a separate item with its quantity
      for (const option of selectedOptions) {
        const itemName = `${product.name} - ${option.name}`;
        await addItem.mutateAsync({ 
          tab_id: tabId, 
          product_id: product.id, 
          quantity: option.quantity, 
          unit_price,
          option_name: option.name 
        });
      }

      onClose();
    } catch (err) {
      console.error('Erro ao adicionar item:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#151515] border-[#2a2a2a] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Selecione as Opções</DialogTitle>
          <DialogDescription className="text-[#a0a0a0]">{product.name}</DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
          {/* Select Tab */}
          <div className="space-y-2">
            <Label className="text-white text-sm">Selecione a comanda</Label>
            <Select value={selectedTab} onValueChange={(v) => { if (v === '__new__') { setCreating(true); setSelectedTab(''); } else { setCreating(false); setSelectedTab(v); } }}>
              <SelectTrigger className="bg-[#0a0a0a] border-[#2a2a2a] text-white h-9">
                <SelectValue placeholder="Escolha uma comanda" />
              </SelectTrigger>
              <SelectContent className="bg-[#151515] border-[#2a2a2a]">
                {tabsQuery.data && tabsQuery.data.length > 0 ? (
                  tabsQuery.data.map((t: any) => (
                    <SelectItem key={t.id} value={t.id}>{`${t.client_name || 'Cliente'} - ${t.id.slice(0,6)}`}</SelectItem>
                  ))
                ) : null}
                <SelectItem value="__new__">Criar nova comanda</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {creating && (
            <div className="space-y-2">
              <Label className="text-white text-sm">Nome do Cliente</Label>
              <Input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Nome do cliente"
                className="bg-[#0a0a0a] border-[#2a2a2a] text-white h-9"
              />
            </div>
          )}

          {/* Options Selection */}
          <div className="space-y-2">
            <Label className="text-white text-sm">Opções Disponíveis</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {product.options && product.options.length > 0 ? (
                product.options.map((option: any) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleAddOption(option)}
                    className="w-full text-left px-3 py-2 rounded bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white transition-colors"
                  >
                    {option.name}
                  </button>
                ))
              ) : (
                <p className="text-[#a0a0a0] text-sm">Nenhuma opção disponível</p>
              )}
            </div>
          </div>

          {/* Selected Options */}
          {selectedOptions.length > 0 && (
            <div className="space-y-2 border-t border-[#2a2a2a] pt-4">
              <Label className="text-white text-sm">Selecionadas ({selectedOptions.length})</Label>
              <div className="space-y-2">
                {selectedOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center justify-between bg-[#2a2a2a] px-3 py-2 rounded"
                  >
                    <span className="text-white text-sm flex-1">{option.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDecreaseQuantity(option.id)}
                        className="p-1 hover:bg-[#1a1a1a] rounded"
                      >
                        <Minus className="h-3 w-3 text-[#a0a0a0]" />
                      </button>
                      <span className="text-white text-sm w-6 text-center">{option.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleIncreaseQuantity(option.id)}
                        className="p-1 hover:bg-[#1a1a1a] rounded"
                      >
                        <Plus className="h-3 w-3 text-[#a0a0a0]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(option.id)}
                        className="text-[#ff6b6b] hover:text-[#ff5252] font-bold text-lg ml-2"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-[#2a2a2a] hover:bg-[#2a2a2a] h-9"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || (!selectedTab && !creating) || selectedOptions.length === 0}
              className="flex-1 bg-[#ff6b35] hover:bg-[#ff6b35]/80 text-white h-9"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Adicionar ({selectedOptions.reduce((acc, o) => acc + o.quantity, 0)})
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
