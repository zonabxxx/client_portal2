// ============================================
// Client Portal V2 - Utility Functions
// ============================================

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import { sk } from 'date-fns/locale';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format date to Slovak format dd.MM.yyyy */
export function formatDate(dateString: string | Date | number | null | undefined): string {
  if (!dateString) return '—';
  let date: Date;
  if (typeof dateString === 'number') {
    // UNIX timestamp (seconds or ms)
    date = new Date(dateString > 1e12 ? dateString : dateString * 1000);
  } else if (typeof dateString === 'string') {
    date = parseISO(dateString);
  } else {
    date = dateString;
  }
  if (isNaN(date.getTime()) || date.getFullYear() < 2000) return '—';
  return format(date, 'dd.MM.yyyy', { locale: sk });
}

/** Format date with time */
export function formatDateTime(dateString: string | Date | null): string {
  if (!dateString) return '—';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, 'dd.MM.yyyy HH:mm', { locale: sk });
}

/** Format currency to EUR */
export function formatCurrency(amount: number | null, currency = 'EUR'): string {
  if (amount == null) return '—';
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Format file size */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/** Get status badge class */
export function getStatusBadge(status: string): string {
  const map: Record<string, string> = {
    DRAFT: 'badge-draft',
    CONFIRMED: 'badge-confirmed',
    SENT: 'badge-sent',
    SENT_TO_CLIENT: 'badge-sent',
    CLIENT_VIEWED: 'badge-in-progress',
    IN_PROGRESS: 'badge-in-progress',
    COMPLETED: 'badge-completed',
    CANCELLED: 'badge-cancelled',
    CLIENT_APPROVED: 'badge-completed',
    CLIENT_REJECTED: 'badge-cancelled',
    CLIENT_REQUESTED_CHANGES: 'badge-in-progress',
    WAITING_FOR_CLIENT: 'badge-in-progress',
    draft: 'badge-draft',
    sent: 'badge-sent',
    paid: 'badge-paid',
    overdue: 'badge-overdue',
    cancelled: 'badge-cancelled',
  };
  return map[status] || 'badge-draft';
}

/** Translate status to Slovak */
export function translateStatus(status: string): string {
  const map: Record<string, string> = {
    DRAFT: 'V príprave',
    CONFIRMED: 'Potvrdená',
    SENT: 'Odoslaná',
    SENT_TO_CLIENT: 'Odoslaná klientovi',
    CLIENT_VIEWED: 'Čaká na schválenie',
    IN_PROGRESS: 'V realizácii',
    COMPLETED: 'Dokončená',
    CANCELLED: 'Zrušená',
    CLIENT_APPROVED: 'Schválená',
    CLIENT_REJECTED: 'Zamietnutá',
    CLIENT_REQUESTED_CHANGES: 'Požadované zmeny',
    WAITING_FOR_CLIENT: 'Čaká na vaše údaje',
    draft: 'V príprave',
    sent: 'Odoslaná',
    paid: 'Zaplatená',
    overdue: 'Po splatnosti',
    cancelled: 'Zrušená',
    low: 'Nízka',
    medium: 'Stredná',
    high: 'Vysoká',
    critical: 'Kritická',
  };
  return map[status] || status;
}
