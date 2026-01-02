'use client';

import { Appointment, AppointmentStatus } from '@/types/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2, Phone, Clock } from 'lucide-react';
import { formatTime, formatCurrency } from '@/lib/helpers';

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: () => void;
  onDelete: () => void;
}

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  agendado: 'bg-blue-500/20 text-blue-400 border-blue-500',
  confirmado: 'bg-green-500/20 text-green-400 border-green-500',
  em_andamento: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
  concluido: 'bg-cyan-500/20 text-cyan-400 border-cyan-500',
  cancelado: 'bg-red-500/20 text-red-400 border-red-500',
};

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  agendado: 'Agendado',
  confirmado: 'Confirmado',
  em_andamento: 'Em Andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

export default function AppointmentCard({
  appointment,
  onEdit,
  onDelete,
}: AppointmentCardProps) {
  return (
    <Card className="p-4 border-[#2a2a2a] bg-[#151515] hover:border-[#00d4ff]/50 transition-colors">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-white text-lg break-words">{appointment.client_name}</p>
            <p className="text-sm text-[#a0a0a0] break-words">{appointment.tattoo_description}</p>
          </div>
          <Badge className={`${STATUS_COLORS[appointment.status]} border text-xs`}>
            {STATUS_LABELS[appointment.status]}
          </Badge>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-[#a0a0a0]">
            <Clock className="h-4 w-4" />
            <span>{formatTime(appointment.time)} ({appointment.duration}min)</span>
          </div>
          <div className="flex items-center gap-2 text-[#a0a0a0]">
            <Phone className="h-4 w-4" />
            <span>{appointment.client_phone}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#a0a0a0]">Tamanho:</span>
            <span className="text-white font-medium capitalize">{appointment.tattoo_size}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#a0a0a0]">Estimativa:</span>
            <span className="text-white font-medium">{formatCurrency(appointment.price_estimate)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={onEdit}
            variant="outline"
            size="sm"
            className="flex-1 border-[#2a2a2a] hover:bg-[#2a2a2a]"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            onClick={onDelete}
            variant="outline"
            size="sm"
            className="flex-1 border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Deletar
          </Button>
        </div>
      </div>
    </Card>
  );
}
