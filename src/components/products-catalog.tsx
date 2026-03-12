// ============================================
// Products Catalog - Drill-down category browser
// Categories first → Client products below
// ============================================

'use client';

import { useState, useMemo, useRef } from 'react';
import {
  IdCard, Car, Printer, StickyNote, Shirt, Layers,
  Newspaper, Sparkles, RectangleHorizontal, Image, Package,
  ScrollText, BookOpen, Palette, Megaphone, Presentation,
  PanelTop, Scissors, Wrench, Signpost, FileText,
  MonitorSmartphone, Trophy, Gift, Shapes, Heart,
  Mail, Calendar, FolderOpen, NotebookText,
  type LucideIcon,
} from 'lucide-react';

interface CategoryNode {
  id: string;
  name: string;
  description?: string;
  backgroundImage?: string;
  templateCount: number;
  children: CategoryNode[];
}

interface ProductVariant {
  id: string;
  name: string;
  description: string;
  unit: string;
}

interface ClientProduct {
  id: string;
  name: string;
  description: string | null;
  category: string;
  pricingUnit: string;
  basePrice?: number;
  clientName: string | null;
  type?: 'template' | 'product';
  variants?: ProductVariant[];
}

interface CatalogTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  pricingUnit: string;
  basePrice?: number;
  isClientProduct: boolean;
  clientName: string | null;
}

interface Props {
  categories: CategoryNode[];
  clientProducts: ClientProduct[];
  clientName: string;
}

// ═══ Dynamické mapovanie kľúčových slov → Lucide ikony ═══
// Pravidlá sú zoradené od NAJŠPECIFICKEJŠÍCH po najvšeobecnejšie.
// Prvý match vyhráva — preto konkrétne podkategórie tlače sú PRED generickým "tlač".
const ICON_RULES: { keywords: string[]; icon: LucideIcon; label: string }[] = [
  // ─── 1. Najšpecifickejšie produkty ───
  { keywords: ['vizitk', 'business card', 'visit'],           icon: IdCard,              label: 'Vizitky' },
  { keywords: ['polep', 'car wrap', 'auto polep', 'dodáv'],   icon: Car,                 label: 'Polepy áut' },
  { keywords: ['okien', 'stien', 'výklad', 'window', 'glass'], icon: PanelTop,           label: 'Polep okien' },
  { keywords: ['fóli', 'foil', 'pvc', 'rezané grafik'],       icon: ScrollText,          label: 'PVC fólie' },

  // ─── 2. Tlačové SUB-kategórie (PRED generickým "tlač"!) ───
  { keywords: ['offset'],                                     icon: Layers,              label: 'Offsetová tlač' },
  { keywords: ['digitáln', 'digital'],                        icon: Printer,             label: 'Digitálna tlač' },
  { keywords: ['maloformát'],                                 icon: Newspaper,           label: 'Tlač – maloformát' },
  { keywords: ['veľkoformát', 'velkoformat', 'roll-up', 'banner', 'placht', 'beach flag', 'solvent', 'uv tlač'], icon: Presentation, label: 'Veľkoformát' },
  { keywords: ['katalóg', 'kniha', 'publication', 'yearbook'], icon: BookOpen,            label: 'Knihy / katalógy' },
  { keywords: ['leták', 'flyer', 'leaflet'],                  icon: FileText,            label: 'Letáky' },
  { keywords: ['brožúr', 'brochure', 'booklet'],              icon: BookOpen,            label: 'Brožúry' },
  { keywords: ['plagát', 'poster', 'plakát'],                 icon: Image,               label: 'Plagáty' },
  { keywords: ['obálk', 'envelope'],                          icon: Mail,                label: 'Obálky' },
  { keywords: ['zakladač', 'šanón', 'binder'],                icon: FolderOpen,          label: 'Zakladače' },
  { keywords: ['hlavičk', 'letterhead'],                      icon: FileText,            label: 'Hlavičkové papiere' },
  { keywords: ['kalendár', 'calendar'],                       icon: Calendar,            label: 'Kalendáre' },
  { keywords: ['časopis', 'magazín', 'magazine'],             icon: NotebookText,        label: 'Časopisy' },
  { keywords: ['svadobn', 'wedding', 'svadba'],                icon: Heart,               label: 'Svadobné tlačoviny' },
  { keywords: ['špeciáln', 'magnetk', 'pauzák', 'plasty'],   icon: Shapes,              label: 'Špeciálne materiály' },
  { keywords: ['pozvánk', 'invitation'],                      icon: Mail,                label: 'Pozvánky' },
  { keywords: ['samolep', 'sticker', 'nálep', 'etike'],       icon: StickyNote,          label: 'Samolepky' },

  // ─── 3. Hlavné kategórie ───
  { keywords: ['billboard', 'bigboard'],                       icon: RectangleHorizontal, label: 'Billboardy' },
  { keywords: ['tlačov', 'print product', 'tlacov'],          icon: Newspaper,            label: 'Tlačové produkty' },
  { keywords: ['tlač', 'print', 'tisk'],                      icon: FileText,             label: 'Tlač (generic)' },
  { keywords: ['obleč', 'oblec', 'textil', 'tričk', 'potlač', 'shirt'], icon: Shirt,    label: 'Oblečenie' },
  { keywords: ['svetel', 'led', 'neon', 'osvetl'],            icon: Sparkles,             label: 'Svetelná reklama' },

  // ─── 5. Ostatné ───
  { keywords: ['dizajn', 'design', 'grafik', 'brand'],        icon: Palette,              label: 'Dizajn' },
  { keywords: ['cedul', 'značen', 'sign', 'tabul', 'navigácia'], icon: Signpost,          label: 'Značenie' },
  { keywords: ['inštalác', 'instalac', 'montáž'],             icon: Wrench,               label: 'Inštalácie' },
  { keywords: ['digitál', 'web', 'screen', 'online', 'social'], icon: MonitorSmartphone,  label: 'Digitál' },
  { keywords: ['darč', 'merch', 'promo', 'reklamn', 'predmet'], icon: Gift,               label: 'Reklamné predmety' },
  { keywords: ['obal', 'krabic', 'packaging', 'box'],         icon: Package,              label: 'Obaly' },
  { keywords: ['dokument', 'formulár', 'certifikát', 'diplom'], icon: FileText,           label: 'Dokumenty' },
  { keywords: ['cnc', 'laser', 'gravírov', 'nožnic', 'rezanie'], icon: Scissors,          label: 'Rezanie' },
  { keywords: ['reklam', 'market', 'kampaň'],                 icon: Megaphone,            label: 'Reklama' },
  { keywords: ['trof', 'oceneni', 'award', 'pohár'],          icon: Trophy,               label: 'Ocenenia' },
];

/**
 * Dynamicky nájde Lucide ikonu podľa textu (názov + popis + kategória).
 * Prehľadáva kľúčové slová v poradí priority.
 */
function getIconForText(text: string): LucideIcon {
  const lower = text.toLowerCase();
  for (const rule of ICON_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.icon;
    }
  }
  return Package; // default — generický produkt
}

/** Ikona pre kategóriu — kontroluje názov, ak nenájde, skúsi aj description */
function getCategoryIcon(name: string, description?: string): LucideIcon {
  const fromName = getIconForText(name);
  if (fromName !== Package) return fromName;
  // Fallback: skúsiť aj s popisom
  if (description) return getIconForText(`${name} ${description}`);
  return Package;
}

/** Ikona pre produkt — priorita: 1) názov, 2) názov+popis, 3) názov+popis+kategória */
function getProductIcon(product: ClientProduct): LucideIcon {
  // 1. Najprv iba názov (najvyššia priorita)
  const fromName = getIconForText(product.name);
  if (fromName !== Package) return fromName;
  // 2. Názov + popis
  if (product.description) {
    const fromDesc = getIconForText(`${product.name} ${product.description}`);
    if (fromDesc !== Package) return fromDesc;
  }
  // 3. Celý kontext
  return getIconForText(`${product.name} ${product.description || ''} ${product.category || ''}`);
}

// Legacy SVG functions removed — replaced by Lucide icons

