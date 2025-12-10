// Tipos de requisição e resposta da API

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ===== Auth Types =====
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: UserData;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

// ===== Appointment Types =====
export type AppointmentStatus = 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';
export type TattooSize = 'pequena' | 'media' | 'grande' | 'fechamento';

export interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration: number; // minutos
  tattoo_description: string;
  tattoo_size: TattooSize;
  price_estimate: number;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  client_name: string;
  client_phone: string;
  date: string;
  time: string;
  duration: number;
  tattoo_description: string;
  tattoo_size: TattooSize;
  price_estimate: number;
  status: AppointmentStatus;
  notes?: string;
}

export interface UpdateAppointmentRequest extends Partial<CreateAppointmentRequest> {
  id: string;
}

// ===== Menu Item Types =====
export type MenuCategory = 'bebidas' | 'cervejas' | 'drinks' | 'petiscos' | 'outros';

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  promo_price?: number;
  is_promo: boolean;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuItemRequest {
  name: string;
  category: MenuCategory;
  price: number;
  promo_price?: number;
  is_promo: boolean;
  available: boolean;
}

export interface UpdateMenuItemRequest extends Partial<CreateMenuItemRequest> {
  id: string;
}

// ===== Tab (Comanda) Types =====
export type TabStatus = 'aberta' | 'fechada' | 'paga';
export type PaymentMethod = 'dinheiro' | 'pix' | 'credito' | 'debito';

export interface TabItem {
  id: string;
  name: string;
  product_id?: string;
  quantity: number;
  price: number;
}

export interface Tab {
  id: string;
  client_name: string;
  table_number?: number;
  items: TabItem[];
  total_amount: number;
  status: TabStatus;
  payment_method?: PaymentMethod;
  payments?: {
    amount: number;
    method: string;
    method_pt?: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTabRequest {
  client_name: string;
  table_number?: number;
}

export interface UpdateTabRequest {
  id: string;
  client_name?: string;
  table_number?: number;
  status?: TabStatus;
  payment_method?: PaymentMethod;
}

export interface AddTabItemRequest {
  tab_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface RemoveTabItemRequest {
  tab_id: string;
  item_id: string;
}

// ===== Client Types =====
export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

// ===== Dashboard Types =====
export interface DashboardStats {
  total_appointments_today: number;
  total_appointments_week: number;
  total_revenue_month: number;
  open_tabs_count: number;
  upcoming_appointments: Appointment[];
  open_tabs: Tab[];
}
