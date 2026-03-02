// ============================================
// Products Catalog - Drill-down category browser
// ⭐ Client products → Categories → Subcategories → Products
// ============================================

'use client';

import { useState, useMemo } from 'react';

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
        p.category.toLowerCase().includes(q),
    );
  }, [clientProducts, search]);

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

      {/* ──── CLIENT PRODUCTS ──── */}
      {filteredClientProducts.length > 0 && browsePath.length === 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-adsun-orange" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              <h2 className="text-white font-semibold text-lg">Vaše produkty</h2>
            </div>
            <span className="text-adsun-muted text-sm">({filteredClientProducts.length})</span>
          </div>
          <p className="text-adsun-muted text-xs mb-4">Produkty pripravené špeciálne pre vás</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClientProducts.map((product) => {
              const isTemplate = product.type === 'template' || !product.type;
              const href = isTemplate
                ? `/products/${product.id}`
                : `/products/${product.id}?type=product`;

              return (
                <a
                  key={product.id}
                  href={href}
                  className="glass-card p-5 group cursor-pointer block border-adsun-orange/20 hover:border-adsun-orange/50 transition-all relative"
                >
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className={`text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      isTemplate
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {isTemplate ? 'Šablóna' : 'Produkt'}
                    </span>
                    <svg className="w-4 h-4 text-adsun-orange" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </div>
                  <div className="text-adsun-orange text-[10px] font-medium uppercase tracking-wider mb-2">
                    {product.category}
                  </div>
                  <h3 className="text-white font-medium group-hover:text-adsun-orange transition-colors pr-20">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-adsun-muted text-sm mt-1 line-clamp-2">{product.description}</p>
                  )}
                  {!isTemplate && product.variants && product.variants.length > 0 && (
                    <p className="text-adsun-muted text-xs mt-2">
                      {product.variants.length} {product.variants.length === 1 ? 'variant' : 'variantov'}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    {product.basePrice && product.basePrice > 0 ? (
                      <span className="text-white text-sm font-semibold">
                        {product.basePrice.toFixed(2)} €
                        <span className="text-adsun-muted text-xs font-normal ml-1">
                          /{product.pricingUnit === 'm2' ? 'm²' : 'ks'}
                        </span>
                      </span>
                    ) : (
                      <span className="text-adsun-muted text-xs">
                        {product.pricingUnit === 'm2' ? 'Za m²' : 'Za kus'}
                      </span>
                    )}
                    <span className="text-adsun-orange text-xs font-medium group-hover:translate-x-1 transition-transform">
                      Objednať →
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Separator */}
          <div className="flex items-center gap-4 py-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-adsun-muted text-xs uppercase tracking-wider">Katalóg produktov</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
        </div>
      )}

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
      {!loading && filteredCategories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCategories.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => navigateToCategory(cat.id, cat.name)}
              className="text-left glass-card overflow-hidden group cursor-pointer hover:border-adsun-orange/30 transition-all"
            >
              {/* Background image or gradient */}
              {cat.backgroundImage ? (
                <div
                  className="h-32 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${cat.backgroundImage})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-white font-semibold text-base group-hover:text-adsun-orange transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              ) : (
                <div className="h-32 bg-gradient-to-br from-white/5 to-white/[0.02] flex items-end p-4 relative">
                  <div className="absolute top-4 right-4">
                    <svg className="w-8 h-8 text-white/10 group-hover:text-adsun-orange/30 transition-colors" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold text-base group-hover:text-adsun-orange transition-colors">
                    {cat.name}
                  </h3>
                </div>
              )}

              {/* Info bar */}
              <div className="p-4 pt-3">
                {cat.description && (
                  <p className="text-adsun-muted text-xs line-clamp-2 mb-2">{cat.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-adsun-muted text-xs">
                    {cat.templateCount > 0
                      ? `${cat.templateCount} produktov`
                      : cat.children?.length > 0
                        ? `${cat.children.length} podkategórií`
                        : 'Zobraziť'}
                  </span>
                  <svg className="w-4 h-4 text-adsun-muted group-hover:text-adsun-orange group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

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
                className={`glass-card p-5 group cursor-pointer block transition-all relative ${
                  product.isClientProduct
                    ? 'border-adsun-orange/20 hover:border-adsun-orange/50'
                    : 'hover:border-adsun-orange/30'
                }`}
              >
                {product.isClientProduct && (
                  <div className="absolute top-3 right-3">
                    <svg className="w-4 h-4 text-adsun-orange" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </div>
                )}

                <h3 className="text-white font-medium group-hover:text-adsun-orange transition-colors pr-6">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-adsun-muted text-sm mt-1 line-clamp-2">{product.description}</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-adsun-muted text-xs">
                    {product.pricingUnit === 'm2' ? 'Za m²' : 'Za kus'}
                  </span>
                  <span className="text-adsun-orange text-xs font-medium group-hover:translate-x-1 transition-transform">
                    Objednať →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ──── EMPTY STATE ──── */}
      {!loading && filteredCategories.length === 0 && currentTemplates.length === 0 && filteredClientProducts.length === 0 && (
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
          <p className="text-sm">Skúste zmeniť vyhľadávanie.</p>
        </div>
      )}
    </div>
  );
}
