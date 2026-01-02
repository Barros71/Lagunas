// Constantes do projeto

export const APP_NAME = "BG LAGUNAS";
export const APP_TAGLINE = "DRINKS - TATTOO - BAR";

// Status de Agendamento
export const APPOINTMENT_STATUS = {
  AGENDADO: "agendado",
  CONFIRMADO: "confirmado",
  EM_ANDAMENTO: "em_andamento",
  CONCLUIDO: "concluido",
  CANCELADO: "cancelado",
} as const;

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  agendado: "Agendado",
  confirmado: "Confirmado",
  em_andamento: "Em Andamento",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export const APPOINTMENT_STATUS_COLORS: Record<string, string> = {
  agendado: "bg-blue-500/20 text-blue-400 border-blue-500",
  confirmado: "bg-green-500/20 text-green-400 border-green-500",
  em_andamento: "bg-yellow-500/20 text-yellow-400 border-yellow-500",
  concluido: "bg-cyan-500/20 text-cyan-400 border-cyan-500",
  cancelado: "bg-red-500/20 text-red-400 border-red-500",
};

// Tamanhos de Tatuagem
export const TATTOO_SIZES = {
  PEQUENA: "pequena",
  MEDIA: "media",
  GRANDE: "grande",
  FECHAMENTO: "fechamento",
} as const;

export const TATTOO_SIZE_LABELS: Record<string, string> = {
  pequena: "Pequena",
  media: "Média",
  grande: "Grande",
  fechamento: "Fechamento",
};

// Categorias de Menu
export const MENU_CATEGORIES = {
  BEBIDAS: "bebidas",
  CERVEJAS: "cervejas",
  DRINKS: "drinks",
  PETISCOS: "petiscos",
  OUTROS: "outros",
} as const;

export const MENU_CATEGORY_LABELS: Record<string, string> = {
  bebidas: "Bebidas",
  cervejas: "Cervejas",
  drinks: "Drinks",
  petiscos: "Petiscos",
  outros: "Outros",
};

export const MENU_CATEGORY_COLORS: Record<string, string> = {
  bebidas: "bg-blue-500/20 text-blue-400 border-blue-500",
  cervejas: "bg-amber-500/20 text-amber-400 border-amber-500",
  drinks: "bg-purple-500/20 text-purple-400 border-purple-500",
  petiscos: "bg-green-500/20 text-green-400 border-green-500",
  outros: "bg-gray-500/20 text-gray-400 border-gray-500",
};

// Status de Comanda
export const TAB_STATUS = {
  ABERTA: "aberta",
  FECHADA: "fechada",
  PAGA: "paga",
} as const;

export const TAB_STATUS_LABELS: Record<string, string> = {
  aberta: "Aberta",
  fechada: "Fechada",
  paga: "Paga",
};

export const TAB_STATUS_COLORS: Record<string, string> = {
  aberta: "bg-green-500/20 text-green-400 border-green-500",
  fechada: "bg-yellow-500/20 text-yellow-400 border-yellow-500",
  paga: "bg-cyan-500/20 text-cyan-400 border-cyan-500",
};

// Métodos de Pagamento
export const PAYMENT_METHODS = {
  DINHEIRO: "dinheiro",
  PIX: "pix",
  CREDITO: "credito",
  DEBITO: "debito",
} as const;

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  dinheiro: "Dinheiro",
  pix: "PIX",
  credito: "Crédito",
  debito: "Débito",
};

// Cores do Tema
export const THEME_COLORS = {
  BG_DARK: "#0a0a0a",
  BG_CARD: "#151515",
  BORDER_COLOR: "#2a2a2a",
  NEON_CYAN: "#00d4ff",
  NEON_ORANGE: "#ff6b35",
  NEON_YELLOW: "#ffd700",
  TEXT_PRIMARY: "#ffffff",
  TEXT_SECONDARY: "#a0a0a0",
} as const;

// URLs de Navegação
export const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Agenda", href: "/agenda" },
  { name: "Comandas", href: "/comandas" },
  { name: "Cardápio", href: "/cardapio" },
  { name: "Cozinha", href: "/cozinha" },
] as const;
