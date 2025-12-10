"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useTabs, useAddTabItem, useCreateTab } from '@/hooks/useApi';
import { Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

export default function AddToTabModal({ isOpen, onClose, product }: Props) {
  const [selectedTab, setSelectedTab] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [creating, setCreating] = useState(false);
  const [clientName, setClientName] = useState('');
  const tabsQuery = useTabs('aberta');
  const addItem = useAddTabItem();
  const createTab = useCreateTab();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      let tabId = selectedTab;
      if (creating) {
        const created = await createTab.mutateAsync({ client_name: clientName || 'Cliente' });
        tabId = created.id;
      }

      const unit_price = (product.is_promo && product.promo_price) ? product.promo_price : product.price;

      await addItem.mutateAsync({ tab_id: tabId, product_id: product.id, quantity, unit_price });
      onClose();
    } catch (err) {
      console.error('Erro ao adicionar item:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#151515] border-[#2a2a2a]">
        <DialogHeader>
          <DialogTitle className="text-white">Adicionar à Comanda</DialogTitle>
          <DialogDescription className="text-[#a0a0a0]">{product.name}</DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Selecione a comanda</Label>
            <Select value={selectedTab} onValueChange={(v) => { if (v === '__new__') { setCreating(true); setSelectedTab(''); } else { setCreating(false); setSelectedTab(v); } }}>
              <SelectTrigger className="bg-[#0a0a0a] border-[#2a2a2a] text-white">
                <SelectValue placeholder="Escolha uma comanda" />
              </SelectTrigger>
              <SelectContent className="bg-[#151515] border-[#2a2a2a]">
                {tabsQuery.data && tabsQuery.data.length > 0 ? (
                  tabsQuery.data.map((t: any) => (
                    <SelectItem key={t.id} value={t.id}>{`${t.client_name || 'Cliente'} - ${t.id.slice(0,6)}`}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="">Nenhuma comanda aberta</SelectItem>
                )}
                <SelectItem value="__new__">Criar nova comanda</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {creating && (
            <div className="space-y-2">
              <Label className="text-white">Nome do Cliente</Label>
              <Input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Nome do cliente"
                className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-white">Quantidade</Label>
            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-[#2a2a2a] hover:bg-[#2a2a2a]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || (!selectedTab && !creating)}
              className="flex-1 bg-[#ff6b35] hover:bg-[#ff6b35]/80 text-white"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Adicionar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
