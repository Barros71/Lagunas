'use client';

import { useState } from 'react';
import { useKitchenOrders, useMarkKitchenOrderReady, useDeleteKitchenOrder } from '@/hooks/useApi';
import { useIsFetching } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Trash2, Clock, ChefHat, RefreshCw } from 'lucide-react';

export default function CozinhaPage() {
  const { data: orders, isLoading, error } = useKitchenOrders();
  const markReady = useMarkKitchenOrderReady();
  const deleteOrder = useDeleteKitchenOrder();
  const isFetching = useIsFetching({ queryKey: ["kitchen-orders"] });

  const pendingOrders = orders?.filter(o => o.status === 'PENDING') || [];
  const deliveredOrders = orders?.filter(o => o.status === 'DELIVERED') || [];

  const handleMarkReady = async (id: string) => {
    await markReady.mutateAsync(id);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este pedido?')) {
      await deleteOrder.mutateAsync(id);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 border-red-500/50 bg-red-500/10">
          <p className="text-red-400">Erro ao carregar pedidos da cozinha</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <ChefHat className="h-8 w-8" />
            Cozinha
            {isFetching > 0 && (
              <RefreshCw className="h-5 w-5 animate-spin text-[#00d4ff]" />
            )}
          </h1>
          <p className="text-[#a0a0a0] mt-2 flex items-center gap-2">
            Gerencie pedidos da cozinha
            <span className="text-xs bg-[#00d4ff]/20 text-[#00d4ff] px-2 py-1 rounded">
              Atualização automática a cada 5s
            </span>
          </p>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-[#151515] border border-[#2a2a2a]">
          <TabsTrigger value="pending" className="data-[state=active]:bg-[#00d4ff] data-[state=active]:text-black">
            Pendentes ({pendingOrders.length})
          </TabsTrigger>
          <TabsTrigger value="delivered" className="data-[state=active]:bg-[#00d4ff] data-[state=active]:text-black">
            Entregues ({deliveredOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <h2 className="text-xl font-bold text-white">Pedidos Pendentes</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-[#2a2a2a] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : pendingOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingOrders.map((order) => (
                <Card key={order.id} className="p-4 border-[#2a2a2a] bg-[#151515]">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-white text-lg break-words">{order.itemName}</p>
                        <p className="text-[#a0a0a0] break-words">Cliente: {order.clientName}</p>
                        <p className="text-sm text-[#a0a0a0]">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Pendente
                      </Badge>
                    </div>
                    <Button
                      onClick={() => handleMarkReady(order.id)}
                      className="w-full bg-[#00d4ff] hover:bg-[#00d4ff]/80 text-black"
                      disabled={markReady.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar como Entregue
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 border-[#2a2a2a] bg-[#151515]">
              <p className="text-[#a0a0a0] text-center">Nenhum pedido pendente</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="delivered" className="space-y-4">
          <h2 className="text-xl font-bold text-white">Pedidos Entregues</h2>
          {deliveredOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliveredOrders.map((order) => (
                <Card key={order.id} className="p-4 border-[#2a2a2a] bg-[#151515]">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-white text-lg break-words">{order.itemName}</p>
                        <p className="text-[#a0a0a0] break-words">Cliente: {order.clientName}</p>
                        <p className="text-sm text-[#a0a0a0]">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500">
                        Entregue
                      </Badge>
                    </div>
                    <Button
                      onClick={() => handleDelete(order.id)}
                      variant="outline"
                      className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                      disabled={deleteOrder.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 border-[#2a2a2a] bg-[#151515]">
              <p className="text-[#a0a0a0] text-center">Nenhum pedido entregue</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}