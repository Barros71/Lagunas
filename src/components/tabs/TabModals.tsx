'use client';

import { Tab } from '@/types/api';
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
import { Card } from '@/components/ui/card';
import { Loader2, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/helpers';
import { PAYMENT_METHOD_LABELS } from '@/constants';
import { useState } from 'react';
import { useCreateTab, useRemoveTabItem } from '@/hooks/useApi';
import AddMenuToTabModal from './AddMenuToTabModal';

interface TabDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tab: Tab;
}

interface NewTabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onPay: (method: string) => Promise<void>;
}

export function TabDetailModal({ isOpen, onClose, tab }: TabDetailModalProps) {
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const removeItem = useRemoveTabItem();

  const handleDeleteItem = async (itemId: string) => {
    if (confirm('Tem certeza que deseja deletar este item?')) {
      try {
        await removeItem.mutateAsync({ tab_id: tab.id, item_id: itemId });
      } catch (err) {
        console.error('Erro ao deletar item:', err);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#151515] border-[#2a2a2a]">
        <DialogHeader>
          <DialogTitle className="text-white">Detalhes da Comanda</DialogTitle>
          <DialogDescription className="text-[#a0a0a0]">
            {tab.client_name}
            {tab.table_number && ` - Mesa ${tab.table_number}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Items List */}
          <div className="space-y-2">
            <h3 className="font-semibold text-white">Itens</h3>
            {tab.items && tab.items.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {tab.items.map((item) => (
                  <Card key={item.id} className="p-3 border-[#2a2a2a] bg-[#0a0a0a]">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white text-sm">{item.name}</p>
                        <p className="text-[#a0a0a0] text-xs">
                          {item.quantity}x {formatCurrency(item.price)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                        className="h-8 w-8 p-0 hover:bg-red-500/20 text-red-400 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <p className="text-white font-semibold ml-2">{formatCurrency(item.quantity * item.price)}</p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-[#a0a0a0] text-sm">Nenhum item adicionado</p>
            )}
          </div>

          {/* Total + Actions */}
          <Card className="p-4 border-[#2a2a2a] bg-[#0a0a0a] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#a0a0a0]">Total:</span>
              <span className="text-white font-bold text-xl">{formatCurrency(tab.total_amount)}</span>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={onClose} className="w-full bg-[#00d4ff] hover:bg-[#00d4ff]/80 text-black">
                Fechar
              </Button>
              <Button onClick={() => setShowAddMenuModal(true)} className="w-full bg-[#ff6b35] hover:bg-[#ff6b35]/80 text-white">
                Adicionar Item
              </Button>
            </div>
          </Card>
          {/* Payments */}
          {tab.payments && tab.payments.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Pagamentos</h3>
              <div className="space-y-2">
                {tab.payments.map((p: any) => (
                  <Card key={p.createdAt} className="p-3 border-[#2a2a2a] bg-[#0a0a0a]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm">{p.method_pt ? p.method_pt.charAt(0).toUpperCase() + p.method_pt.slice(1) : p.method}</p>
                        <p className="text-[#a0a0a0] text-xs">{new Date(p.createdAt).toLocaleString()}</p>
                      </div>
                      <p className="text-white font-semibold ml-2">{formatCurrency(p.amount)}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          {showAddMenuModal && (
            <AddMenuToTabModal isOpen={showAddMenuModal} onClose={() => setShowAddMenuModal(false)} tabId={tab.id} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Add modal for adding menu items to this tab
export function TabAddMenuModalWrapper({ isOpen, onClose, tab }: { isOpen: boolean; onClose: () => void; tab: Tab }) {
  return <AddMenuToTabModal isOpen={isOpen} onClose={onClose} tabId={tab.id} />;
}

export function NewTabModal({ isOpen, onClose }: NewTabModalProps) {
  const [form, setForm] = useState({
    client_name: '',
    table_number: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const createTab = useCreateTab();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // call mutation
      await createTab.mutateAsync({
        client_name: form.client_name,
        table_number: form.table_number ? Number(form.table_number) : undefined,
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#151515] border-[#2a2a2a]">
        <DialogHeader>
          <DialogTitle className="text-white">Nova Comanda</DialogTitle>
          <DialogDescription className="text-[#a0a0a0]">Criar uma nova comanda</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Nome do Cliente</Label>
            <Input
              value={form.client_name}
              onChange={(e) => setForm({ ...form, client_name: e.target.value })}
              placeholder="João Silva"
              className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Número da Mesa (opcional)</Label>
            <Input
              type="number"
              value={form.table_number}
              onChange={(e) => setForm({ ...form, table_number: e.target.value })}
              placeholder="5"
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
              disabled={isLoading}
              className="flex-1 bg-[#ff6b35] hover:bg-[#ff6b35]/80 text-white"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Criar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function PaymentModal({
  isOpen,
  onClose,
  totalAmount,
  onPay,
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePay = async () => {
    if (!selectedMethod) return;
    setIsLoading(true);
    try {
      await onPay(selectedMethod);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#151515] border-[#2a2a2a]">
        <DialogHeader>
          <DialogTitle className="text-white">Registrar Pagamento</DialogTitle>
          <DialogDescription className="text-[#a0a0a0]">
            Total: {formatCurrency(totalAmount)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Método de Pagamento</Label>
            <Select value={selectedMethod} onValueChange={setSelectedMethod}>
              <SelectTrigger className="bg-[#0a0a0a] border-[#2a2a2a] text-white">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent className="bg-[#151515] border-[#2a2a2a]">
                {Object.entries(PAYMENT_METHOD_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card className="p-4 border-[#2a2a2a] bg-[#0a0a0a]">
            <div className="flex items-center justify-between">
              <span className="text-[#a0a0a0]">Valor a pagar:</span>
              <span className="text-white font-bold text-xl">{formatCurrency(totalAmount)}</span>
            </div>
          </Card>

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
              onClick={handlePay}
              disabled={!selectedMethod || isLoading}
              className="flex-1 bg-[#ffd700] hover:bg-[#ffd700]/80 text-black"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirmar Pagamento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
