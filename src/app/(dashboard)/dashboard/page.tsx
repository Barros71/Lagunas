'use client';

import { useDashboardStats } from '@/hooks/useApi';
import { Card } from '@/components/ui/card';
import { Calendar, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/helpers';

export default function DashboardPage() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 border-red-500/50 bg-red-500/10">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-red-400">Erro ao carregar dados do dashboard</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-[#a0a0a0] mt-2">Bem-vindo ao painel administrativo</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Appointments */}
        <Card className="p-6 border-[#2a2a2a] bg-[#151515] hover:border-[#00d4ff]/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#a0a0a0] text-sm">Agendamentos Hoje</p>
              <p className="text-2xl font-bold text-white mt-2">{stats?.total_appointments_today || 0}</p>
            </div>
            <Calendar className="h-8 w-8 text-[#00d4ff]" />
          </div>
        </Card>

        {/* Week's Appointments */}
        <Card className="p-6 border-[#2a2a2a] bg-[#151515] hover:border-[#00d4ff]/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#a0a0a0] text-sm">Agendamentos Semana</p>
              <p className="text-2xl font-bold text-white mt-2">{stats?.total_appointments_week || 0}</p>
            </div>
            <Clock className="h-8 w-8 text-[#ffd700]" />
          </div>
        </Card>

        {/* Month's Revenue */}
        <Card className="p-6 border-[#2a2a2a] bg-[#151515] hover:border-[#00d4ff]/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#a0a0a0] text-sm">Faturamento Mês</p>
              <p className="text-2xl font-bold text-white mt-2">
                {stats?.total_revenue_month ? formatCurrency(stats.total_revenue_month) : 'R$ 0,00'}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-[#ff6b35]" />
          </div>
        </Card>

        {/* Open Tabs */}
        <Card className="p-6 border-[#2a2a2a] bg-[#151515] hover:border-[#00d4ff]/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#a0a0a0] text-sm">Comandas Abertas</p>
              <p className="text-2xl font-bold text-white mt-2">{stats?.open_tabs_count || 0}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-[#ff6b35]" />
          </div>
        </Card>
      </div>

      {/* Upcoming Appointments & Open Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card className="p-6 border-[#2a2a2a] bg-[#151515]">
          <h2 className="text-xl font-bold text-white mb-4">Próximos Agendamentos</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-[#2a2a2a] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : stats?.upcoming_appointments && stats.upcoming_appointments.length > 0 ? (
            <div className="space-y-3">
              {stats.upcoming_appointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="p-3 bg-[#0a0a0a] rounded-lg border border-[#2a2a2a] hover:border-[#00d4ff]/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-white">{appointment.client_name}</p>
                      <p className="text-sm text-[#a0a0a0]">
                        {formatDate(appointment.date)} às {appointment.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-[#00d4ff]">
                        {appointment.tattoo_size}
                      </p>
                      <p className="text-xs text-[#a0a0a0]">{appointment.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#a0a0a0] text-center py-8">Nenhum agendamento próximo</p>
          )}
        </Card>

        {/* Open Tabs */}
        <Card className="p-6 border-[#2a2a2a] bg-[#151515]">
          <h2 className="text-xl font-bold text-white mb-4">Comandas Abertas</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-[#2a2a2a] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : stats?.open_tabs && stats.open_tabs.length > 0 ? (
            <div className="space-y-3">
              {stats.open_tabs.slice(0, 5).map((tab) => (
                <div key={tab.id} className="p-3 bg-[#0a0a0a] rounded-lg border border-[#2a2a2a] hover:border-[#ff6b35]/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-white">{tab.client_name}</p>
                      <p className="text-sm text-[#a0a0a0]">
                        {tab.items?.length || 0} item{tab.items?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">
                        {formatCurrency(tab.total_amount)}
                      </p>
                      <p className="text-xs text-[#a0a0a0]">{tab.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#a0a0a0] text-center py-8">Nenhuma comanda aberta</p>
          )}
        </Card>
      </div>
    </div>
  );
}
