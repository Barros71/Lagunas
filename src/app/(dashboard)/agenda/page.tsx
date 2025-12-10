'use client';

import { useState } from 'react';
import { useAppointments, useDeleteAppointment } from '@/hooks/useApi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppointmentModal from '@/components/agenda/AppointmentModal';
import AppointmentCard from '@/components/agenda/AppointmentCard';
import { Plus, AlertCircle, Trash2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate, formatTime, formatLocalDate } from '@/lib/helpers';
import { addDays, startOfWeek, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function AgendaPage() {
  const [selectedDateStr, setSelectedDateStr] = useState(getTodayString());
  const [weekStartDateStr, setWeekStartDateStr] = useState(getTodayString());
  const selectedDate = new Date(parseInt(selectedDateStr.split('-')[0]), parseInt(selectedDateStr.split('-')[1]) - 1, parseInt(selectedDateStr.split('-')[2]));
  const weekStartDate = new Date(parseInt(weekStartDateStr.split('-')[0]), parseInt(weekStartDateStr.split('-')[1]) - 1, parseInt(weekStartDateStr.split('-')[2]));
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: appointments, isLoading, error } = useAppointments(selectedDateStr);
  const { data: allAppointments, isLoading: isLoadingAll } = useAppointments();
  const deleteAppointment = useDeleteAppointment();

  const weekStart = startOfWeek(weekStartDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handlePreviousWeek = () => {
    const prevWeekDate = addDays(weekStartDate, -7);
    const year = prevWeekDate.getFullYear();
    const month = String(prevWeekDate.getMonth() + 1).padStart(2, '0');
    const day = String(prevWeekDate.getDate()).padStart(2, '0');
    setWeekStartDateStr(`${year}-${month}-${day}`);
  };

  const handleNextWeek = () => {
    const nextWeekDate = addDays(weekStartDate, 7);
    const year = nextWeekDate.getFullYear();
    const month = String(nextWeekDate.getMonth() + 1).padStart(2, '0');
    const day = String(nextWeekDate.getDate()).padStart(2, '0');
    setWeekStartDateStr(`${year}-${month}-${day}`);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este agendamento?')) {
      await deleteAppointment.mutateAsync(id);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 border-red-500/50 bg-red-500/10">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-red-400">Erro ao carregar agendamentos</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Agenda</h1>
          <p className="text-[#a0a0a0] mt-2">Gerencie agendamentos de tatuagens</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setSelectedDateStr(getTodayString())}
            variant="outline"
            className="border-[#2a2a2a] hover:bg-[#2a2a2a]"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Hoje
          </Button>
          <Button
            onClick={() => {
              setEditingId(null);
              setShowModal(true);
            }}
            className="bg-[#00d4ff] hover:bg-[#00d4ff]/80 text-black"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Week Calendar */}
      <Card className="p-4 border-[#2a2a2a] bg-[#151515]">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={handlePreviousWeek}
            variant="outline"
            size="sm"
            className="border-[#2a2a2a] hover:bg-[#2a2a2a]"
          >
            <ChevronLeft className="h-4 w-4" />
            Semana Anterior
          </Button>
          <Button
            onClick={() => setWeekStartDateStr(getTodayString())}
            variant="outline"
            size="sm"
            className="border-[#2a2a2a] hover:bg-[#2a2a2a]"
          >
            Esta Semana
          </Button>
          <Button
            onClick={handleNextWeek}
            variant="outline"
            size="sm"
            className="border-[#2a2a2a] hover:bg-[#2a2a2a]"
          >
            Próxima Semana
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDateStr(format(day, 'yyyy-MM-dd'))}
              className={`p-3 rounded-lg text-center transition-colors ${
                format(day, 'yyyy-MM-dd') === selectedDateStr
                  ? 'bg-[#00d4ff]/20 border border-[#00d4ff]'
                  : 'border border-[#2a2a2a] hover:border-[#00d4ff]/50'
              }`}
            >
              <p className="text-sm text-[#a0a0a0]">
                {format(day, 'EEE', { locale: ptBR })}
              </p>
              <p className="text-lg font-bold text-white">
                {format(day, 'd')}
              </p>
            </button>
          ))}
        </div>
      </Card>

      {/* Appointments List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">
          Agendamentos de {formatLocalDate(selectedDateStr)}
        </h2>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-[#2a2a2a] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : appointments && appointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onEdit={() => handleEdit(appointment.id)}
                onDelete={() => handleDelete(appointment.id)}
              />
            ))}
          </div>
        ) : (
          <Card className="p-6 border-[#2a2a2a] bg-[#151515]">
            <p className="text-[#a0a0a0] text-center">Nenhum agendamento para esta data</p>
          </Card>
        )}
      </div>

      {/* Simple list of all appointments */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Todos os Agendamentos (lista simples)</h2>
        {isLoadingAll ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-[#2a2a2a] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : allAppointments && allAppointments.length > 0 ? (
          <Card className="p-4 border-[#2a2a2a] bg-[#151515]">
            <ul className="space-y-2">
              {allAppointments.map((a) => (
                <li key={a.id}>
                  <div className="flex items-center gap-2">
                    <div
                      role="button"
                      onClick={() => {
                        setEditingId(a.id);
                        setShowModal(true);
                      }}
                      className="flex-1 text-left p-3 rounded-lg hover:bg-[#2a2a2a] flex items-center justify-between"
                    >
                      <div>
                        <p className="text-white font-medium">{a.client_name || 'Sem nome'}</p>
                        <p className="text-sm text-[#a0a0a0]">Agendado em: {formatLocalDate(a.date.split('T')[0])}</p>
                      </div>
                      <div className="text-sm text-[#a0a0a0]">{a.time}</div>
                    </div>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (confirm('Tem certeza que deseja deletar este agendamento?')) {
                          try {
                            await deleteAppointment.mutateAsync(a.id);
                          } catch (err) {
                            console.error('Erro ao deletar:', err);
                          }
                        }
                      }}
                      title="Deletar"
                      className="ml-2 p-2 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <Card className="p-4 border-[#2a2a2a] bg-[#151515]">
            <p className="text-[#a0a0a0]">Nenhum agendamento registrado</p>
          </Card>
        )}
      </div>

      {/* Modal */}
      <AppointmentModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingId(null);
        }}
        editingId={editingId}
      />
    </div>
  );
}
