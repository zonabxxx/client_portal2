// ============================================
// Product Configurator - Creates Project + Calculation
// Same flow as main program (no direct order creation)
// ============================================

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { addToCart } from '@/lib/cart-store';
import { saveCartItemFiles } from '@/lib/cart-files';

interface ParameterOption {
  id: string;
  optionValue: string;
  displayLabel: string;
  isDefault: boolean;
  displayOrder: number;
}

interface Parameter {
  id: string;
  parameterName: string;
  displayName: string;
  parameterType: 'text' | 'number' | 'select' | 'boolean';
  isRequired: boolean;
  defaultValue: string | null;
  validationRules: any;
  displayOrder: number;
  options: ParameterOption[];
}

interface VariantPart {
  name: string;
  unit: string;
  quantity: number;
}

interface Variant {
  id: string;
  name: string;
  description: string;
  unit: string;
  basePrice?: number;
  materials?: VariantPart[];
  services?: VariantPart[];
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  categoryId?: string | null;
  pricingUnit: string;
  clientEntityId?: string | null;
  clientName?: string | null;
  type?: 'template' | 'product';
  parameters: Parameter[];
  variants?: Variant[];
  basePrice?: number;
  baseCost?: number;
  supplierProductCode?: string | null;
  priceSource?: 'manual' | 'typocon' | 'calculator' | null;
}

// Valid grammages per material for Typocon templates
const TYPOCON_MATERIAL_GRAMMAGES: Record<string, number[]> = {
  natierany_matny: [115, 135, 150, 170, 200, 250, 300, 350],
  natierany_leskly: [115, 135, 150, 170, 200, 250, 300, 350],
  ofsetovy_nenatierany: [90, 100, 120, 170, 200, 250, 300, 350, 400],
  freelife_satin: [400],
  freelife_gloss: [350, 400],
  symbol_card_white: [300],
  splendorlux: [250],
  invercote_g: [300],
  holmen_book_cream: [80],
  munken_polar: [150, 300],
  splendorgel: [115, 300, 400],
  diamond_white: [300],
  wove_brilliant: [300],
  nature_touch: [300],
};

interface Props {
  product: Product;
}

interface UploadedFile {
  file: File;
  id: string;
}

