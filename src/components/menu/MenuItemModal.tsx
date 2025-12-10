'use client';

import { useState, useEffect } from 'react';
import { useCreateMenuItem, useUpdateMenuItem } from '@/hooks/useApi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { MENU_CATEGORIES, MENU_CATEGORY_LABELS } from '@/constants';

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: any | null;
}

interface FormData {
  name: string;
  category: string;
  price: number;
  promo_price: number | null;
  is_promo: boolean;
  available: boolean;
}

export default function MenuItemModal({
  isOpen,
  onClose,
  editingItem,
}: MenuItemModalProps) {
  const [form, setForm] = useState<FormData>({
    name: '',
    category: 'bebidas',
    price: 0,
    promo_price: null,
    is_promo: false,
    available: true,
  });

  const createMenuItem = useCreateMenuItem();
  const updateMenuItem = useUpdateMenuItem();

  useEffect(() => {
    if (!isOpen) return;

    if (editingItem) {
      // Prefill all available fields from the provided item, keep defaults for missing keys
      setForm((prev) => ({
        ...prev,
        name: editingItem.name ?? prev.name,
        category: editingItem.category ?? prev.category,
        price: editingItem.price != null ? Number(editingItem.price) : prev.price,
        promo_price: editingItem.promo_price != null ? Number(editingItem.promo_price) : prev.promo_price,
        is_promo: editingItem.is_promo ?? prev.is_promo,
        available: editingItem.available ?? prev.available,
      }));
    } else {
      setForm({
        name: '',
        category: 'bebidas',
        price: 0,
        promo_price: null,
        is_promo: false,
        available: true,
      });
    }
  }, [editingItem, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData = {
        ...form,
        price: Number(form.price),
        promo_price: form.promo_price ? Number(form.promo_price) : undefined,
      };

      if (editingItem) {
        await updateMenuItem.mutateAsync({
          id: editingItem.id,
          ...submitData,
        } as any);
      } else {
        await createMenuItem.mutateAsync(submitData as any);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar item:', error);
    }
  };

  const isLoading = createMenuItem.isPending || updateMenuItem.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#151515] border-[#2a2a2a]">
        <DialogHeader>
          <DialogTitle className="text-white">
            {editingItem ? 'Editar Item' : 'Novo Item de Menu'}
          </DialogTitle>
          <DialogDescription className="text-[#a0a0a0]">
            Preencha os dados do item do menu
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label className="text-white">Nome do Item</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Cerveja Brahma 600ml"
              className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
              required
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Categoria</Label>
              <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                <SelectTrigger className="bg-[#0a0a0a] border-[#2a2a2a] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#151515] border-[#2a2a2a]">
                  {Object.entries(MENU_CATEGORY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Preço (R$)</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Promo Price */}
          <div className="space-y-2">
            <Label className="text-white">Preço Promocional (opcional)</Label>
            <Input
              type="number"
              value={form.promo_price || ''}
              onChange={(e) => setForm({ ...form, promo_price: e.target.value ? Number(e.target.value) : null })}
              placeholder="0.00"
              className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
              min="0"
              step="0.01"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-white">Em Promoção</Label>
              <input
                type="checkbox"
                checked={form.is_promo}
                onChange={(e) => setForm({ ...form, is_promo: e.target.checked })}
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-white">Disponível</Label>
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm({ ...form, available: e.target.checked })}
                className="h-4 w-4"
              />
            </div>
          </div>

          {/* Actions */}
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
              disabled={isLoading}
              className="flex-1 bg-[#ffd700] hover:bg-[#ffd700]/80 text-black"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingItem ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
