'use client';

import { useState } from 'react';
import { useTabs, useUpdateTabStatus, usePayTab, useDeleteTab } from '@/hooks/useApi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TabCard from '@/components/tabs/TabCard';
import { TabDetailModal, NewTabModal, PaymentModal } from '@/components/tabs/TabModals';
import { Plus, AlertCircle, Trash2 } from 'lucide-react';

type TabStatus = 'aberta' | 'fechada' | 'paga';

export default function ComandasPage() {
  const [showNewTabModal, setShowNewTabModal] = useState(false);
  const [selectedTabId, setSelectedTabId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('abertas');

  const { data: allTabs, isLoading, error } = useTabs();
  const updateStatus = useUpdateTabStatus();
  const payTab = usePayTab();
  const deleteTab = useDeleteTab();

  const abertas = allTabs?.filter(t => t.status === 'aberta') || [];
  const fechadas = allTabs?.filter(t => t.status === 'fechada') || [];
  const pagas = allTabs?.filter(t => t.status === 'paga') || [];

  const selectedTab = selectedTabId ? allTabs?.find(t => t.id === selectedTabId) : null;

  const handleCloseTab = async (id: string) => {
    await updateStatus.mutateAsync({ id, status: 'fechada' });
  };

  const handlePayTab = async (paymentMethod: string) => {
    if (selectedTabId) {
      try {
        const updated = await payTab.mutateAsync({ id: selectedTabId, payment_method: paymentMethod });
        // after successful payment, switch to 'pagas' and show the paid tab details
        setShowPaymentModal(false);
        setActiveTab('pagas');
        setSelectedTabId(updated?.id ?? selectedTabId);
        setShowDetailModal(true);
      } catch (err) {
        console.error('Erro ao processar pagamento:', err);
      }
    }
  };

  const handleDeleteTab = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta comanda?')) {
      try {
        await deleteTab.mutateAsync(id);
      } catch (err) {
        console.error('Erro ao deletar comanda:', err);
      }
    }
  };

  const handleDeleteAllPaid = async () => {
    if (confirm('Tem certeza que deseja deletar TODAS as comandas pagas? Esta ação não pode ser desfeita!')) {
      try {
        for (const tab of pagas) {
          await deleteTab.mutateAsync(tab.id);
        }
      } catch (err) {
        console.error('Erro ao deletar comandas pagas:', err);
      }
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 border-red-500/50 bg-red-500/10">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-red-400">Erro ao carregar comandas</p>
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
          <h1 className="text-3xl font-bold text-white">Comandas</h1>
          <p className="text-[#a0a0a0] mt-2">Gerencie as aberturas de consumo</p>
        </div>
        <Button
          onClick={() => setShowNewTabModal(true)}
          className="bg-[#ff6b35] hover:bg-[#ff6b35]/80 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Comanda
        </Button>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)} className="w-full">
        <TabsList className="bg-[#151515] border-b border-[#2a2a2a]">
          <TabsTrigger value="abertas" className="data-[state=active]:bg-[#ff6b35] data-[state=active]:text-black">
            Abertas ({abertas.length})
          </TabsTrigger>
          <TabsTrigger value="fechadas" className="data-[state=active]:bg-[#ffd700] data-[state=active]:text-black">
            Fechadas ({fechadas.length})
          </TabsTrigger>
          <TabsTrigger value="pagas" className="data-[state=active]:bg-[#00d4ff] data-[state=active]:text-black">
            Pagas ({pagas.length})
          </TabsTrigger>
        </TabsList>

        {/* Abertas Tab */}
        <TabsContent value="abertas" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-[#2a2a2a] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : abertas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {abertas.map((tab) => (
                <TabCard
                  key={tab.id}
                  tab={tab}
                  onView={() => {
                    setSelectedTabId(tab.id);
                    setShowDetailModal(true);
                  }}
                  onClose={() => handleCloseTab(tab.id)}
                />
              ))}
            </div>
          ) : (
            <Card className="p-6 border-[#2a2a2a] bg-[#151515]">
              <p className="text-[#a0a0a0] text-center">Nenhuma comanda aberta</p>
            </Card>
          )}
        </TabsContent>

        {/* Fechadas Tab */}
        <TabsContent value="fechadas" className="space-y-4">
          {fechadas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fechadas.map((tab) => (
                <TabCard
                  key={tab.id}
                  tab={tab}
                  onView={() => {
                    setSelectedTabId(tab.id);
                    setShowDetailModal(true);
                  }}
                  onPay={() => {
                    setSelectedTabId(tab.id);
                    setShowPaymentModal(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <Card className="p-6 border-[#2a2a2a] bg-[#151515]">
              <p className="text-[#a0a0a0] text-center">Nenhuma comanda fechada</p>
            </Card>
          )}
        </TabsContent>

        {/* Pagas Tab */}
        <TabsContent value="pagas" className="space-y-4">
          {pagas.length > 0 ? (
            <>
              <div className="flex justify-end">
                <Button
                  onClick={handleDeleteAllPaid}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Deletar Todas as Pagas
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pagas.map((tab) => (
                  <TabCard
                    key={tab.id}
                    tab={tab}
                    onView={() => {
                      setSelectedTabId(tab.id);
                      setShowDetailModal(true);
                    }}
                    onDelete={() => handleDeleteTab(tab.id)}
                  />
                ))}
              </div>
            </>
          ) : (
            <Card className="p-6 border-[#2a2a2a] bg-[#151515]">
              <p className="text-[#a0a0a0] text-center">Nenhuma comanda paga</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <NewTabModal
        isOpen={showNewTabModal}
        onClose={() => setShowNewTabModal(false)}
      />

      {selectedTab && (
        <>
          <TabDetailModal
            isOpen={showDetailModal}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedTabId(null);
            }}
            tab={selectedTab}
          />

          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedTabId(null);
            }}
            totalAmount={selectedTab.total_amount}
            onPay={handlePayTab}
          />
        </>
      )}
    </div>
  );
}