export default function ProductConfigurator({ product }: Props) {
  const isRegularProduct = product.type === 'product';
  const hasVariants = isRegularProduct && product.variants && product.variants.length > 0;

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    hasVariants ? product.variants![0].id : '',
  );
  const [quantity, setQuantity] = useState('1');
  const [values, setValues] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    product.parameters?.forEach((p) => {
      if (p.defaultValue) {
        defaults[p.parameterName] = p.defaultValue;
      } else if (p.options?.length > 0) {
        const defaultOpt = p.options.find((o) => o.isDefault);
        if (defaultOpt) defaults[p.parameterName] = defaultOpt.optionValue;
      }
    });
    return defaults;
  });
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showParts, setShowParts] = useState(false);

  // ── Real-time price calculation for templates ──
  const [calculatedPrice, setCalculatedPrice] = useState<{
    calculatedPrice: number | null;
    totalPrice: number | null;
    pricePerUnit?: number;
    quantity: number;
    area: number | null;
    unit: string;
    priceSource: string;
    appliedRule: string | null;
  } | null>(null);
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const priceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced price calculation for template products
  const calculatePrice = useCallback((params: Record<string, string>) => {
    if (isRegularProduct) return;

    // Clear previous timer
    if (priceTimerRef.current) clearTimeout(priceTimerRef.current);

    // Check if we have enough data to calculate
    const filledCount = Object.values(params).filter((v) => v && v.trim() !== '').length;
    if (filledCount < 2) {
      setCalculatedPrice(null);
      return;
    }

    setIsPriceLoading(true);

    priceTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/proxy/products/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            templateId: product.id,
            parameters: params,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.calculatedPrice !== null && data.calculatedPrice > 0) {
            setCalculatedPrice(data);
          } else {
            setCalculatedPrice(null);
          }
        }
      } catch {
        // silently ignore
      } finally {
        setIsPriceLoading(false);
      }
    }, 600); // 600ms debounce
  }, [isRegularProduct, product.id]);

  // Trigger price calculation when parameters change
  useEffect(() => {
    if (!isRegularProduct && product.parameters?.length > 0) {
      calculatePrice(values);
    }
    return () => {
      if (priceTimerRef.current) clearTimeout(priceTimerRef.current);
    };
  }, [values, isRegularProduct, calculatePrice, product.parameters?.length]);

  function updateValue(name: string, value: string) {
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      // When material changes on Typocon template, reset grammage if it becomes invalid
      if (isTypocon && (name === 'paper' || name === 'material' || name === 'papier')) {
        const newValidGrammages = TYPOCON_MATERIAL_GRAMMAGES[value];
        const currentGrammage = parseInt(prev.grammage || prev.gramaz || '', 10);
        if (newValidGrammages && !isNaN(currentGrammage) && !newValidGrammages.includes(currentGrammage)) {
          // Reset grammage — pick first valid
          next.grammage = String(newValidGrammages[0]);
          if (prev.gramaz !== undefined) next.gramaz = String(newValidGrammages[0]);
        }
      }
      return next;
    });
  }

  function addFiles(newFiles: FileList | File[]) {
    const added = Array.from(newFiles).map((file) => ({
      file,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    }));
    setFiles((prev) => [...prev, ...added]);
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) {
      addFiles(e.dataTransfer.files);
    }
  }

  async function handleAddToCart(e: React.FormEvent) {
    e.preventDefault();

    const selectedVariant = hasVariants
      ? product.variants!.find((v) => v.id === selectedVariantId)
      : null;

    const newItem = addToCart({
      productId: product.id,
      productName: product.name,
      productType: (product.type || 'template') as 'template' | 'product',
      variantId: selectedVariant?.id || null,
      variantName: selectedVariant?.name || null,
      quantity: isRegularProduct ? Number(quantity) || 1 : (Number(values?.quantity) || Number(values?.['Množstvo (ks)']) || 1),
      parameters: values,
      notes,
      fileNames: files.map((f) => f.file.name),
      categoryId: product.categoryId || null,
      categoryName: product.category || null,
    });

    // Save actual File objects to IndexedDB (localStorage can't store binary data)
    if (files.length > 0) {
      try {
        await saveCartItemFiles(newItem.id, files.map((f) => f.file));
      } catch {
        console.warn('Failed to save files to IndexedDB');
      }
    }

    setResult({
      success: true,
      message: `${product.name} bol pridaný do košíka.`,
    });
  }

  // Check if this is a Typocon template (via priceSource or supplierProductCode fallback)
  const isTypocon = !isRegularProduct && (product.priceSource === 'typocon' || product.supplierProductCode?.startsWith('typocon:'));

  // Get valid grammages for selected material (Typocon templates only)
  const selectedMaterial = values.paper || values.material || values.papier || '';
  const validGrammages = isTypocon && selectedMaterial
    ? TYPOCON_MATERIAL_GRAMMAGES[selectedMaterial] || null
    : null;

  // Determine if parameter should render as dropdown (has options) or input
  function renderParam(param: Parameter) {
    const hasOptions = param.options && param.options.length > 0;

    // If parameterType is select OR has options → dropdown
    if (param.parameterType === 'select' || hasOptions) {
      // Filter grammage options by selected material (Typocon only)
      let filteredOptions = param.options;
      if (isTypocon && (param.parameterName === 'grammage' || param.parameterName === 'gramaz') && validGrammages) {
        filteredOptions = param.options.filter((opt) => {
          const gramVal = parseInt(opt.optionValue, 10);
          return isNaN(gramVal) || validGrammages.includes(gramVal);
        });
      }

      return (
        <select
          value={values[param.parameterName] || ''}
          onChange={(e) => updateValue(param.parameterName, e.target.value)}
          required={param.isRequired}
        >
          <option value="">Vyberte {param.displayName.toLowerCase()}...</option>
          {filteredOptions.map((opt) => (
            <option key={opt.id} value={opt.optionValue}>
              {opt.displayLabel}
            </option>
          ))}
        </select>
      );
    }

    if (param.parameterType === 'boolean') {
      return (
        <label className="flex items-center gap-3 cursor-pointer py-1">
          <input
            type="checkbox"
            checked={values[param.parameterName] === 'true'}
            onChange={(e) => updateValue(param.parameterName, e.target.checked ? 'true' : 'false')}
            className="w-5 h-5 rounded border-gray-600 accent-adsun-orange"
          />
          <span className="text-adsun-muted text-sm">Áno</span>
        </label>
      );
    }

    // Text or number input
    return (
      <input
        type={param.parameterType === 'number' ? 'number' : 'text'}
        value={values[param.parameterName] || ''}
        onChange={(e) => updateValue(param.parameterName, e.target.value)}
        placeholder={param.displayName}
        required={param.isRequired}
      />
    );
  }

  return (
    <div className="glass-card p-6">
      <h2 className="text-white text-xl font-semibold mb-1">{product.name}</h2>
      {product.description && (
        <p className="text-adsun-muted text-sm mb-6">{product.description}</p>
      )}

      {/* Client badge */}
      {product.clientEntityId && product.clientName && (
        <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-lg bg-adsun-orange/10 border border-adsun-orange/20">
          <svg className="w-4 h-4 text-adsun-orange flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-adsun-orange text-xs font-medium">Preddefinované pre {product.clientName}</span>
        </div>
      )}

      {result?.success ? (
        /* After adding to cart — show confirmation */
        <div className="rounded-lg p-6 bg-green-500/10 border border-green-500/30 text-center">
          <svg className="w-12 h-12 mx-auto text-green-400 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-green-400 text-sm mb-4">{result.message}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="/cart" className="btn-primary text-sm px-5 py-2">
              Zobraziť košík →
            </a>
            <a href="/products" className="px-5 py-2 text-sm rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors inline-flex items-center">
              Pokračovať v nákupe
            </a>
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setFiles([]);
                setNotes('');
                const defaults: Record<string, string> = {};
                product.parameters?.forEach((p) => {
                  if (p.defaultValue) defaults[p.parameterName] = p.defaultValue;
                  else if (p.options?.length > 0) {
                    const def = p.options.find((o) => o.isDefault);
                    if (def) defaults[p.parameterName] = def.optionValue;
                  }
                });
                setValues(defaults);
              }}
              className="px-5 py-2 text-sm rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors"
            >
              Pridať ďalší variant
            </button>
          </div>
        </div>
      ) : (
        /* Order form */
        <>
          {result && (
            <div className="rounded-lg p-4 mb-6 text-sm bg-red-500/10 border border-red-500/30 text-red-400">
              {result.message}
            </div>
          )}

          <form onSubmit={handleAddToCart} className="space-y-5">
            {/* ──── Regular product: Variant + Quantity ──── */}
            {isRegularProduct && hasVariants && (() => {
              const selVariant = product.variants!.find((v) => v.id === selectedVariantId);
              const unitPrice = selVariant?.basePrice || 0;
              const qty = Number(quantity) || 1;
              const totalPrice = unitPrice * qty;

              return (
                <>
                  <div>
                    <label className="block text-white text-sm font-medium mb-1.5">
                      Variant <span className="text-red-400 ml-1">*</span>
                    </label>
                    <select
                      value={selectedVariantId}
                      onChange={(e) => setSelectedVariantId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-adsun-orange focus:ring-1 focus:ring-adsun-orange transition-colors"
                      required
                    >
                      {product.variants!.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name}{v.basePrice ? ` — ${v.basePrice.toFixed(2)} €/${v.unit}` : ''}{v.description ? ` (${v.description})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-1.5">
                      Množstvo <span className="text-red-400 ml-1">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-adsun-orange focus:ring-1 focus:ring-adsun-orange transition-colors"
                      required
                    />
                  </div>
                  {/* Price display */}
                  {unitPrice > 0 && (
                    <div className="rounded-lg p-4 bg-adsun-orange/10 border border-adsun-orange/20">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-adsun-muted text-sm">Cena za {selVariant?.unit || 'ks'}:</span>
                        <span className="text-white font-medium">{unitPrice.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-white/10">
                        <span className="text-white text-sm font-medium">Celkom ({qty} {selVariant?.unit || 'ks'}):</span>
                        <span className="text-adsun-orange text-lg font-bold">{totalPrice.toFixed(2)} €</span>
                      </div>
                    </div>
                  )}

                  {/* Expandable: product parts (materials + services) — names only */}
                  {selVariant && ((selVariant.materials && selVariant.materials.length > 0) || (selVariant.services && selVariant.services.length > 0)) && (
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowParts(!showParts)}
                        className="flex items-center gap-1.5 text-xs text-adsun-muted hover:text-adsun-orange transition-colors"
                      >
                        <svg className={`w-3.5 h-3.5 transition-transform ${showParts ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        <span>{showParts ? 'Skryť súčiastky' : 'Zobraziť súčiastky produktu'}</span>
                      </button>

                      {showParts && (
                        <div className="mt-3 pl-1 space-y-3">
                          {selVariant.materials && selVariant.materials.length > 0 && (
                            <div>
                              <p className="text-[10px] font-semibold text-adsun-muted uppercase tracking-widest mb-1.5">Materiály</p>
                              <div className="space-y-1">
                                {selVariant.materials.map((m, i) => (
                                  <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                                    <span className="w-1.5 h-1.5 rounded-full bg-adsun-orange/40 flex-shrink-0" />
                                    <span>{m.name}</span>
                                    <span className="text-adsun-muted text-xs">({m.quantity} {m.unit})</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {selVariant.services && selVariant.services.length > 0 && (
                            <div>
                              <p className="text-[10px] font-semibold text-adsun-muted uppercase tracking-widest mb-1.5">Služby</p>
                              <div className="space-y-1">
                                {selVariant.services.map((s, i) => (
                                  <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400/40 flex-shrink-0" />
                                    <span>{s.name}</span>
                                    <span className="text-adsun-muted text-xs">({s.quantity} {s.unit})</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </>
              );
            })()}

            {/* ──── Template product: Parameters ──── */}
            {!isRegularProduct && product.parameters?.length > 0 ? (
              product.parameters.map((param) => (
                <div key={param.id}>
                  <label className="block text-white text-sm font-medium mb-1.5">
                    {param.displayName}
                    {param.isRequired && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  {renderParam(param)}
                </div>
              ))
            ) : !isRegularProduct ? (
              <p className="text-adsun-muted text-sm py-2">
                Tento produkt nemá konfigurovateľné parametre. Popíšte vašu požiadavku v poznámkach.
              </p>
            ) : null}

            {/* ──── Template product: Real-time price calculation ──── */}
            {!isRegularProduct && (
              <>
                {isPriceLoading && (
                  <div className="rounded-lg p-4 bg-white/[0.03] border border-white/10 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-adsun-orange border-t-transparent rounded-full animate-spin" />
                    <span className="text-adsun-muted text-sm">Počítam cenu...</span>
                  </div>
                )}

                {!isPriceLoading && calculatedPrice && (
                  <div className="rounded-lg p-4 bg-adsun-orange/10 border border-adsun-orange/20">
                    {calculatedPrice.pricePerUnit !== undefined && calculatedPrice.pricePerUnit > 0 && calculatedPrice.quantity > 1 && (
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-adsun-muted text-sm">Cena za ks:</span>
                        <span className="text-white font-medium">{calculatedPrice.pricePerUnit.toFixed(4)} €</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                      <span className="text-white text-sm font-medium">
                        Celkom{calculatedPrice.quantity > 1 ? ` (${calculatedPrice.quantity} ks)` : ''}:
                      </span>
                      <span className="text-adsun-orange text-lg font-bold">{calculatedPrice.calculatedPrice!.toFixed(2)} €</span>
                    </div>
                    <p className="text-adsun-muted text-[10px] mt-2">
                      * Orientačná cena. Finálnu cenu potvrdíme v cenovej ponuke.
                    </p>
                  </div>
                )}

                {!isPriceLoading && !calculatedPrice && (
                  <div className="rounded-lg p-3 bg-white/[0.03] border border-white/10 text-center">
                    <p className="text-adsun-muted text-sm">
                      Cenu obdržíte v cenovej ponuke po spracovaní kalkulácie.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* File Upload */}
            <div>
              <label className="block text-white text-sm font-medium mb-1.5">
                Prílohy
                <span className="text-adsun-muted font-normal ml-1">(grafika, podklady)</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-adsun-orange bg-adsun-orange/5'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && addFiles(e.target.files)}
                  accept=".pdf,.jpg,.jpeg,.png,.ai,.psd,.eps,.svg,.tiff,.tif,.cdr,.indd"
                />
                <svg className="w-8 h-8 mx-auto text-adsun-muted mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className="text-adsun-muted text-sm">
                  {isDragging ? 'Pustite súbory sem...' : 'Pretiahnite súbory alebo kliknite pre výber'}
                </p>
                <p className="text-adsun-muted text-xs mt-1">
                  PDF, JPG, PNG, AI, PSD, EPS, SVG, TIFF, CDR, INDD
                </p>
              </div>

              {/* File list */}
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((f) => (
                    <div key={f.id} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 min-w-0">
                        <svg className="w-4 h-4 text-adsun-orange flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <span className="text-white text-sm truncate">{f.file.name}</span>
                        <span className="text-adsun-muted text-xs flex-shrink-0">
                          {(f.file.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                        className="text-red-400 hover:text-red-300 flex-shrink-0"
                        title="Odstrániť"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-1.5">Poznámky</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Špeciálne požiadavky, dodacie pokyny..."
                rows={3}
              />
            </div>

            <p className="text-adsun-muted text-xs">
              Produkt bude pridaný do košíka. Objednávku odošlete z košíka.
            </p>

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              Pridať do košíka
            </button>
          </form>
        </>
      )}
    </div>
  );
}
