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
      const response = await apiClient.put<{ data: Appointment }>(`/appointments/${id}`, updateData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
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
    mutationFn: async ({ id, payment_method }: { id: string; payment_method: string }) => {
      const response = await apiClient.post<{ data: Tab }>(`/tabs/${id}/pay`, { payment_method });
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

// ===== CLIENTS =====
export const useClients = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Client[] }>("/clients");
      return response.data.data;
    },
  });
};
