// ============================================
// Invoices Table - Filtrovanie + Zoradenie
// ============================================

import { useState, useMemo } from 'react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  orderName: string | null;
  status: string;
  totalAmount: number;
  issueDate: string;
  dueDate: string;
  isAdvance: boolean;
}

type SortField = 'invoiceNumber' | 'orderName' | 'status' | 'totalAmount' | 'issueDate' | 'dueDate';
type SortDir = 'asc' | 'desc';

const STATUS_OPTIONS = [
  { value: '', label: 'Všetky stavy' },
  { value: 'paid', label: 'Zaplatená' },
  { value: 'sent', label: 'Odoslaná' },
  { value: 'overdue', label: 'Po splatnosti' },
  { value: 'draft', label: 'Koncept' },
  { value: 'cancelled', label: 'Zrušená' },
];

function translateStatus(status: string): string {
  const map: Record<string, string> = {
    draft: 'Koncept',
    sent: 'Odoslaná',
    paid: 'Zaplatená',
    overdue: 'Po splatnosti',
    cancelled: 'Zrušená',
  };
  return map[status] || status;
}

function getStatusBadge(status: string): string {
  const map: Record<string, string> = {
    draft: 'badge-draft',
    sent: 'badge-sent',
    paid: 'badge-completed',
    overdue: 'badge-cancelled',
    cancelled: 'badge-cancelled',
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

export default function InvoicesTable({ invoices }: { invoices: Invoice[] }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('issueDate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const filtered = useMemo(() => {
    let result = [...invoices];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.invoiceNumber?.toLowerCase().includes(q) ||
          inv.orderName?.toLowerCase().includes(q),
      );
    }

    if (statusFilter) {
      result = result.filter((inv) => inv.status === statusFilter);
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'invoiceNumber':
          cmp = (a.invoiceNumber || '').localeCompare(b.invoiceNumber || '');
          break;
        case 'orderName':
          cmp = (a.orderName || '').localeCompare(b.orderName || '', 'sk');
          break;
        case 'status':
          cmp = (a.status || '').localeCompare(b.status || '');
          break;
        case 'totalAmount':
          cmp = (a.totalAmount || 0) - (b.totalAmount || 0);
          break;
        case 'issueDate':
          cmp = new Date(a.issueDate || 0).getTime() - new Date(b.issueDate || 0).getTime();
          break;
        case 'dueDate':
          cmp = new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime();
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [invoices, search, statusFilter, sortField, sortDir]);

  if (invoices.length === 0) {
    return (
      <div className="glass-card p-12 text-center text-adsun-muted">
        <svg className="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <p className="text-lg font-medium mb-1">Žiadne faktúry</p>
        <p className="text-sm">Vaše faktúry sa tu zobrazia po vystavení.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-adsun-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Hľadať podľa čísla alebo zákazky..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-adsun-muted focus:outline-none focus:border-adsun-orange/50 transition-colors"
          />
        </div>

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
        {filtered.length === invoices.length
          ? `${filtered.length} faktúr`
          : `${filtered.length} z ${invoices.length} faktúr`}
      </p>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th className="cursor-pointer select-none" onClick={() => handleSort('invoiceNumber')}>
                  Číslo <SortIcon field="invoiceNumber" sortField={sortField} sortDir={sortDir} />
                </th>
                <th className="cursor-pointer select-none" onClick={() => handleSort('orderName')}>
                  Zákazka <SortIcon field="orderName" sortField={sortField} sortDir={sortDir} />
                </th>
                <th className="cursor-pointer select-none" onClick={() => handleSort('status')}>
                  Stav <SortIcon field="status" sortField={sortField} sortDir={sortDir} />
                </th>
                <th className="cursor-pointer select-none" onClick={() => handleSort('totalAmount')}>
                  Suma <SortIcon field="totalAmount" sortField={sortField} sortDir={sortDir} />
                </th>
                <th className="hidden md:table-cell cursor-pointer select-none" onClick={() => handleSort('issueDate')}>
                  Vystavená <SortIcon field="issueDate" sortField={sortField} sortDir={sortDir} />
                </th>
                <th className="hidden md:table-cell cursor-pointer select-none" onClick={() => handleSort('dueDate')}>
                  Splatnosť <SortIcon field="dueDate" sortField={sortField} sortDir={sortDir} />
                </th>
                <th className="hidden lg:table-cell">Typ</th>
                <th>PDF</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-adsun-muted">
                    Žiadne faktúry nezodpovedajú filtru.
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => (
                  <tr
                    key={inv.id}
                    className="cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => window.open(`/api/proxy/invoices/${inv.id}/pdf`, '_blank')}
                  >
                    <td className="text-adsun-orange font-mono text-sm">{inv.invoiceNumber}</td>
                    <td className="text-white text-sm max-w-[200px] truncate" title={inv.orderName || ''}>
                      {inv.orderName || <span className="text-adsun-muted text-xs">—</span>}
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(inv.status)}`}>
                        {translateStatus(inv.status)}
                      </span>
                    </td>
                    <td className="text-white font-medium">{formatCurrency(inv.totalAmount)}</td>
                    <td className="hidden md:table-cell">{formatDate(inv.issueDate)}</td>
                    <td className="hidden md:table-cell">{formatDate(inv.dueDate)}</td>
                    <td className="hidden lg:table-cell">
                      <span className="text-adsun-muted text-xs">
                        {inv.isAdvance ? 'Zálohová' : 'Bežná'}
                      </span>
                    </td>
                    <td>
                      <a
                        href={`/api/proxy/invoices/${inv.id}/pdf`}
                        target="_blank"
                        className="text-adsun-orange hover:underline text-sm inline-flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        PDF
                      </a>
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