// Pôvodné getCategorySvg bolo tu — nahradené Lucide ikonami
/*
function getCategorySvg(name: string): string {
  const n = name.toLowerCase();

  // Billboard
  if (n.includes('billboard') || (n.includes('reklam') && n.includes('plocha')))
    return `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Stĺpy -->
      <line x1="35" y1="72" x2="35" y2="112" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="85" y1="72" x2="85" y2="112" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
      <!-- Vzpery -->
      <line x1="35" y1="95" x2="50" y2="72" stroke="currentColor" stroke-width="2" opacity="0.4"/>
      <line x1="85" y1="95" x2="70" y2="72" stroke="currentColor" stroke-width="2" opacity="0.4"/>
      <!-- Tabula -->
      <rect x="8" y="8" width="104" height="64" rx="4" stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.06"/>
      <!-- Obsah -->
      <rect x="16" y="18" width="30" height="22" rx="3" fill="currentColor" opacity="0.12"/>
      <line x1="54" y1="22" x2="100" y2="22" stroke="currentColor" stroke-width="3" opacity="0.25" stroke-linecap="round"/>
      <line x1="54" y1="32" x2="92" y2="32" stroke="currentColor" stroke-width="2.5" opacity="0.15" stroke-linecap="round"/>
      <line x1="16" y1="50" x2="100" y2="50" stroke="currentColor" stroke-width="2" opacity="0.1" stroke-linecap="round"/>
      <line x1="16" y1="58" x2="75" y2="58" stroke="currentColor" stroke-width="2" opacity="0.08" stroke-linecap="round"/>
      <line x1="85" y1="35" x2="160" y2="35" stroke="currentColor" stroke-width="1.5" opacity="0.2"/>
      <line x1="85" y1="43" x2="140" y2="43" stroke="currentColor" stroke-width="1.5" opacity="0.15"/>
      <rect x="25" y="55" x2="55" width="40" height="12" rx="2" stroke="currentColor" stroke-width="1" opacity="0.25"/>
      <!-- Svetlá na vrchu -->
      <circle cx="60" cy="8" r="4" fill="currentColor" opacity="0.2"/>
      <circle cx="100" cy="8" r="4" fill="currentColor" opacity="0.2"/>
      <circle cx="140" cy="8" r="4" fill="currentColor" opacity="0.2"/>
    </svg>`;

  // Polep okien / stien — moderná presklená budova s polepom na výkladoch
  if (n.includes('polep') && (n.includes('okien') || n.includes('stien') || n.includes('folio')))
    return `<svg viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Zem -->
      <line x1="10" y1="128" x2="230" y2="128" stroke="currentColor" stroke-width="1" opacity="0.15"/>
      <!-- Budova — fasáda -->
      <rect x="25" y="12" width="190" height="116" rx="3" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.02"/>
      <!-- Atika / parapet hore -->
      <line x1="22" y1="12" x2="218" y2="12" stroke="currentColor" stroke-width="2.5" opacity="0.6"/>
      <!-- Nápis obchodu -->
      <rect x="70" y="18" width="100" height="14" rx="2" stroke="currentColor" stroke-width="1.2" opacity="0.35"/>
      <line x1="82" y1="25" x2="158" y2="25" stroke="currentColor" stroke-width="2" opacity="0.2"/>
      <!-- Markíza -->
      <path d="M30 38 L210 38 L215 46 L25 46 Z" stroke="currentColor" stroke-width="1.5" opacity="0.4" fill="currentColor" fill-opacity="0.04"/>
      <line x1="60" y1="38" x2="58" y2="46" stroke="currentColor" stroke-width="0.8" opacity="0.15"/>
      <line x1="100" y1="38" x2="98" y2="46" stroke="currentColor" stroke-width="0.8" opacity="0.15"/>
      <line x1="140" y1="38" x2="138" y2="46" stroke="currentColor" stroke-width="0.8" opacity="0.15"/>
      <line x1="180" y1="38" x2="178" y2="46" stroke="currentColor" stroke-width="0.8" opacity="0.15"/>
      <!-- Ľavé výkladné okno -->
      <rect x="32" y="50" width="72" height="58" rx="2" stroke="currentColor" stroke-width="2"/>
      <!-- Polep na ľavom okne -->
      <rect x="36" y="54" width="64" height="50" rx="1" fill="currentColor" opacity="0.07"/>
      <!-- Grafika polepu — logo kruh -->
      <circle cx="56" cy="70" r="10" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
      <line x1="50" y1="70" x2="62" y2="70" stroke="currentColor" stroke-width="1.2" opacity="0.2"/>
      <!-- Text polepu -->
      <line x1="72" y1="66" x2="94" y2="66" stroke="currentColor" stroke-width="2" opacity="0.2"/>
      <line x1="72" y1="74" x2="90" y2="74" stroke="currentColor" stroke-width="1.2" opacity="0.12"/>
      <!-- Percentá / akcia -->
      <rect x="42" y="88" width="22" height="12" rx="2" stroke="currentColor" stroke-width="1" opacity="0.25" fill="currentColor" fill-opacity="0.05"/>
      <!-- Dvere uprostred -->
      <rect x="110" y="50" width="22" height="58" rx="2" stroke="currentColor" stroke-width="2"/>
      <rect x="113" y="53" width="16" height="28" rx="1" stroke="currentColor" stroke-width="1" opacity="0.35" fill="currentColor" fill-opacity="0.03"/>
      <circle cx="128" cy="82" r="2" fill="currentColor" opacity="0.4"/>
      <!-- Krok nad dverami -->
      <line x1="110" y1="108" x2="132" y2="108" stroke="currentColor" stroke-width="1.5" opacity="0.2"/>
      <!-- Pravé výkladné okno -->
      <rect x="138" y="50" width="72" height="58" rx="2" stroke="currentColor" stroke-width="2"/>
      <!-- Polep na pravom okne -->
      <rect x="142" y="54" width="64" height="50" rx="1" fill="currentColor" opacity="0.07"/>
      <!-- Grafika polepu — obrázok produktu -->
      <rect x="148" y="60" width="24" height="18" rx="2" fill="currentColor" opacity="0.1"/>
      <line x1="178" y1="64" x2="200" y2="64" stroke="currentColor" stroke-width="2" opacity="0.2"/>
      <line x1="178" y1="72" x2="196" y2="72" stroke="currentColor" stroke-width="1.2" opacity="0.12"/>
      <line x1="148" y1="86" x2="200" y2="86" stroke="currentColor" stroke-width="1.5" opacity="0.12"/>
      <line x1="148" y1="93" x2="185" y2="93" stroke="currentColor" stroke-width="1" opacity="0.08"/>
      <!-- Odraz na skle -->
      <line x1="38" y1="54" x2="48" y2="64" stroke="currentColor" stroke-width="0.6" opacity="0.08"/>
      <line x1="144" y1="54" x2="154" y2="64" stroke="currentColor" stroke-width="0.6" opacity="0.08"/>
    </svg>`;

  // Polepy aut — elegantná dodávka s polepom (štýl ADSUN web)
  if (n.includes('polep') && n.includes('aut'))
    return `<svg viewBox="0 0 240 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Tieň pod autom -->
      <ellipse cx="120" cy="118" rx="95" ry="5" fill="currentColor" opacity="0.06"/>
      <!-- Podvozok -->
      <path d="M28 100 L212 100" stroke="currentColor" stroke-width="1.2" opacity="0.25"/>
      <!-- Karoséria — nákladný priestor (oblý, čistý tvar) -->
      <path d="M22 98 L22 32 C22 28 25 25 29 25 L138 25 C140 25 142 26 142 28 L142 98" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.03"/>
      <!-- Strecha zaoblená -->
      <path d="M22 32 C22 22 30 18 40 18 L130 18 C136 18 142 22 142 28" stroke="currentColor" stroke-width="2" fill="none"/>
      <!-- Kabína — plynulý prechod -->
      <path d="M142 98 L142 52 L160 52 C164 52 168 53 172 56 L195 78 C200 83 202 88 202 93 L202 98" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.04"/>
      <!-- Predné okno kabíny (zaoblené) -->
      <path d="M146 56 L146 75 L192 92 L192 84 L175 68 C170 62 165 58 160 56 Z" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0.06" stroke-linejoin="round"/>
      <!-- Stĺpik medzi oknami -->
      <line x1="146" y1="75" x2="160" y2="75" stroke="currentColor" stroke-width="1.2" opacity="0.3"/>
      <!-- Bočné okno kabíny -->
      <rect x="146" y="57" width="12" height="16" rx="2" stroke="currentColor" stroke-width="1.2" opacity="0.4" fill="currentColor" fill-opacity="0.04"/>
      <!-- Nárazník predný -->
      <path d="M202 88 L210 88 C213 88 215 90 215 93 L215 100 L202 100" stroke="currentColor" stroke-width="1.8" fill="currentColor" fill-opacity="0.03"/>
      <!-- Nárazník zadný -->
      <path d="M22 98 L14 98 L14 92 C14 90 15 88 17 88 L22 88" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
      <!-- Predné svetlo -->
      <rect x="206" y="82" width="8" height="5" rx="1.5" fill="currentColor" opacity="0.35"/>
      <!-- Zadné svetlo -->
      <rect x="16" y="82" width="5" height="8" rx="1.5" fill="currentColor" opacity="0.25"/>
      <!-- Spätné zrkadlo -->
      <path d="M142 54 L136 48 L136 44 L140 44 L142 48" stroke="currentColor" stroke-width="1.2" opacity="0.4" fill="currentColor" fill-opacity="0.04"/>
      <!-- Deliaca čiara karosérie -->
      <line x1="142" y1="25" x2="142" y2="100" stroke="currentColor" stroke-width="1.5" opacity="0.35"/>
      <!-- Bočné dvere nákladného priestoru -->
      <line x1="82" y1="28" x2="82" y2="98" stroke="currentColor" stroke-width="1" opacity="0.2"/>
      <!-- Kľučka dverí -->
      <rect x="84" y="60" width="6" height="2" rx="1" fill="currentColor" opacity="0.25"/>
      <!-- ═══ Polep na boku — oblasť grafiky ═══ -->
      <rect x="30" y="35" width="46" height="48" rx="3" stroke="currentColor" stroke-width="0.8" stroke-dasharray="5 3" opacity="0.2" fill="currentColor" fill-opacity="0.04"/>
      <rect x="88" y="35" width="48" height="48" rx="3" stroke="currentColor" stroke-width="0.8" stroke-dasharray="5 3" opacity="0.2" fill="currentColor" fill-opacity="0.04"/>
      <!-- Logo na polep oblasti -->
      <line x1="38" y1="52" x2="68" y2="52" stroke="currentColor" stroke-width="2.5" opacity="0.2"/>
      <line x1="38" y1="60" x2="60" y2="60" stroke="currentColor" stroke-width="1.5" opacity="0.12"/>
      <line x1="38" y1="67" x2="55" y2="67" stroke="currentColor" stroke-width="1" opacity="0.08"/>
      <!-- Kolesá — detailné s ráfikmi -->
      <circle cx="58" cy="104" r="14" stroke="currentColor" stroke-width="2"/>
      <circle cx="58" cy="104" r="10" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>
      <circle cx="58" cy="104" r="5" stroke="currentColor" stroke-width="1.2" opacity="0.4"/>
      <circle cx="58" cy="104" r="1.5" fill="currentColor" opacity="0.5"/>
      <!-- Ráfik špice -->
      <line x1="58" y1="94" x2="58" y2="99" stroke="currentColor" stroke-width="0.8" opacity="0.2"/>
      <line x1="58" y1="109" x2="58" y2="114" stroke="currentColor" stroke-width="0.8" opacity="0.2"/>
      <line x1="48" y1="104" x2="53" y2="104" stroke="currentColor" stroke-width="0.8" opacity="0.2"/>
      <line x1="63" y1="104" x2="68" y2="104" stroke="currentColor" stroke-width="0.8" opacity="0.2"/>
      <circle cx="184" cy="104" r="14" stroke="currentColor" stroke-width="2"/>
      <circle cx="184" cy="104" r="10" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>
      <circle cx="184" cy="104" r="5" stroke="currentColor" stroke-width="1.2" opacity="0.4"/>
      <circle cx="184" cy="104" r="1.5" fill="currentColor" opacity="0.5"/>
      <line x1="184" y1="94" x2="184" y2="99" stroke="currentColor" stroke-width="0.8" opacity="0.2"/>
      <line x1="184" y1="109" x2="184" y2="114" stroke="currentColor" stroke-width="0.8" opacity="0.2"/>
      <line x1="174" y1="104" x2="179" y2="104" stroke="currentColor" stroke-width="0.8" opacity="0.2"/>
      <line x1="189" y1="104" x2="194" y2="104" stroke="currentColor" stroke-width="0.8" opacity="0.2"/>
      <!-- Blatník nad predným kolesom -->
      <path d="M168 100 C168 92 174 86 184 86 C194 86 200 92 200 100" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.3"/>
      <!-- Blatník nad zadným kolesom -->
      <path d="M42 100 C42 92 48 86 58 86 C68 86 74 92 74 100" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.3"/>
    </svg>`;

  // Tlačové produkty — kniha, časopis, vizitky, leták
  if (n.includes('tlač') || n.includes('print') || n.includes('tisk'))
    return `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- ═══ Kniha vzadu (stojí šikmo) ═══ -->
      <rect x="8" y="10" width="38" height="52" rx="2" stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.06" transform="rotate(-8 27 36)"/>
      <line x1="12" y1="14" x2="12" y2="58" stroke="currentColor" stroke-width="3" opacity="0.25" transform="rotate(-8 12 36)"/>
      <line x1="18" y1="22" x2="38" y2="20" stroke="currentColor" stroke-width="2" opacity="0.15"/>
      <line x1="18" y1="30" x2="34" y2="28" stroke="currentColor" stroke-width="1.5" opacity="0.1"/>
      <!-- ═══ Časopis/katalóg (ležiaci šikmo) ═══ -->
      <rect x="30" y="28" width="48" height="62" rx="2" stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.04" transform="rotate(5 54 59)"/>
      <!-- Obrázok na obálke časopisu -->
      <rect x="37" y="36" width="34" height="20" rx="2" fill="currentColor" opacity="0.1" transform="rotate(5 54 46)"/>
      <!-- Titulok -->
      <line x1="37" y1="64" x2="70" y2="66" stroke="currentColor" stroke-width="2.5" opacity="0.2" stroke-linecap="round"/>
      <line x1="37" y1="72" x2="62" y2="73" stroke="currentColor" stroke-width="2" opacity="0.12" stroke-linecap="round"/>
      <line x1="37" y1="79" x2="55" y2="80" stroke="currentColor" stroke-width="1.5" opacity="0.08" stroke-linecap="round"/>
      <!-- ═══ Leták/flyer (vpredu napravo) ═══ -->
      <rect x="62" y="18" width="34" height="46" rx="2" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.05" transform="rotate(3 79 41)"/>
      <!-- Obsah letáku -->
      <rect x="67" y="24" width="24" height="14" rx="1.5" fill="currentColor" opacity="0.08" transform="rotate(3 79 31)"/>
      <line x1="67" y1="44" x2="90" y2="45" stroke="currentColor" stroke-width="2" opacity="0.12" stroke-linecap="round"/>
      <line x1="67" y1="50" x2="85" y2="51" stroke="currentColor" stroke-width="1.5" opacity="0.08" stroke-linecap="round"/>
      <line x1="67" y1="56" x2="80" y2="57" stroke="currentColor" stroke-width="1.5" opacity="0.06" stroke-linecap="round"/>
      <!-- ═══ Vizitky (dole, rozložené) ═══ -->
      <!-- Vizitka 1 -->
      <rect x="10" y="82" width="42" height="26" rx="3" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.06" transform="rotate(-5 31 95)"/>
      <line x1="17" y1="90" x2="38" y2="89" stroke="currentColor" stroke-width="2" opacity="0.2" stroke-linecap="round"/>
      <line x1="17" y1="97" x2="32" y2="96" stroke="currentColor" stroke-width="1.5" opacity="0.1" stroke-linecap="round"/>
      <!-- Vizitka 2 (preložená) -->
      <rect x="38" y="86" width="42" height="26" rx="3" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.05" transform="rotate(4 59 99)"/>
      <circle cx="75" cy="93" r="4" stroke="currentColor" stroke-width="1.5" opacity="0.2"/>
      <line x1="45" y1="95" x2="66" y2="96" stroke="currentColor" stroke-width="2" opacity="0.15" stroke-linecap="round"/>
      <line x1="45" y1="101" x2="60" y2="102" stroke="currentColor" stroke-width="1.5" opacity="0.08" stroke-linecap="round"/>
      <!-- ═══ Záložka/brožúrka (vpravo dole) ═══ -->
      <rect x="82" y="70" width="30" height="42" rx="2" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.04" transform="rotate(-3 97 91)"/>
      <line x1="88" y1="78" x2="106" y2="77" stroke="currentColor" stroke-width="2" opacity="0.12" stroke-linecap="round"/>
      <line x1="88" y1="85" x2="102" y2="84" stroke="currentColor" stroke-width="1.5" opacity="0.08" stroke-linecap="round"/>
      <rect x="88" y="92" width="18" height="10" rx="1.5" fill="currentColor" opacity="0.06"/>
    </svg>`;

  // Svetelná reklama — svetelný box / kazetové písmeno na fasáde budovy
  if (n.includes('svetel') || n.includes('led') || n.includes('neon') || n.includes('osvetl'))
    return `<svg viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Budova / fasáda -->
      <rect x="15" y="8" width="210" height="124" rx="2" stroke="currentColor" stroke-width="1.5" opacity="0.2" fill="currentColor" fill-opacity="0.02"/>
      <!-- Tehly / textúra steny -->
      <line x1="15" y1="35" x2="225" y2="35" stroke="currentColor" stroke-width="0.5" opacity="0.05"/>
      <line x1="15" y1="60" x2="225" y2="60" stroke="currentColor" stroke-width="0.5" opacity="0.05"/>
      <line x1="15" y1="85" x2="225" y2="85" stroke="currentColor" stroke-width="0.5" opacity="0.05"/>
      <!-- ═══ Svetelný box — hlavný nápis ═══ -->
      <rect x="35" y="20" width="170" height="50" rx="4" stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.05"/>
      <!-- Vnútorný rám boxu -->
      <rect x="40" y="25" width="160" height="40" rx="2" stroke="currentColor" stroke-width="0.8" opacity="0.2"/>
      <!-- Svietiace písmená vnútri boxu -->
      <!-- A -->
      <path d="M58 58 L68 32 L78 58" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <line x1="62" y1="50" x2="74" y2="50" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <!-- D -->
      <line x1="88" y1="32" x2="88" y2="58" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <path d="M88 32 C106 32 106 58 88 58" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- S -->
      <path d="M120 36 C112 34 108 38 108 42 C108 48 120 48 120 54 C120 60 112 62 108 58" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- U -->
      <path d="M130 32 L130 52 C130 58 138 62 142 58 L142 32" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- N -->
      <line x1="152" y1="58" x2="152" y2="32" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <line x1="152" y1="32" x2="168" y2="58" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <line x1="168" y1="58" x2="168" y2="32" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <!-- Glow / žiarenie za písmenami -->
      <ellipse cx="120" cy="45" rx="60" ry="20" fill="currentColor" opacity="0.03"/>
      <!-- Žiarenie nadol z boxu -->
      <path d="M45 70 L55 82" stroke="currentColor" stroke-width="0.8" opacity="0.08"/>
      <path d="M90 70 L90 85" stroke="currentColor" stroke-width="0.8" opacity="0.08"/>
      <path d="M120 70 L120 88" stroke="currentColor" stroke-width="0.8" opacity="0.1"/>
      <path d="M150 70 L150 85" stroke="currentColor" stroke-width="0.8" opacity="0.08"/>
      <path d="M195 70 L185 82" stroke="currentColor" stroke-width="0.8" opacity="0.08"/>
      <!-- ═══ Svetelná výstrčka na boku ═══ -->
      <!-- Konzola -->
      <line x1="225" y1="40" x2="225" y2="55" stroke="currentColor" stroke-width="2" opacity="0.5"/>
      <line x1="225" y1="40" x2="235" y2="40" stroke="currentColor" stroke-width="2" opacity="0.5"/>
      <!-- Výstrčka - kruhová -->
      <circle cx="235" cy="52" r="12" stroke="currentColor" stroke-width="2" opacity="0.6"/>
      <circle cx="235" cy="52" r="8" stroke="currentColor" stroke-width="0.8" opacity="0.2"/>
      <!-- Montážne body -->
      <circle cx="40" cy="18" r="2" fill="currentColor" opacity="0.15"/>
      <circle cx="200" cy="18" r="2" fill="currentColor" opacity="0.15"/>
      <!-- Káble -->
      <path d="M35 70 L30 75 L30 95" stroke="currentColor" stroke-width="1" opacity="0.15"/>
      <!-- Dvere budovy -->
      <rect x="90" y="88" width="28" height="44" rx="2" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
      <rect x="93" y="91" width="10" height="20" rx="1" stroke="currentColor" stroke-width="0.8" opacity="0.15" fill="currentColor" fill-opacity="0.02"/>
      <rect x="105" y="91" width="10" height="20" rx="1" stroke="currentColor" stroke-width="0.8" opacity="0.15" fill="currentColor" fill-opacity="0.02"/>
      <circle cx="113" cy="112" r="1.5" fill="currentColor" opacity="0.2"/>
    </svg>`;

  // Veľkoformátová tlač — roll-up banner + veľký plagát
  if (n.includes('veľkoformát') || n.includes('velkoformat') || n.includes('wide'))
    return `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- ═══ Roll-up banner (hlavný prvok) ═══ -->
      <!-- Základňa roll-upu -->
      <rect x="22" y="108" width="50" height="6" rx="2" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.08"/>
      <!-- Tyč -->
      <line x1="47" y1="108" x2="47" y2="8" stroke="currentColor" stroke-width="2" opacity="0.4"/>
      <!-- Háčik hore -->
      <circle cx="47" cy="6" r="3" stroke="currentColor" stroke-width="1.5" opacity="0.35"/>
      <!-- Plátno banneru -->
      <rect x="25" y="8" width="44" height="100" rx="2" stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.05"/>
      <!-- Grafika na banneri — veľký obrázok hore -->
      <rect x="31" y="16" width="32" height="24" rx="3" fill="currentColor" opacity="0.1"/>
      <!-- Headline -->
      <line x1="31" y1="48" x2="63" y2="48" stroke="currentColor" stroke-width="3" opacity="0.2" stroke-linecap="round"/>
      <line x1="31" y1="56" x2="58" y2="56" stroke="currentColor" stroke-width="2.5" opacity="0.12" stroke-linecap="round"/>
      <!-- Text -->
      <line x1="31" y1="66" x2="63" y2="66" stroke="currentColor" stroke-width="1.5" opacity="0.08" stroke-linecap="round"/>
      <line x1="31" y1="73" x2="55" y2="73" stroke="currentColor" stroke-width="1.5" opacity="0.06" stroke-linecap="round"/>
      <!-- Logo dole -->
      <circle cx="47" cy="90" r="7" stroke="currentColor" stroke-width="1.5" opacity="0.15"/>
      <!-- Nožička roll-upu -->
      <line x1="28" y1="114" x2="38" y2="114" stroke="currentColor" stroke-width="1.5" opacity="0.2"/>
      <line x1="56" y1="114" x2="66" y2="114" stroke="currentColor" stroke-width="1.5" opacity="0.2"/>
      <!-- ═══ Veľký plagát vzadu (za roll-upom) ═══ -->
      <rect x="72" y="15" width="40" height="56" rx="2" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.04" transform="rotate(3 92 43)"/>
      <!-- Obrázok na plagáte -->
      <rect x="78" y="22" width="28" height="16" rx="2" fill="currentColor" opacity="0.07" transform="rotate(3 92 30)"/>
      <line x1="78" y1="44" x2="106" y2="45" stroke="currentColor" stroke-width="2" opacity="0.12" stroke-linecap="round"/>
      <line x1="78" y1="52" x2="100" y2="53" stroke="currentColor" stroke-width="1.5" opacity="0.08" stroke-linecap="round"/>
      <line x1="78" y1="59" x2="95" y2="60" stroke="currentColor" stroke-width="1.5" opacity="0.06" stroke-linecap="round"/>
      <!-- ═══ Rolka média (dole vpravo) ═══ -->
      <ellipse cx="92" cy="100" rx="18" ry="8" stroke="currentColor" stroke-width="2" opacity="0.35" fill="currentColor" fill-opacity="0.03"/>
      <ellipse cx="92" cy="100" rx="8" ry="4" stroke="currentColor" stroke-width="1.5" opacity="0.2"/>
      <ellipse cx="92" cy="100" rx="3" ry="1.5" fill="currentColor" opacity="0.15"/>
      <!-- Rola papier vychádzajúci -->
      <path d="M74 100 L74 85" stroke="currentColor" stroke-width="1.5" opacity="0.15"/>
    </svg>`;

  // PVC plachty / inštalácie — plachta napnutá s očkami + montáž
  if (n.includes('placht') || n.includes('inštalác') || n.includes('instalac') || n.includes('montáž'))
    return `<svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Konštrukcia / rám -->
      <rect x="20" y="15" width="160" height="95" rx="2" stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.04"/>
      <!-- Očká na uchytenie -->
      <circle cx="20" cy="15" r="5" stroke="currentColor" stroke-width="2" opacity="0.8"/>
      <circle cx="100" cy="15" r="5" stroke="currentColor" stroke-width="2" opacity="0.8"/>
      <circle cx="180" cy="15" r="5" stroke="currentColor" stroke-width="2" opacity="0.8"/>
      <circle cx="20" cy="110" r="5" stroke="currentColor" stroke-width="2" opacity="0.8"/>
      <circle cx="100" cy="110" r="5" stroke="currentColor" stroke-width="2" opacity="0.8"/>
      <circle cx="180" cy="110" r="5" stroke="currentColor" stroke-width="2" opacity="0.8"/>
      <!-- Laná / uchytenia -->
      <line x1="20" y1="10" x2="15" y2="2" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>
      <line x1="180" y1="10" x2="185" y2="2" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>
      <line x1="20" y1="115" x2="15" y2="128" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>
      <line x1="180" y1="115" x2="185" y2="128" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>
      <!-- Obsah plachty — grafika -->
      <rect x="35" y="30" width="50" height="35" rx="2" fill="currentColor" opacity="0.08"/>
      <line x1="95" y1="38" x2="165" y2="38" stroke="currentColor" stroke-width="2.5" opacity="0.25"/>
      <line x1="95" y1="48" x2="158" y2="48" stroke="currentColor" stroke-width="1.5" opacity="0.18"/>
      <line x1="95" y1="56" x2="140" y2="56" stroke="currentColor" stroke-width="1.5" opacity="0.12"/>
      <!-- Telefón / kontakt -->
      <line x1="35" y1="82" x2="90" y2="82" stroke="currentColor" stroke-width="1.5" opacity="0.15"/>
      <line x1="35" y1="92" x2="75" y2="92" stroke="currentColor" stroke-width="1" opacity="0.1"/>
      <!-- Kľúč / montáž ikona -->
      <path d="M155 78 L165 68" stroke="currentColor" stroke-width="2" opacity="0.3" stroke-linecap="round"/>
      <circle cx="168" cy="65" r="6" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
      <line x1="150" y1="83" x2="147" y2="90" stroke="currentColor" stroke-width="2" opacity="0.2" stroke-linecap="round"/>
    </svg>`;

  // Oblečenie / textil — detailné tričko na vešiaku s potlačou
  if (n.includes('obleč') || n.includes('oblec') || n.includes('textil') || n.includes('tričk'))
    return `<svg viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Vešiak -->
      <circle cx="120" cy="6" r="4" stroke="currentColor" stroke-width="1.5" opacity="0.35"/>
      <line x1="120" y1="10" x2="120" y2="18" stroke="currentColor" stroke-width="1.5" opacity="0.35"/>
      <path d="M68 38 L120 18 L172 38" stroke="currentColor" stroke-width="2" opacity="0.3" fill="none"/>
      <!-- ═══ Tričko — detailný tvar ═══ -->
      <!-- Ľavý rukáv -->
      <path d="M68 38 L38 55 L32 72 L48 78 L60 58 L72 50" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.04" stroke-linejoin="round"/>
      <!-- Pravý rukáv -->
      <path d="M172 38 L202 55 L208 72 L192 78 L180 58 L168 50" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.04" stroke-linejoin="round"/>
      <!-- Hlavné telo trička -->
      <path d="M72 50 L72 135 C72 138 75 140 78 140 L162 140 C165 140 168 138 168 135 L168 50" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.03"/>
      <!-- Golier (V-neck) -->
      <path d="M98 28 L110 18 L120 18 L130 18 L142 28" stroke="currentColor" stroke-width="2" fill="none" opacity="0.5"/>
      <path d="M98 28 L120 42 L142 28" stroke="currentColor" stroke-width="1.8" fill="currentColor" fill-opacity="0.04" opacity="0.6"/>
      <!-- Švy na ramenách -->
      <line x1="72" y1="50" x2="98" y2="28" stroke="currentColor" stroke-width="1" opacity="0.15"/>
      <line x1="168" y1="50" x2="142" y2="28" stroke="currentColor" stroke-width="1" opacity="0.15"/>
      <!-- Švy na rukávoch -->
      <line x1="48" y1="78" x2="60" y2="58" stroke="currentColor" stroke-width="0.8" opacity="0.1"/>
      <line x1="192" y1="78" x2="180" y2="58" stroke="currentColor" stroke-width="0.8" opacity="0.1"/>
      <!-- ═══ Potlač na hrudi ═══ -->
      <rect x="88" y="58" width="64" height="42" rx="4" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 3" opacity="0.3"/>
      <!-- Logo v oblasti potlače -->
      <circle cx="108" cy="72" r="8" stroke="currentColor" stroke-width="1.2" opacity="0.2"/>
      <path d="M105 72 L108 68 L111 72 L108 76 Z" fill="currentColor" opacity="0.15"/>
      <!-- Text potlače -->
      <line x1="120" y1="68" x2="145" y2="68" stroke="currentColor" stroke-width="2" opacity="0.15"/>
      <line x1="120" y1="76" x2="140" y2="76" stroke="currentColor" stroke-width="1.2" opacity="0.1"/>
      <line x1="95" y1="88" x2="145" y2="88" stroke="currentColor" stroke-width="1.5" opacity="0.1"/>
      <!-- Spodný lem -->
      <path d="M72 135 L168 135" stroke="currentColor" stroke-width="1.2" opacity="0.15"/>
      <!-- Lem rukávov -->
      <path d="M32 72 L48 78" stroke="currentColor" stroke-width="1.2" opacity="0.15"/>
      <path d="M208 72 L192 78" stroke="currentColor" stroke-width="1.2" opacity="0.15"/>
      <!-- Záhyby látky -->
      <path d="M95 100 L95 135" stroke="currentColor" stroke-width="0.6" opacity="0.06"/>
      <path d="M145 100 L145 135" stroke="currentColor" stroke-width="0.6" opacity="0.06"/>
    </svg>`;

  // Samolepky / nálepky — detailný arch samolepiek s odlepovaním
  if (n.includes('samolep') || n.includes('nálep') || n.includes('etike'))
    return `<svg viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Tieň -->
      <ellipse cx="115" cy="143" rx="80" ry="4" fill="currentColor" opacity="0.04"/>
      <!-- ═══ Arch (podkladový papier) ═══ -->
      <rect x="25" y="12" width="155" height="120" rx="5" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.03"/>
      <!-- Ohnutý roh archu -->
      <path d="M180 12 L180 32 L160 12 Z" stroke="currentColor" stroke-width="1.5" opacity="0.2" fill="currentColor" fill-opacity="0.06"/>
      <line x1="160" y1="12" x2="180" y2="32" stroke="currentColor" stroke-width="1.5" opacity="0.15"/>
      <!-- ═══ Samolepky na archu — rôzne tvary ═══ -->
      <!-- Riadok 1 — kruhové -->
      <circle cx="55" cy="38" r="14" stroke="currentColor" stroke-width="1.5" opacity="0.6" fill="currentColor" fill-opacity="0.05"/>
      <circle cx="55" cy="38" r="6" stroke="currentColor" stroke-width="0.8" opacity="0.2"/>
      <circle cx="95" cy="38" r="14" stroke="currentColor" stroke-width="1.5" opacity="0.6" fill="currentColor" fill-opacity="0.05"/>
      <line x1="87" y1="38" x2="103" y2="38" stroke="currentColor" stroke-width="1.5" opacity="0.15"/>
      <circle cx="135" cy="38" r="14" stroke="currentColor" stroke-width="1.5" opacity="0.6" fill="currentColor" fill-opacity="0.05"/>
      <circle cx="135" cy="38" r="6" stroke="currentColor" stroke-width="0.8" opacity="0.2"/>
      <!-- Riadok 2 — zaoblené obdĺžniky -->
      <rect x="37" y="60" width="36" height="20" rx="10" stroke="currentColor" stroke-width="1.5" opacity="0.55" fill="currentColor" fill-opacity="0.04"/>
      <line x1="44" y1="70" x2="66" y2="70" stroke="currentColor" stroke-width="1.2" opacity="0.12"/>
      <rect x="81" y="60" width="36" height="20" rx="10" stroke="currentColor" stroke-width="1.5" opacity="0.55" fill="currentColor" fill-opacity="0.04"/>
      <line x1="88" y1="70" x2="110" y2="70" stroke="currentColor" stroke-width="1.2" opacity="0.12"/>
      <rect x="125" y="60" width="36" height="20" rx="10" stroke="currentColor" stroke-width="1.5" opacity="0.55" fill="currentColor" fill-opacity="0.04"/>
      <!-- Riadok 3 — štvorcové s logom -->
      <rect x="37" y="88" width="26" height="26" rx="4" stroke="currentColor" stroke-width="1.5" opacity="0.5" fill="currentColor" fill-opacity="0.04"/>
      <path d="M46 98 L50 94 L54 98 L50 102 Z" fill="currentColor" opacity="0.15"/>
      <rect x="71" y="88" width="26" height="26" rx="4" stroke="currentColor" stroke-width="1.5" opacity="0.5" fill="currentColor" fill-opacity="0.04"/>
      <circle cx="84" cy="101" r="5" stroke="currentColor" stroke-width="0.8" opacity="0.2"/>
      <rect x="105" y="88" width="26" height="26" rx="4" stroke="currentColor" stroke-width="1.5" opacity="0.45" fill="currentColor" fill-opacity="0.03"/>
      <!-- ═══ Odlepená samolepka — efekt peeling ═══ -->
      <!-- Tieň odlepenej -->
      <ellipse cx="198" cy="115" rx="22" ry="3" fill="currentColor" opacity="0.06"/>
      <!-- Odlepená samolepka letí -->
      <rect x="178" y="78" width="48" height="32" rx="8" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.06" transform="rotate(-12 202 94)"/>
      <!-- Logo na odlepenej -->
      <circle cx="198" cy="90" r="6" stroke="currentColor" stroke-width="1.2" opacity="0.3" transform="rotate(-12 198 90)"/>
      <!-- Efekt odlepenia — krivka -->
      <path d="M140 92 C150 88 165 82 178 82" stroke="currentColor" stroke-width="1" opacity="0.15" fill="none" stroke-dasharray="3 2"/>
      <!-- Prázdne miesto na archu kde bola samolepka -->
      <rect x="139" y="88" width="26" height="26" rx="4" stroke="currentColor" stroke-width="1" opacity="0.15" stroke-dasharray="4 3"/>
      <!-- Rezacie línie na archu -->
      <line x1="33" y1="55" x2="167" y2="55" stroke="currentColor" stroke-width="0.5" opacity="0.06"/>
      <line x1="33" y1="84" x2="167" y2="84" stroke="currentColor" stroke-width="0.5" opacity="0.06"/>
    </svg>`;

  // Default — elegantná izometrická krabica s produktom
  return `<svg viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Tieň -->
    <ellipse cx="120" cy="138" rx="65" ry="6" fill="currentColor" opacity="0.05"/>
    <!-- Krabica — zadná strana -->
    <path d="M120 15 L200 45 L200 110 L120 135 L40 110 L40 45 Z" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.03"/>
    <!-- Krabica — predná strana (ľavá) -->
    <path d="M40 45 L120 70 L120 135 L40 110 Z" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.05"/>
    <!-- Krabica — predná strana (pravá) -->
    <path d="M200 45 L120 70 L120 135 L200 110 Z" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.02"/>
    <!-- Vrchná strana -->
    <path d="M120 15 L200 45 L120 70 L40 45 Z" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.06"/>
    <!-- Stredová hrana -->
    <line x1="120" y1="70" x2="120" y2="135" stroke="currentColor" stroke-width="2" opacity="0.4"/>
    <!-- Horné hrany -->
    <line x1="40" y1="45" x2="120" y2="70" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
    <line x1="200" y1="45" x2="120" y2="70" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
    <!-- Páska na krabici -->
    <line x1="120" y1="15" x2="120" y2="70" stroke="currentColor" stroke-width="3" opacity="0.15"/>
    <line x1="120" y1="70" x2="120" y2="135" stroke="currentColor" stroke-width="3" opacity="0.08"/>
    <!-- Štítok na ľavej strane -->
    <rect x="55" y="72" width="40" height="24" rx="2" stroke="currentColor" stroke-width="1.2" opacity="0.25" fill="currentColor" fill-opacity="0.04" transform="skewY(12)"/>
    <line x1="62" y1="82" x2="86" y2="88" stroke="currentColor" stroke-width="1.5" opacity="0.12" transform="skewY(12)"/>
    <line x1="62" y1="88" x2="80" y2="92" stroke="currentColor" stroke-width="1" opacity="0.08" transform="skewY(12)"/>
  </svg>`;
}

// SVG ikony pre vlastné produkty — podľa kategórie/popisu/názvu
function getProductSvg(product: ClientProduct): string {
  const text = `${product.name} ${product.description || ''} ${product.category}`.toLowerCase();

  // Vizitky
  if (text.includes('vizitk') || text.includes('business card'))
    return `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="18" width="64" height="40" rx="4" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.06"/>
      <rect x="12" y="22" width="56" height="32" rx="2" stroke="currentColor" stroke-width="1" opacity="0.15"/>
      <circle cx="26" cy="34" r="6" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
      <line x1="38" y1="30" x2="62" y2="30" stroke="currentColor" stroke-width="2" opacity="0.35" stroke-linecap="round"/>
      <line x1="38" y1="37" x2="56" y2="37" stroke="currentColor" stroke-width="1.5" opacity="0.2" stroke-linecap="round"/>
      <line x1="38" y1="43" x2="50" y2="43" stroke="currentColor" stroke-width="1" opacity="0.15" stroke-linecap="round"/>
      <line x1="18" y1="48" x2="34" y2="48" stroke="currentColor" stroke-width="1" opacity="0.12" stroke-linecap="round"/>
      <!-- Druhá vizitka za -->
      <rect x="14" y="24" width="56" height="36" rx="3" stroke="currentColor" stroke-width="1" opacity="0.08" transform="translate(4, -8) rotate(3, 42, 40)"/>
    </svg>`;

  // Polepy áut / autá
  if (text.includes('polep') && (text.includes('aut') || text.includes('car') || text.includes('dodáv') || text.includes('vozid')))
    return `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Karoséria -->
      <path d="M8 52 L8 44 Q8 40 12 40 L24 40 L30 28 Q32 24 36 24 L56 24 Q60 24 62 28 L68 40 Q72 40 72 44 L72 52" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.06" stroke-linejoin="round"/>
      <!-- Okná -->
      <path d="M31 40 L35 30 Q36 28 38 28 L50 28 L50 40 Z" stroke="currentColor" stroke-width="1.2" opacity="0.3" fill="currentColor" fill-opacity="0.04"/>
      <path d="M52 28 L58 28 Q60 28 61 30 L66 40 L52 40 Z" stroke="currentColor" stroke-width="1.2" opacity="0.3" fill="currentColor" fill-opacity="0.04"/>
      <!-- Podvozok -->
      <line x1="6" y1="52" x2="74" y2="52" stroke="currentColor" stroke-width="2" opacity="0.4"/>
      <!-- Koleso predné -->
      <circle cx="22" cy="52" r="7" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.08"/>
      <circle cx="22" cy="52" r="3" stroke="currentColor" stroke-width="1" opacity="0.3"/>
      <!-- Koleso zadné -->
      <circle cx="60" cy="52" r="7" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.08"/>
      <circle cx="60" cy="52" r="3" stroke="currentColor" stroke-width="1" opacity="0.3"/>
      <!-- Polep vzor -->
      <path d="M14 42 Q25 38 40 42 Q55 46 66 42" stroke="currentColor" stroke-width="1.5" opacity="0.25" stroke-dasharray="3 2"/>
      <rect x="36" y="34" width="16" height="5" rx="1" fill="currentColor" opacity="0.12"/>
    </svg>`;

  // PVC fólia / fólie
  if (text.includes('fóli') || text.includes('pvc') || text.includes('foil') || text.includes('rezané grafiky') || text.includes('rezan'))
    return `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Rolka fólie -->
      <ellipse cx="22" cy="40" rx="6" ry="18" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.06"/>
      <ellipse cx="22" cy="40" rx="3" ry="10" stroke="currentColor" stroke-width="1" opacity="0.2"/>
      <!-- Odvinutá fólia -->
      <path d="M28 24 L64 18 Q68 17 68 21 L68 55 Q68 59 64 58 L28 56" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0.04"/>
      <!-- Vzor na fólii -->
      <rect x="36" y="28" width="22" height="10" rx="2" stroke="currentColor" stroke-width="1" opacity="0.2" fill="currentColor" fill-opacity="0.06"/>
      <line x1="36" y1="44" x2="58" y2="44" stroke="currentColor" stroke-width="1.5" opacity="0.15" stroke-linecap="round"/>
      <line x1="36" y1="50" x2="52" y2="50" stroke="currentColor" stroke-width="1" opacity="0.1" stroke-linecap="round"/>
      <!-- Nožnice / rezanie -->
      <path d="M62 12 L56 20" stroke="currentColor" stroke-width="1.5" opacity="0.3" stroke-linecap="round"/>
      <path d="M58 10 L52 18" stroke="currentColor" stroke-width="1.5" opacity="0.3" stroke-linecap="round"/>
    </svg>`;

  // Tlač / print
  if (text.includes('tlač') || text.includes('print') || text.includes('tisk') || text.includes('leták') || text.includes('brožúr'))
    return `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Tlačiareň -->
      <rect x="10" y="30" width="60" height="28" rx="4" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.06"/>
      <!-- Podávač papiera -->
      <rect x="18" y="12" width="44" height="20" rx="2" stroke="currentColor" stroke-width="1.5" opacity="0.3" fill="currentColor" fill-opacity="0.03"/>
      <!-- Výstupný papier -->
      <rect x="20" y="56" width="40" height="16" rx="2" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0.08"/>
      <line x1="26" y1="62" x2="52" y2="62" stroke="currentColor" stroke-width="1.5" opacity="0.2" stroke-linecap="round"/>
      <line x1="26" y1="67" x2="46" y2="67" stroke="currentColor" stroke-width="1" opacity="0.12" stroke-linecap="round"/>
      <!-- Panel tlačiarne -->
      <rect x="50" y="36" width="14" height="8" rx="2" stroke="currentColor" stroke-width="1" opacity="0.25" fill="currentColor" fill-opacity="0.05"/>
      <circle cx="56" cy="40" r="1.5" fill="currentColor" opacity="0.3"/>
      <!-- Slot -->
      <line x1="16" y1="47" x2="48" y2="47" stroke="currentColor" stroke-width="1" opacity="0.15" stroke-linecap="round"/>
    </svg>`;

  // Samolepky
  if (text.includes('samolep') || text.includes('sticker') || text.includes('nálepk'))
    return `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="60" height="60" rx="6" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.04"/>
      <rect x="18" y="18" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5" opacity="0.3" fill="currentColor" fill-opacity="0.06"/>
      <rect x="44" y="18" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5" opacity="0.3" fill="currentColor" fill-opacity="0.06"/>
      <rect x="18" y="44" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5" opacity="0.3" fill="currentColor" fill-opacity="0.06"/>
      <rect x="44" y="44" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5" opacity="0.25" fill="currentColor" fill-opacity="0.04"/>
      <!-- Jeden sa lúpe -->
      <path d="M50 58 Q52 54 56 52 Q60 52 62 50" stroke="currentColor" stroke-width="1" opacity="0.2"/>
    </svg>`;

  // Oblečenie / textil
  if (text.includes('obleč') || text.includes('tričk') || text.includes('textile') || text.includes('potlač'))
    return `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M26 14 L22 14 L8 26 L16 34 L22 28 L22 68 L58 68 L58 28 L64 34 L72 26 L58 14 L54 14 Q52 22 40 22 Q28 22 26 14 Z" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.06" stroke-linejoin="round"/>
      <path d="M26 14 Q28 22 40 22 Q52 22 54 14" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
      <rect x="30" y="36" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1" opacity="0.2" fill="currentColor" fill-opacity="0.04"/>
    </svg>`;

  // Billboard
  if (text.includes('billboard') || text.includes('bigboard'))
    return `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="28" y1="50" x2="28" y2="72" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="52" y1="50" x2="52" y2="72" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="6" y="10" width="68" height="40" rx="3" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.06"/>
      <line x1="14" y1="22" x2="46" y2="22" stroke="currentColor" stroke-width="2" opacity="0.2" stroke-linecap="round"/>
      <line x1="14" y1="30" x2="38" y2="30" stroke="currentColor" stroke-width="1.5" opacity="0.12" stroke-linecap="round"/>
      <rect x="50" y="18" width="18" height="14" rx="2" fill="currentColor" opacity="0.08"/>
    </svg>`;

  // Svetelná reklama
  if (text.includes('svetel') || text.includes('neon') || text.includes('led') || text.includes('light'))
    return `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="20" width="60" height="30" rx="4" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.05"/>
      <text x="40" y="40" text-anchor="middle" font-size="14" font-weight="bold" fill="currentColor" opacity="0.4">AD</text>
      <line x1="18" y1="56" x2="18" y2="66" stroke="currentColor" stroke-width="1.5" opacity="0.2"/>
      <line x1="62" y1="56" x2="62" y2="66" stroke="currentColor" stroke-width="1.5" opacity="0.2"/>
      <!-- Žiara -->
      <line x1="14" y1="14" x2="18" y2="18" stroke="currentColor" stroke-width="1" opacity="0.15"/>
      <line x1="40" y1="10" x2="40" y2="16" stroke="currentColor" stroke-width="1" opacity="0.15"/>
      <line x1="66" y1="14" x2="62" y2="18" stroke="currentColor" stroke-width="1" opacity="0.15"/>
    </svg>`;

  // Veľkoformát
  if (text.includes('veľkoform') || text.includes('roll') || text.includes('banner') || text.includes('placht'))
    return `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="8" width="40" height="56" rx="2" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.05"/>
      <line x1="28" y1="20" x2="52" y2="20" stroke="currentColor" stroke-width="2" opacity="0.2" stroke-linecap="round"/>
      <line x1="28" y1="28" x2="48" y2="28" stroke="currentColor" stroke-width="1.5" opacity="0.12" stroke-linecap="round"/>
      <rect x="28" y="34" width="24" height="16" rx="2" fill="currentColor" opacity="0.08"/>
      <!-- Stojan -->
      <line x1="40" y1="64" x2="40" y2="72" stroke="currentColor" stroke-width="2" opacity="0.3"/>
      <line x1="28" y1="72" x2="52" y2="72" stroke="currentColor" stroke-width="2" opacity="0.3" stroke-linecap="round"/>
    </svg>`;

  // Default — generický produkt (krabica s logom)
  return `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="20" width="52" height="44" rx="4" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.06"/>
    <line x1="14" y1="32" x2="66" y2="32" stroke="currentColor" stroke-width="1.5" opacity="0.2"/>
    <rect x="34" y="24" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.5" opacity="0.3" fill="currentColor" fill-opacity="0.05"/>
    <line x1="26" y1="42" x2="54" y2="42" stroke="currentColor" stroke-width="1.5" opacity="0.15" stroke-linecap="round"/>
    <line x1="26" y1="50" x2="46" y2="50" stroke="currentColor" stroke-width="1" opacity="0.1" stroke-linecap="round"/>
  </svg>`;
}
*/ // end of legacy getCategorySvg/getProductSvg comment

