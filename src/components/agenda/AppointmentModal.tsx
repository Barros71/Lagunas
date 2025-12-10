'use client';

import { useState, useEffect } from 'react';
import { useCreateAppointment, useUpdateAppointment, useAppointment } from '@/hooks/useApi';
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
import { Textarea } from '@/components/ui/textarea';
import { APPOINTMENT_STATUS, TATTOO_SIZES, APPOINTMENT_STATUS_LABELS, TATTOO_SIZE_LABELS } from '@/constants';
import { Loader2 } from 'lucide-react';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingId: string | null;
}

interface FormData {
  client_name: string;
  client_phone: string;
  date: string;
  time: string;
  duration: number;
  tattoo_description: string;
  tattoo_size: string;
  price_estimate: number;
  status: string;
  notes: string;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  editingId,
}: AppointmentModalProps) {
  const [form, setForm] = useState<FormData>({
    client_name: '',
    client_phone: '',
    date: '',
    time: '',
    duration: 60,
    tattoo_description: '',
    tattoo_size: 'media',
    price_estimate: 0,
    status: 'agendado',
    notes: '',
  });

  const { data: existingAppointment, isLoading: isLoadingEdit } = useAppointment(editingId || '');
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();

  useEffect(() => {
    if (editingId && existingAppointment) {
      setForm({
        client_name: existingAppointment.client_name,
        client_phone: existingAppointment.client_phone,
        date: existingAppointment.date,
        time: existingAppointment.time,
        duration: existingAppointment.duration,
        tattoo_description: existingAppointment.tattoo_description,
        tattoo_size: existingAppointment.tattoo_size,
        price_estimate: existingAppointment.price_estimate,
        status: existingAppointment.status,
        notes: existingAppointment.notes || '',
      });
    } else {
      setForm({
        client_name: '',
        client_phone: '',
        date: new Date().toISOString().split('T')[0],
        time: '14:00',
        duration: 60,
        tattoo_description: '',
        tattoo_size: 'media',
        price_estimate: 0,
        status: 'agendado',
        notes: '',
      });
    }
  }, [editingId, existingAppointment, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateAppointment.mutateAsync({
          id: editingId,
          client_name: form.client_name,
          client_phone: form.client_phone,
          date: form.date,
          time: form.time,
          duration: form.duration,
          tattoo_description: form.tattoo_description,
          tattoo_size: form.tattoo_size as any,
          price_estimate: form.price_estimate,
          status: form.status as any,
          notes: form.notes,
        });
      } else {
        await createAppointment.mutateAsync({
          client_name: form.client_name,
          client_phone: form.client_phone,
          date: form.date,
          time: form.time,
          duration: form.duration,
          tattoo_description: form.tattoo_description,
          tattoo_size: form.tattoo_size as any,
          price_estimate: form.price_estimate,
          status: form.status as any,
          notes: form.notes,
        });
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
    }
  };

  const isLoading = createAppointment.isPending || updateAppointment.isPending || isLoadingEdit;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#151515] border-[#2a2a2a]">
        <DialogHeader>
          <DialogTitle className="text-white">
            {editingId ? 'Editar Agendamento' : 'Novo Agendamento'}
          </DialogTitle>
          <DialogDescription className="text-[#a0a0a0]">
            Preencha os dados do agendamento
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Client Info */}
          <div className="grid grid-cols-2 gap-4">
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
              <Label className="text-white">Telefone</Label>
              <Input
                value={form.client_phone}
                onChange={(e) => setForm({ ...form, client_phone: e.target.value })}
                placeholder="(11) 99999-9999"
                className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
                required
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Data</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Horário</Label>
              <Input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
                required
              />
            </div>
          </div>

          {/* Tattoo Info */}
          <div className="space-y-2">
            <Label className="text-white">Descrição da Tatuagem</Label>
            <Textarea
              value={form.tattoo_description}
              onChange={(e) => setForm({ ...form, tattoo_description: e.target.value })}
              placeholder="Descreva a tatuagem..."
              className="bg-[#0a0a0a] border-[#2a2a2a] text-white min-h-20"
              required
            />
          </div>

          {/* Tattoo Size & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Tamanho</Label>
              <Select value={form.tattoo_size} onValueChange={(value) => setForm({ ...form, tattoo_size: value })}>
                <SelectTrigger className="bg-[#0a0a0a] border-[#2a2a2a] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#151515] border-[#2a2a2a]">
                  {Object.entries(TATTOO_SIZE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Duração (min)</Label>
              <Input
                type="number"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
                min="15"
                step="15"
                required
              />
            </div>
          </div>

          {/* Price & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Valor Estimado</Label>
              <Input
                type="number"
                value={form.price_estimate}
                onChange={(e) => setForm({ ...form, price_estimate: Number(e.target.value) })}
                className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Status</Label>
              <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}>
                <SelectTrigger className="bg-[#0a0a0a] border-[#2a2a2a] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#151515] border-[#2a2a2a]">
                  {Object.entries(APPOINTMENT_STATUS_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-white">Observações</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Anotações adicionais..."
              className="bg-[#0a0a0a] border-[#2a2a2a] text-white min-h-16"
            />
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
              className="flex-1 bg-[#00d4ff] hover:bg-[#00d4ff]/80 text-black"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingId ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
