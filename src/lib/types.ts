// ============================================
// Client Portal V2 - TypeScript Types
// ============================================

// --- Auth ---
export interface ClientSession {
  clientId: string;
  clientEntityId: string;
  clientName: string;
  email: string;
  organizationId: string;
  storagePath?: string;
  expiresAt: number;
  token: string;
}

// --- API ---
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

// --- Dashboard ---
export interface DashboardStats {
  activeOrders: number;
  pendingQuotes: number;
  unpaidInvoices: number;
  totalInvoiced: number;
}

// --- Orders ---
export interface Order {
  id: string;
  orderNumber: string;
  name: string;
  description?: string;
  status: OrderStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  clientName: string | null;
  clientEntityId: string | null;
  calculationId: string | null;
  totalValue: number | null;
  startDate: string | null;
  plannedEndDate: string | null;
  actualEndDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'DRAFT' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

// --- Quotes / Calculations ---
export interface Quote {
  id: string;
  name: string;
  status: QuoteStatus;
  totalPrice: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  shareToken?: string;
  items: QuoteItem[];
}

export interface QuoteItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit: string;
}

export type QuoteStatus = 'DRAFT' | 'SENT' | 'CLIENT_APPROVED' | 'CLIENT_REJECTED' | 'CLIENT_REQUESTED_CHANGES';

// --- Invoices ---
export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  totalAmount: number;
  currency: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate: string | null;
  isAdvance: boolean;
  pdfUrl: string | null;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

// --- NAS / Files ---
export interface NasFile {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  modifiedAt: string;
}

// --- Products ---
export interface ProductTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
  parameters: ProductParameter[];
}

export interface ProductParameter {
  id: string;
  name: string;
  displayName: string;
  valueType: 'text' | 'number' | 'select' | 'boolean';
  options?: string[];
  defaultValue?: string;
  unit?: string;
  required: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  productCount: number;
}

// --- Notifications ---
export interface Notification {
  id: string;
  type: 'quote_ready' | 'price_filled' | 'order_status' | 'invoice_issued';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  linkUrl?: string;
}

// --- AI Search ---
export interface AiSearchResult {
  orders: Order[];
  suggestions: string[];
  query: string;
}
