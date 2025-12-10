'use client';

import { Tab } from '@/types/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, DollarSign, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/helpers';

interface TabCardProps {
  tab: Tab;
  onView: () => void;
  onClose?: () => void;
  onPay?: () => void;
  onDelete?: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  aberta: 'bg-green-500/20 text-green-400 border-green-500',
  fechada: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
  paga: 'bg-cyan-500/20 text-cyan-400 border-cyan-500',
};

const STATUS_LABELS: Record<string, string> = {
  aberta: 'Aberta',
  fechada: 'Fechada',
  paga: 'Paga',
};

export default function TabCard({
  tab,
  onView,
  onClose,
  onPay,
  onDelete,
}: TabCardProps) {
  return (
    <Card className="p-4 border-[#2a2a2a] bg-[#151515] hover:border-[#ff6b35]/50 transition-colors">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="font-semibold text-white text-lg">{tab.client_name}</p>
            {tab.table_number && (
              <p className="text-sm text-[#a0a0a0]">Mesa {tab.table_number}</p>
            )}
          </div>
          <Badge className={`${STATUS_COLORS[tab.status]} border text-xs`}>
            {STATUS_LABELS[tab.status]}
          </Badge>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#a0a0a0]">Itens:</span>
            <span className="text-white font-medium">{tab.items?.length || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#a0a0a0]">Total:</span>
            <span className="text-white font-bold text-lg">{formatCurrency(tab.total_amount)}</span>
          </div>
          {tab.status === 'paga' && tab.payment_method && (
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-[#a0a0a0]">Pago via:</span>
              <span className="text-white font-medium capitalize">{tab.payment_method}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={onView}
            variant="outline"
            size="sm"
            className="flex-1 border-[#2a2a2a] hover:bg-[#2a2a2a]"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver
          </Button>
          {tab.status === 'aberta' && onClose && (
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="flex-1 border-[#2a2a2a] hover:bg-[#2a2a2a]"
            >
              Fechar
            </Button>
          )}
          {tab.status === 'fechada' && onPay && (
            <Button
              onClick={onPay}
              size="sm"
              className="flex-1 bg-[#ff6b35] hover:bg-[#ff6b35]/80 text-white"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Pagar
            </Button>
          )}
          {tab.status === 'paga' && onDelete && (
            <Button
              onClick={onDelete}
              size="sm"
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Deletar
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
