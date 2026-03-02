// ============================================
// Orders Table - Filtrovanie + Zoradenie
// ============================================

import { useState, useMemo } from 'react';

interface Order {
  id: string;
  orderNumber: string;
  name: string;
  status: string;
  priority: string;
  totalValue: number | null;
  createdAt: string;
  plannedEndDate: string | null;
}

type SortField = 'orderNumber' | 'name' | 'status' | 'totalValue' | 'createdAt' | 'plannedEndDate';
type SortDir = 'asc' | 'desc';

const STATUS_OPTIONS = [
  { value: '', label: 'Všetky stavy' },
  { value: 'DRAFT', label: 'Koncept' },
  { value: 'CONFIRMED', label: 'Potvrdená' },
  { value: 'IN_PROGRESS', label: 'V realizácii' },
  { value: 'COMPLETED', label: 'Dokončená' },
  { value: 'CANCELLED', label: 'Zrušená' },
];

function translateStatus(status: string): string {
  const map: Record<string, string> = {
    DRAFT: 'Koncept',
    CONFIRMED: 'Potvrdená',
    SENT: 'Odoslaná',
    IN_PROGRESS: 'V realizácii',
    COMPLETED: 'Dokončená',
    CANCELLED: 'Zrušená',
    low: 'Nízka',
    medium: 'Stredná',
    high: 'Vysoká',
    critical: 'Kritická',
  };
  return map[status] || status;
}

function getStatusBadge(status: string): string {
  const map: Record<string, string> = {
    DRAFT: 'badge-draft',
    CONFIRMED: 'badge-confirmed',
    SENT: 'badge-sent',
    IN_PROGRESS: 'badge-in-progress',
    COMPLETED: 'badge-completed',
    CANCELLED: 'badge-cancelled',
    draft: 'badge-draft',
  };
  return map[status] || 'badge-draft';
}