function shortenCompanyName(name: string): string {
  return name
    .replace(/,?\s*(s\.r\.o\.|spol\.\s*s\s*r\.\s*o\.|a\.s\.|s\.e\.)/gi, '')
    .trim();
}

function InquiryForm({ collapsed = false }: { collapsed?: boolean }) {
  const [open, setOpen] = useState(!collapsed);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('message', message);
      for (const f of files) formData.append('files', f);

      const res = await fetch('/api/proxy/inquiry', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setResult({ ok: true, text: 'Dopyt bol odoslaný. Kópia bola zaslaná na váš email.' });
        setMessage('');
        setFiles([]);
      } else {
        const data = await res.json().catch(() => ({}));
        setResult({ ok: false, text: data.error || 'Chyba pri odosielaní' });
      }
    } catch {
      setResult({ ok: false, text: 'Chyba pripojenia k serveru' });
    } finally {
      setSending(false);
    }
  }

  function removeFile(idx: number) {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  }

  if (collapsed && !open) {
    return (
      <div className="mt-8">
        <button
          onClick={() => setOpen(true)}
          className="glass-card p-5 w-full flex items-center gap-4 group hover:border-adsun-orange/30 transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-adsun-orange/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-adsun-orange" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <div>
            <p className="text-white font-medium text-sm group-hover:text-adsun-orange transition-colors">Nenašli ste čo hľadáte?</p>
            <p className="text-adsun-muted text-xs">Pošlite nám dopyt s popisom a prípadnou prílohou</p>
          </div>
          <svg className="w-5 h-5 text-adsun-muted ml-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 text-adsun-orange" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          Poslať dopyt
        </h3>
        {collapsed && (
          <button onClick={() => setOpen(false)} className="text-adsun-muted hover:text-white text-sm">
            Zavrieť
          </button>
        )}
      </div>

      {result?.ok ? (
        <div className="rounded-lg p-4 bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          {result.text}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Popíšte čo hľadáte, aký produkt alebo službu potrebujete..."
              rows={4}
              className="w-full resize-none"
              required
            />
          </div>

          {/* File attachments */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.ai,.psd,.eps,.svg,.tiff,.cdr,.indd,.doc,.docx,.xls,.xlsx"
              onChange={(e) => {
                if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary text-xs flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
              </svg>
              Priložiť súbor
            </button>

            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-adsun-muted bg-white/5 rounded px-2 py-1">
                    <span className="truncate flex-1">{f.name}</span>
                    <span className="text-[10px] flex-shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
                    <button type="button" onClick={() => removeFile(i)} className="text-red-400 hover:text-red-300 flex-shrink-0">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {result && !result.ok && (
            <div className="rounded-lg p-3 text-sm bg-red-500/10 border border-red-500/30 text-red-400">
              {result.text}
            </div>
          )}

          <button type="submit" disabled={sending || !message.trim()} className="btn-primary flex items-center gap-2">
            {sending ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Odosielam...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
                Odoslať dopyt
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ProductsCatalog({ categories, clientProducts, clientName }: Props) {
  const [search, setSearch] = useState('');
  const [browsePath, setBrowsePath] = useState<{ id: string; name: string }[]>([]);
  const [loadedCategory, setLoadedCategory] = useState<{
    children: any[];
    templates: CatalogTemplate[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Current category level (from initial tree or loaded data)
  const currentItems = useMemo(() => {
    if (browsePath.length === 0) return categories;
    if (loadedCategory) return loadedCategory.children;
    // Fallback: find in tree
    let items: CategoryNode[] = categories;
    for (const step of browsePath) {
      const found = items.find((c) => c.id === step.id);
      if (found) {
        items = found.children;
      }
    }
    return items;
  }, [categories, browsePath, loadedCategory]);

  // Templates at current level
  const currentTemplates = useMemo(() => {
    if (loadedCategory) return loadedCategory.templates;
    return [];
  }, [loadedCategory]);

  // Search filter for client products
  const filteredClientProducts = useMemo(() => {
    if (!search.trim()) return clientProducts;
    const q = search.toLowerCase().trim();
    return clientProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.clientName || '').toLowerCase().includes(q),
    );
  }, [clientProducts, search]);

  // Group client products by company
  const groupedByCompany = useMemo(() => {
    const groups = new Map<string, ClientProduct[]>();
    for (const p of filteredClientProducts) {
      const key = p.clientName || 'Ostatné produkty';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(p);
    }
    return Array.from(groups.entries());
  }, [filteredClientProducts]);

  // Do we have multiple companies?
  const hasMultipleCompanies = groupedByCompany.length > 1;

  // Search filter for categories
  const filteredCategories = useMemo(() => {
    if (!search.trim() || browsePath.length > 0) return currentItems;
    const q = search.toLowerCase().trim();
    function searchTree(nodes: CategoryNode[]): CategoryNode[] {
      const results: CategoryNode[] = [];
      for (const node of nodes) {
        if (
          node.name.toLowerCase().includes(q) ||
          (node.description || '').toLowerCase().includes(q)
        ) {
          results.push(node);
        }
        results.push(...searchTree(node.children));
      }
      return results;
    }
    return searchTree(categories);
  }, [currentItems, categories, search, browsePath]);

  async function navigateToCategory(categoryId: string, categoryName: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/proxy/products/categories/${categoryId}`);
      const data = await res.json();

      if (res.ok) {
        setBrowsePath((prev) => [...prev, { id: categoryId, name: categoryName }]);
        setLoadedCategory({
          children: data.children || [],
          templates: data.templates || [],
        });
      }
    } catch (err) {
      console.error('Failed to load category:', err);
    } finally {
      setLoading(false);
    }
  }

  async function navigateToBreadcrumb(index: number) {
    if (index === -1) {
      // Go to root
      setBrowsePath([]);
      setLoadedCategory(null);
      return;
    }

    const targetPath = browsePath.slice(0, index + 1);
    const targetId = targetPath[targetPath.length - 1].id;

    setLoading(true);
    try {
      const res = await fetch(`/api/proxy/products/categories/${targetId}`);
      const data = await res.json();

      if (res.ok) {
        setBrowsePath(targetPath);
        setLoadedCategory({
          children: data.children || [],
          templates: data.templates || [],
        });
      }
    } catch (err) {
      console.error('Failed to load category:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="glass-card p-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-adsun-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Hľadať produkt alebo kategóriu..."
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* ──── BREADCRUMB NAVIGATION ──── */}
      {browsePath.length > 0 && (
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <button
            onClick={() => navigateToBreadcrumb(-1)}
            className="flex items-center gap-1 text-adsun-muted hover:text-adsun-orange transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Katalóg
          </button>
          {browsePath.map((step, i) => (
            <span key={step.id} className="flex items-center gap-2">
              <span className="text-adsun-muted">›</span>
              {i < browsePath.length - 1 ? (
                <button
                  onClick={() => navigateToBreadcrumb(i)}
                  className="text-adsun-muted hover:text-adsun-orange transition-colors"
                >
                  {step.name}
                </button>
              ) : (
                <span className="text-white font-medium">{step.name}</span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* ──── LOADING STATE ──── */}
      {loading && (
        <div className="glass-card p-12 text-center">
          <div className="w-8 h-8 border-2 border-adsun-orange border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-adsun-muted text-sm">Načítavam...</p>
        </div>
      )}

      {/* ──── CATEGORY CARDS ──── */}
      {!loading && filteredCategories.length > 0 && (() => {
        // Na koreňovej úrovni: filtrujeme len Tlačové produkty + Billboardy externý link
        // Vnútri podkategórií: zobrazíme VŠETKY deti bez filtrovania
        const isRoot = browsePath.length === 0;
        // Skryté kategórie — nezobrazovať klientom
        const HIDDEN_CATEGORIES = ['veľkoformátová tlač'];
        const categoriesToShow = (isRoot
          ? filteredCategories.filter((cat: any) => {
              const n = (cat.name || '').toLowerCase();
              return n.includes('tlač') || n.includes('print') || n.includes('tisk');
            })
          : filteredCategories
        ).filter((cat: any) => {
          const n = (cat.name || '').toLowerCase();
          return !HIDDEN_CATEGORIES.some((h) => n.includes(h));
        });

        return categoriesToShow.length > 0 || isRoot ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10">
          {categoriesToShow.map((cat: any) => {
            const CatIcon = getCategoryIcon(cat.name, cat.description);
            const itemLabel = cat.templateCount > 0
              ? `${cat.templateCount} produktov`
              : cat.children?.length > 0
                ? `${cat.children.length} podkategórií`
                : '';

            return (
            <button
              key={cat.id}
              onClick={() => navigateToCategory(cat.id, cat.name)}
              className="category-card group cursor-pointer flex flex-col items-center text-center"
            >
              {/* Lucide ikona */}
              <div className="w-full max-w-[220px] aspect-[5/3] mb-4 flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at 50% 60%, rgba(248,153,29,0.15) 0%, transparent 65%)',
                  }}
                />
                <CatIcon
                  className="w-16 h-16 text-white/40 group-hover:text-adsun-orange/70 transition-colors duration-500"
                  strokeWidth={1.2}
                />
              </div>

              <h3 className="text-white font-bold text-sm italic leading-tight group-hover:text-adsun-orange transition-colors duration-300 mb-1">
                {cat.name}
              </h3>

              {cat.description && (
                <p className="text-white/35 text-[11px] italic line-clamp-2 leading-relaxed mb-2 px-2 max-w-[220px]">{cat.description}</p>
              )}

              {itemLabel && (
                <p className="text-white/20 text-[10px] uppercase tracking-wider font-medium mb-3">{itemLabel}</p>
              )}

              <span className="mt-auto inline-flex items-center gap-1.5 border border-adsun-orange/50 text-adsun-orange text-[11px] font-bold uppercase tracking-widest px-5 py-2 rounded group-hover:bg-adsun-orange group-hover:text-black group-hover:border-adsun-orange transition-all duration-300">
                Otvoriť
              </span>
            </button>
            );
          })}

          {/* Billboardy — externý odkaz, len na koreňovej úrovni */}
          {isRoot && (
          <a
            href="https://web-adsun-production-ac2f.up.railway.app/billboardy"
            target="_blank"
            rel="noopener noreferrer"
            className="category-card group cursor-pointer flex flex-col items-center text-center"
          >
            <div className="w-full max-w-[220px] aspect-[5/3] mb-4 flex items-center justify-center relative">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at 50% 60%, rgba(248,153,29,0.15) 0%, transparent 65%)',
                }}
              />
              <RectangleHorizontal
                className="w-16 h-16 text-white/40 group-hover:text-adsun-orange/70 transition-colors duration-500"
                strokeWidth={1.2}
              />
            </div>

            <h3 className="text-white font-bold text-sm italic leading-tight group-hover:text-adsun-orange transition-colors duration-300 mb-1">
              Billboardy
            </h3>
            <p className="text-white/35 text-[11px] italic line-clamp-2 leading-relaxed mb-2 px-2 max-w-[220px]">
              Prenájom billboardov — dostupnosť a objednávka
            </p>

            <span className="mt-auto inline-flex items-center gap-1.5 border border-adsun-orange/50 text-adsun-orange text-[11px] font-bold uppercase tracking-widest px-5 py-2 rounded group-hover:bg-adsun-orange group-hover:text-black group-hover:border-adsun-orange transition-all duration-300">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Na webe
            </span>
          </a>
          )}
        </div>
        ) : null;
      })()}

      {/* ──── PRODUCT TEMPLATES AT CURRENT LEVEL ──── */}
      {!loading && currentTemplates.length > 0 && (
        <div>
          {(filteredCategories as any[]).length > 0 && (
            <div className="flex items-center gap-4 py-2 mb-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-adsun-muted text-xs uppercase tracking-wider">Produkty v tejto kategórii</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentTemplates.map((product) => (
              <a
                key={product.id}
                href={`/products/${product.id}`}
                className={`glass-card group cursor-pointer block transition-all relative overflow-hidden ${
                  product.isClientProduct
                    ? 'border-adsun-orange/20 hover:border-adsun-orange/50'
                    : 'hover:border-adsun-orange/30'
                }`}
              >
                {/* Top color bar for client products */}
                {product.isClientProduct && (
                  <div className="h-1 bg-gradient-to-r from-adsun-orange to-adsun-orange-light" />
                )}

                <div className="p-5">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-semibold group-hover:text-adsun-orange transition-colors pr-4">
                      {product.name}
                    </h3>
                    {product.isClientProduct && (
                      <svg className="w-4 h-4 text-adsun-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    )}
                  </div>
                  {product.description && (
                    <p className="text-adsun-muted text-sm line-clamp-2 mb-3">{product.description}</p>
                  )}

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="inline-flex items-center gap-1 text-xs text-adsun-muted bg-white/5 rounded-full px-2.5 py-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                      </svg>
                      {product.pricingUnit === 'm2' ? 'Za m²' : 'Za kus'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-adsun-orange/10 text-adsun-orange text-xs font-semibold px-3 py-1.5 rounded-lg group-hover:bg-adsun-orange group-hover:text-black transition-all">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                      </svg>
                      Konfigurovať
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ──── CLIENT PRODUCTS (Vaše produkty) ──── */}
      {filteredClientProducts.length > 0 && browsePath.length === 0 && (
        <div>
          {/* Oddelovač */}
          <div className="flex items-center gap-4 py-4 mt-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-adsun-orange/30 to-transparent" />
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-adsun-orange" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              <span className="text-adsun-orange text-xs uppercase tracking-widest font-bold">Vaše produkty</span>
              <span className="text-adsun-muted text-xs">({filteredClientProducts.length})</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-adsun-orange/30 to-transparent" />
          </div>
          <p className="text-center text-adsun-muted text-xs mb-6">Produkty pripravené špeciálne pre vás</p>

          {groupedByCompany.map(([companyName, products]) => (
          <div key={companyName} className="mb-8">
            {/* Company header — len ak viac firiem */}
            {hasMultipleCompanies && (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-adsun-orange/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-adsun-orange" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">{shortenCompanyName(companyName)}</h3>
                  <p className="text-adsun-muted text-xs">{products.length} {products.length === 1 ? 'produkt' : products.length < 5 ? 'produkty' : 'produktov'}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((product) => {
                const isTemplate = product.type === 'template' || !product.type;
                const href = isTemplate
                  ? `/products/${product.id}`
                  : `/products/${product.id}?type=product`;
                const variantCount = !isTemplate && product.variants ? product.variants.length : 0;
                const ProductIcon = getProductIcon(product);

                return (
                  <a
                    key={product.id}
                    href={href}
                    className="group cursor-pointer block relative overflow-hidden rounded-xl border border-white/[0.06] hover:border-adsun-orange/40 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300"
                  >
                    <div className="flex items-stretch">
                      {/* Lucide ikona vľavo */}
                      <div className="w-28 flex-shrink-0 flex items-center justify-center relative bg-white/[0.03] border-r border-white/[0.06]">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                          style={{
                            background: 'radial-gradient(ellipse at 50% 50%, rgba(248,153,29,0.18) 0%, transparent 65%)',
                          }}
                        />
                        <ProductIcon
                          className="w-12 h-12 text-white/40 group-hover:text-adsun-orange/70 transition-all duration-400 group-hover:scale-110"
                          strokeWidth={1.3}
                        />
                      </div>

                      {/* Obsah vpravo */}
                      <div className="flex-1 p-4">
                        {/* Typ badge + hviezda */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            {isTemplate ? (
                              <span className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20">
                                Šablóna
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20">
                                Produkt
                              </span>
                            )}
                            {variantCount > 0 && (
                              <span className="text-[9px] text-adsun-muted bg-white/5 rounded-full px-2 py-0.5">
                                {variantCount} var.
                              </span>
                            )}
                          </div>
                          <svg className="w-3.5 h-3.5 text-adsun-orange" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                          </svg>
                        </div>

                        {/* Názov */}
                        <h3 className="text-white font-semibold text-sm group-hover:text-adsun-orange transition-colors mb-0.5 leading-tight">
                          {product.name}
                        </h3>

                        {/* Popis */}
                        {product.description && (
                          <p className="text-adsun-muted text-[11px] line-clamp-1 mb-2">{product.description}</p>
                        )}

                        {/* Cena + CTA */}
                        <div className="flex items-center justify-between">
                          {product.basePrice && product.basePrice > 0 ? (
                            <div>
                              <span className="text-white text-sm font-bold">{product.basePrice.toFixed(2)} €</span>
                              <span className="text-adsun-muted text-[10px] ml-0.5">/{product.pricingUnit === 'm2' ? 'm²' : 'ks'}</span>
                            </div>
                          ) : (
                            <span className="text-adsun-muted text-[10px]">Cena na vyžiadanie</span>
                          )}
                          <span className="inline-flex items-center gap-1 bg-adsun-orange/10 text-adsun-orange text-[10px] font-semibold px-2.5 py-1 rounded-md group-hover:bg-adsun-orange group-hover:text-black transition-all">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                            </svg>
                            Konfigurovať
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
          ))}
        </div>
      )}

      {/* ──── EMPTY STATE + INQUIRY FORM ──── */}
      {!loading && filteredCategories.length === 0 && currentTemplates.length === 0 && filteredClientProducts.length === 0 && (
        <div className="space-y-6">
          <div className="glass-card p-12 text-center text-adsun-muted">
            <svg
              className="w-12 h-12 mx-auto mb-4 opacity-30"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <p className="text-lg font-medium mb-1">Žiadne výsledky</p>
            <p className="text-sm">Skúste zmeniť vyhľadávanie alebo nám pošlite dopyt.</p>
          </div>
          <InquiryForm />
        </div>
      )}

      {/* Inquiry button always visible at bottom */}
      {!loading && (filteredCategories.length > 0 || currentTemplates.length > 0 || filteredClientProducts.length > 0) && (
        <InquiryForm collapsed />
      )}
    </div>
  );
}
