// ============================================
// Recent Orders Table - Dashboard sortable table
// ============================================

import { useState, useMemo } from 'react';

interface Order {
  id: string;
  orderNumber: string;
  name: string;
  status: string;
  totalValue: number | null;
  createdAt: string;
}

type SortField = 'orderNumber' | 'name' | 'status' | 'totalValue' | 'createdAt';
type SortDir = 'asc' | 'desc';

function translateStatus(status: string): string {
  const map: Record<string, string> = {
    DRAFT: 'Koncept',
    CONFIRMED: 'Potvrdená',
    SENT: 'Odoslaná',
    IN_PROGRESS: 'V realizácii',
    COMPLETED: 'Dokončená',
    CANCELLED: 'Zrušená',
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

export default function RecentOrdersTable({ orders }: { orders: Order[] }) {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sorted = useMemo(() => {
    const result = [...orders];
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
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [orders, sortField, sortDir]);

  if (orders.length === 0) {
    return (
      <div className="p-8 text-center text-adsun-muted">
        <p>Zatiaľ nemáte žiadne zákazky.</p>
        <a href="/products" className="btn-primary btn-sm mt-4 inline-flex">Objednať produkt</a>
      </div>
    );
  }

  return (
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
            <th className="hidden md:table-cell cursor-pointer select-none" onClick={() => handleSort('totalValue')}>
              Hodnota <SortIcon field="totalValue" sortField={sortField} sortDir={sortDir} />
            </th>
            <th className="hidden md:table-cell cursor-pointer select-none" onClick={() => handleSort('createdAt')}>
              Dátum <SortIcon field="createdAt" sortField={sortField} sortDir={sortDir} />
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((order) => (
            <tr
              key={order.id}
              className="cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => (window.location.href = `/orders/${order.id}`)}
            >
              <td>
                <span className="text-adsun-orange font-mono text-sm hover:underline">
                  {order.orderNumber}
                </span>
              </td>
              <td className="text-white">{order.name}</td>
              <td>
                <span className={`badge ${getStatusBadge(order.status)}`}>
                  {translateStatus(order.status)}
                </span>
              </td>
              <td className="hidden md:table-cell">{formatCurrency(order.totalValue)}</td>
              <td className="hidden md:table-cell">{formatDate(order.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
