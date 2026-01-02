import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  Tab,
  CreateTabRequest,
  AddTabItemRequest,
  MenuItem,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
  Client,
  DashboardStats,
} from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ===== DASHBOARD =====
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const response = await apiClient.get<{ data: DashboardStats }>("/dashboard/stats");
      return response.data.data;
    },
  });
};

// ===== APPOINTMENTS =====
export const useAppointments = (date?: string) => {
  return useQuery({
    queryKey: ["appointments", date],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Appointment[] }>("/appointments", {
        params: date ? { date } : undefined,
      });
      return response.data.data;
    },
  });
};

export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: ["appointments", id],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Appointment }>(`/appointments/${id}`);
      return response.data.data;
    },
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateAppointmentRequest) => {
      const response = await apiClient.post<{ data: Appointment }>("/appointments", data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateAppointmentRequest) => {
      const { id, ...updateData } = data;
      console.log('Enviando atualização para API:', id, updateData);
      const response = await apiClient.put<{ data: Appointment }>(`/appointments/${id}`, updateData);
      console.log('Resposta da API:', response.data);
      return response.data.data;
    },
    onSuccess: (data) => {
      console.log('Atualização bem-sucedida, invalidando queries...');
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      // Forçar refetch das queries
      queryClient.refetchQueries({ queryKey: ["appointments"] });
    },
    onError: (error) => {
      console.error('Erro na atualização:', error);
    },
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/appointments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

// ===== MENU ITEMS =====
export const useMenuItems = (category?: string) => {
  return useQuery({
    queryKey: ["menu-items", category],
    queryFn: async () => {
      const response = await apiClient.get<{ data: MenuItem[] }>("/menu-items", {
        params: category ? { category } : undefined,
      });
      return response.data.data;
    },
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateMenuItemRequest) => {
      const response = await apiClient.post<{ data: MenuItem }>("/menu-items", data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateMenuItemRequest) => {
      const { id, ...updateData } = data;
      const response = await apiClient.put<{ data: MenuItem }>(`/menu-items/${id}`, updateData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/menu-items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });
};

// ===== TABS (COMANDAS) =====
export const useTabs = (status?: string) => {
  return useQuery({
    queryKey: ["tabs", status],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Tab[] }>("/tabs", {
        params: status ? { status } : undefined,
      });
      return response.data.data;
    },
    refetchInterval: 10000, // Atualizar a cada 10 segundos (menos frequente que cozinha)
    refetchIntervalInBackground: true,
    staleTime: 2000,
  });
};

export const useTab = (id: string) => {
  return useQuery({
    queryKey: ["tabs", id],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Tab }>(`/tabs/${id}`);
      return response.data.data;
    },
  });
};

export const useCreateTab = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateTabRequest) => {
      const response = await apiClient.post<{ data: Tab }>("/tabs", data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tabs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useAddTabItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AddTabItemRequest) => {
      const { tab_id, ...itemData } = data;
      const response = await apiClient.post<{ data: Tab }>(`/tabs/${tab_id}/items`, itemData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tabs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useRemoveTabItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tab_id, item_id }: { tab_id: string; item_id: string }) => {
      const response = await apiClient.delete<{ data: Tab }>(`/tabs/${tab_id}/items/${item_id}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tabs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useUpdateTabStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiClient.patch<{ data: Tab }>(`/tabs/${id}`, { status });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tabs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const usePayTab = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payment_methods }: { id: string; payment_methods: string[] | Array<{method: string, amount: number}> }) => {
      const response = await apiClient.post<{ data: Tab }>(`/tabs/${id}/pay`, { payment_methods });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tabs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useDeleteTab = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/tabs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tabs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

// ===== KITCHEN ORDERS =====
export const useKitchenOrders = () => {
  return useQuery({
    queryKey: ["kitchen-orders"],
    queryFn: async () => {
      const response = await apiClient.get<{ data: any[] }>("/kitchen");
      return response.data.data;
    },
    refetchInterval: 5000, // Atualizar a cada 5 segundos
    refetchIntervalInBackground: true, // Continuar atualizando mesmo quando aba não está ativa
    staleTime: 1000, // Considerar dados frescos por 1 segundo
  });
};

export const useMarkKitchenOrderReady = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post<{ data: any }>(`/kitchen/${id}/ready`);
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidar e refetch imediatamente
      queryClient.invalidateQueries({ queryKey: ["kitchen-orders"] });
      // Também fazer refetch forçado
      queryClient.refetchQueries({ queryKey: ["kitchen-orders"] });
    },
  });
};

export const useDeleteKitchenOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/kitchen/${id}/delete`);
    },
    onSuccess: () => {
      // Invalidar e refetch imediatamente
      queryClient.invalidateQueries({ queryKey: ["kitchen-orders"] });
      // Também fazer refetch forçado
      queryClient.refetchQueries({ queryKey: ["kitchen-orders"] });
    },
  });
};