function formatCurrency(amount: number | null): string {
  if (amount == null) return '—';
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '—';
  const d = new Date(dateString);
  return d.toLocaleDateString('sk-SK', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Sort arrow icon
function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  if (field !== sortField) {
    return (
      <svg className="w-3.5 h-3.5 ml-1 opacity-30 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
      </svg>
    );
  }
  return (
    <svg className="w-3.5 h-3.5 ml-1 text-adsun-orange inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      {sortDir === 'asc' ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      )}
    </svg>
  );
}

export default function OrdersTable({ orders: initialOrders }: { orders: Order[] }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleReorder = async (orderId: string, btn: HTMLButtonElement) => {
    btn.disabled = true;
    const origHTML = btn.innerHTML;
    btn.innerHTML = '<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
    try {
      const res = await fetch(`/api/proxy/orders/${orderId}`);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      const reorderProducts = data.reorderProducts || [];

      if (reorderProducts.length === 0) {
        alert('Žiadne produkty na opätovné objednanie.');
        btn.innerHTML = origHTML;
        btn.disabled = false;
        return;
      }

      const CART_KEY = 'adsun_portal_cart';
      let cart: any[] = [];
      try { cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { cart = []; }

      for (const p of reorderProducts) {
        cart.push({
          id: 'cart-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
          productId: p.productId,
          productName: p.productName,
          productType: p.productType,
          variantId: p.variantId || null,
          variantName: p.variantName || null,
          quantity: p.quantity || 1,
          parameters: p.parameters || {},
          notes: '',
          fileNames: [],
          categoryId: p.categoryId || null,
          categoryName: p.categoryName || null,
          addedAt: new Date().toISOString(),
        });
      }
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: cart.length } }));
      window.location.href = '/cart';
    } catch {
      alert('Chyba pri načítavaní produktov.');
      btn.innerHTML = origHTML;
      btn.disabled = false;
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const filtered = useMemo(() => {
    let result = [...initialOrders];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.name?.toLowerCase().includes(q) ||
          o.orderNumber?.toLowerCase().includes(q),
      );
    }

    // Status filter
    if (statusFilter) {
      result = result.filter((o) => o.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'orderNumber':
          cmp = (a.orderNumber || '').localeCompare(b.orderNumber || '');
          break;
        case 'name':
          cmp = (a.name || '').localeCompare(b.name || '', 'sk');
          break;
        case 'status':
          cmp = (a.status || '').localeCompare(b.status || '');
          break;
        case 'totalValue':
          cmp = (a.totalValue || 0) - (b.totalValue || 0);
          break;
        case 'createdAt':
          cmp = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
          break;
        case 'plannedEndDate':
          cmp = new Date(a.plannedEndDate || 0).getTime() - new Date(b.plannedEndDate || 0).getTime();
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [initialOrders, search, statusFilter, sortField, sortDir]);

  if (initialOrders.length === 0) {
    return (
      <div className="glass-card p-12 text-center text-adsun-muted">
        <svg className="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
        <p className="text-lg font-medium mb-1">Zatiaľ žiadne zákazky</p>
        <p className="text-sm">Vaše zákazky sa tu zobrazia po vytvorení.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-adsun-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Hľadať podľa názvu alebo čísla..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-adsun-muted focus:outline-none focus:border-adsun-orange/50 transition-colors"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-adsun-orange/50 transition-colors appearance-none cursor-pointer min-w-[180px]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
          }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#1a1a1a] text-white">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-xs text-adsun-muted mb-2">
        {filtered.length === initialOrders.length
          ? `${filtered.length} zákaziek`
          : `${filtered.length} z ${initialOrders.length} zákaziek`}
      </p>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th className="cursor-pointer select-none" onClick={() => handleSort('orderNumber')}>
                  Číslo <SortIcon field="orderNumber" sortField={sortField} sortDir={sortDir} />
                </th>
                <th className="cursor-pointer select-none" onClick={() => handleSort('name')}>
                  Názov <SortIcon field="name" sortField={sortField} sortDir={sortDir} />
                </th>
                <th className="cursor-pointer select-none" onClick={() => handleSort('status')}>
                  Stav <SortIcon field="status" sortField={sortField} sortDir={sortDir} />
                </th>
                <th>Priorita</th>
                <th className="hidden md:table-cell cursor-pointer select-none" onClick={() => handleSort('totalValue')}>
                  Hodnota <SortIcon field="totalValue" sortField={sortField} sortDir={sortDir} />
                </th>
                <th className="hidden md:table-cell cursor-pointer select-none" onClick={() => handleSort('createdAt')}>
                  Vytvorená <SortIcon field="createdAt" sortField={sortField} sortDir={sortDir} />
                </th>
                <th className="hidden lg:table-cell cursor-pointer select-none" onClick={() => handleSort('plannedEndDate')}>
                  Deadline <SortIcon field="plannedEndDate" sortField={sortField} sortDir={sortDir} />
                </th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-adsun-muted">
                    Žiadne zákazky nezodpovedajú filtru.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => (window.location.href = `/orders/${order.id}`)}
                  >
                    <td>
                      <span className="text-adsun-orange font-mono text-sm">{order.orderNumber}</span>
                    </td>
                    <td className="text-white font-medium">{order.name}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(order.status)}`}>
                        {translateStatus(order.status)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          order.priority === 'high' || order.priority === 'critical'
                            ? 'badge-cancelled'
                            : 'badge-draft'
                        }`}
                      >
                        {translateStatus(order.priority)}
                      </span>
                    </td>
                    <td className="hidden md:table-cell">{formatCurrency(order.totalValue)}</td>
                    <td className="hidden md:table-cell">{formatDate(order.createdAt)}</td>
                    <td className="hidden lg:table-cell">{formatDate(order.plannedEndDate)}</td>
                    <td>
                      <button
                        className="p-2 rounded-lg hover:bg-adsun-orange/20 text-adsun-muted hover:text-adsun-orange transition-colors"
                        title="Objednať znova"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReorder(order.id, e.currentTarget);
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.182-3.182" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
