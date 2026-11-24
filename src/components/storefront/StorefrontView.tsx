import { useEffect, useMemo, useRef, useState } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DEPARTMENTS, OCCASIONS } from '../../data/seed';
import { formatINR } from '../../lib/format';
import { EASE_OUT, TIMING } from '../../lib/motion';
import { useDemoStore } from '../../store/demoStore';
import type { Department, Occasion, Product } from '../../types/shop';
import { ProductDrawer } from './ProductDrawer';

gsap.registerPlugin(ScrollTrigger);

type PriceFilter = 'all' | 'under-2000' | '2000-3500' | 'above-3500';

export function StorefrontView() {
  const { products, addToCart } = useDemoStore();
  const [department, setDepartment] = useState<'All' | Department>('All');
  const [occasion, setOccasion] = useState<'All' | Occasion>('All');
  const [priceRange, setPriceRange] = useState<PriceFilter>('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const pageRef = useRef<HTMLDivElement>(null);

  // GSAP editorial hero choreography + scroll-triggered spread reveal (respects reduced motion)
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.from('[data-hero-stagger]', {
          y: 20,
          opacity: 0,
          duration: TIMING.hero,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        });

        gsap.from('[data-hero-photo]', {
          scale: 1.05,
          opacity: 0.85,
          duration: 0.78,
          ease: 'power3.out',
          clearProps: 'opacity',
        });

        // Subtle editorial parallax on desktop viewports only
        if (window.matchMedia('(min-width: 1024px)').matches) {
          gsap.to('[data-hero-photo]', {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-hero-section]',
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }

        gsap.from('[data-spread-card]', {
          y: 26,
          opacity: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '[data-spread-section]',
            start: 'top 84%',
            once: true,
          },
        });
      }, root);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  const selectedProduct: Product | null = useMemo(
    () => products.find((p) => p.id === selectedId) ?? null,
    [products, selectedId]
  );

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (department !== 'All' && p.department !== department) return false;
      if (occasion !== 'All' && p.occasion !== occasion) return false;
      if (priceRange === 'under-2000' && p.price >= 2000) return false;
      if (priceRange === '2000-3500' && (p.price < 2000 || p.price > 3500)) return false;
      if (priceRange === 'above-3500' && p.price <= 3500) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.department.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [products, department, occasion, priceRange, query]);

  const jumpToDepartment = (dept: Department) => {
    setDepartment(dept);
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={pageRef}>
      {/* Asymmetric Full-Bleed Split Hero */}
      <section
        data-hero-section
        className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 border-b border-[var(--gs-border)]"
      >
        <div className="lg:col-span-5 px-5 sm:px-10 py-10 lg:py-16 flex flex-col justify-between gap-10 min-w-0">
          <div className="space-y-5">
            <h1
              data-hero-stagger
              className="font-display text-5xl sm:text-6xl leading-[1.04] font-medium text-[var(--gs-ink)] break-words"
            >
              Objects chosen to be kept.
            </h1>
            <p
              data-hero-stagger
              className="text-base text-[var(--gs-ink-secondary)] leading-relaxed max-w-md"
            >
              Hand-packed keepsake boxes, custom-engraved walnut frames, botanical hampers, and
              studio stoneware — finished with linen ribbon and a handwritten card.
            </p>
            <div data-hero-stagger className="flex flex-wrap gap-3 pt-2">
              <a
                href="#catalog"
                className="px-6 py-3 rounded-[4px] text-sm font-medium bg-[var(--gs-ink)] text-[var(--gs-surface)] hover:bg-[var(--gs-accent)] transition-colors"
              >
                Explore catalog
              </a>
              <button
                type="button"
                onClick={() => jumpToDepartment('Personalized & Engraved')}
                className="px-5 py-3 rounded-[4px] border border-[var(--gs-border-strong)] text-sm font-medium text-[var(--gs-ink)] hover:bg-[var(--gs-surface-chip)] transition-colors"
              >
                Custom engraving
              </button>
            </div>
          </div>

          <div data-hero-stagger className="pt-6 border-t border-[var(--gs-border)] space-y-2.5">
            <p className="text-xs text-[var(--gs-ink-muted)]">Departments</p>
            <div className="grid grid-cols-2 gap-x-5 gap-y-1.5 text-sm">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => jumpToDepartment(dept)}
                  className="text-left text-[var(--gs-ink)] hover:text-[var(--gs-accent)] py-0.5 transition-colors"
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 min-h-[340px] lg:min-h-[540px] bg-[var(--gs-surface-chip)] overflow-hidden">
          <img
            data-hero-photo
            src="/images/sandalwood-box.jpg"
            alt="Sandalwood and brass keepsake gift box tied with terracotta cotton ribbon"
            className="w-full h-full object-cover will-change-transform"
          />
        </div>
      </section>

      {/* Curated 2-Up Editorial Spread */}
      <section
        data-spread-section
        className="max-w-[1440px] mx-auto px-5 sm:px-10 py-12 border-b border-[var(--gs-border)]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button
            data-spread-card
            type="button"
            onClick={() => setSelectedId('p3')}
            className="group text-left block min-w-0"
          >
            <div className="aspect-[16/10] overflow-hidden bg-[var(--gs-surface-chip)]">
              <img
                src="/images/botanical-hamper.jpg"
                alt="Dried lotus botanical hamper with Coorg dark chocolate"
                className="w-full h-full object-cover editorial-zoom"
              />
            </div>
            <div className="mt-3.5 flex items-baseline justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-medium text-[var(--gs-ink)] group-hover:text-[var(--gs-accent)] transition-colors">
                  Botanical Hampers & Cocoa
                </h2>
                <p className="text-xs text-[var(--gs-ink-secondary)] mt-0.5">
                  Preserved lotus stems paired with single-origin Coorg dark chocolate.
                </p>
              </div>
              <span className="tabular-nums text-sm font-medium text-[var(--gs-ink)] shrink-0">
                From {formatINR(2199)}
              </span>
            </div>
          </button>

          <button
            data-spread-card
            type="button"
            onClick={() => setSelectedId('p4')}
            className="group text-left block min-w-0"
          >
            <div className="aspect-[16/10] overflow-hidden bg-[var(--gs-surface-chip)]">
              <img
                src="/images/stoneware-tea.jpg"
                alt="Wheel-thrown matte stoneware teapot and ceramic tea cups"
                className="w-full h-full object-cover editorial-zoom"
              />
            </div>
            <div className="mt-3.5 flex items-baseline justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-medium text-[var(--gs-ink)] group-hover:text-[var(--gs-accent)] transition-colors">
                  Studio Stoneware & Home
                </h2>
                <p className="text-xs text-[var(--gs-ink-secondary)] mt-0.5">
                  Small-batch oatmeal ceramics and hand-loomed silk throws for housewarmings.
                </p>
              </div>
              <span className="tabular-nums text-sm font-medium text-[var(--gs-ink)] shrink-0">
                From {formatINR(4200)}
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* Borderless 4-Column Photo Catalog with Framer Motion Layout Filtering */}
      <section id="catalog" className="max-w-[1440px] mx-auto px-5 sm:px-10 py-12 space-y-8">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {(['All', ...DEPARTMENTS] as const).map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setDepartment(dept)}
                className={`px-3.5 py-2 rounded-[4px] text-xs font-medium border transition-colors ${
                  department === dept
                    ? 'bg-[var(--gs-ink)] text-[var(--gs-surface)] border-[var(--gs-ink)]'
                    : 'bg-[var(--gs-surface)] text-[var(--gs-ink-secondary)] border-[var(--gs-border)] hover:border-[var(--gs-ink)]'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              aria-label="Filter by occasion"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value as 'All' | Occasion)}
              className="px-3 py-2 text-xs rounded-[4px] border border-[var(--gs-border-strong)] bg-[var(--gs-surface)] text-[var(--gs-ink)]"
            >
              <option value="All">All occasions</option>
              {OCCASIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by price"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value as PriceFilter)}
              className="px-3 py-2 text-xs rounded-[4px] border border-[var(--gs-border-strong)] bg-[var(--gs-surface)] text-[var(--gs-ink)]"
            >
              <option value="all">Any price</option>
              <option value="under-2000">Under ₹2,000</option>
              <option value="2000-3500">₹2,000 – ₹3,500</option>
              <option value="above-3500">Above ₹3,500</option>
            </select>

            <div className="relative">
              <MagnifyingGlass
                size={15}
                weight="regular"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gs-ink-muted)]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search gifts..."
                className="pl-9 pr-3 py-2 text-xs rounded-[4px] border border-[var(--gs-border-strong)] bg-[var(--gs-surface)] text-[var(--gs-ink)] w-44 sm:w-52"
              />
            </div>
          </div>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredProducts.map((p, idx) => {
              const isOut = p.stock === 0;
              const isLow = p.stock > 0 && p.stock <= 5;
              return (
                <motion.article
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{
                    duration: TIMING.panel,
                    delay: Math.min(idx, 5) * 0.03,
                    ease: EASE_OUT,
                  }}
                  className="flex flex-col min-w-0"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(p.id)}
                    className="group text-left relative aspect-[4/5] overflow-hidden bg-[var(--gs-surface-chip)]"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover editorial-zoom"
                    />
                    {p.personalizable && (
                      <span className="absolute bottom-3 left-3 px-2.5 py-1 text-[11px] font-medium bg-[var(--gs-surface)]/95 text-[var(--gs-ink)]">
                        Custom engraving
                      </span>
                    )}
                    {isOut ? (
                      <span className="absolute top-3 right-3 px-2.5 py-0.5 text-[11px] font-medium bg-[var(--gs-danger)] text-white">
                        Sold out
                      </span>
                    ) : isLow ? (
                      <span className="absolute top-3 right-3 px-2.5 py-0.5 text-[11px] font-medium bg-[var(--gs-surface)]/95 text-[var(--gs-accent)]">
                        {p.stock} left
                      </span>
                    ) : null}
                  </button>

                  <div className="pt-3.5 flex-1 flex flex-col justify-between gap-2.5">
                    <div>
                      <p className="text-xs text-[var(--gs-ink-muted)]">{p.department}</p>
                      <h3 className="font-display text-xl font-medium text-[var(--gs-ink)] leading-snug mt-0.5">
                        <button
                          type="button"
                          onClick={() => setSelectedId(p.id)}
                          className="text-left hover:text-[var(--gs-accent)] transition-colors"
                        >
                          {p.name}
                        </button>
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[var(--gs-surface-chip)]">
                      <span className="tabular-nums text-sm font-semibold text-[var(--gs-ink)]">
                        {formatINR(p.price)}
                      </span>
                      <button
                        type="button"
                        disabled={isOut}
                        onClick={() => (p.personalizable ? setSelectedId(p.id) : addToCart(p.id))}
                        className={`text-xs font-medium underline underline-offset-4 transition-colors ${
                          isOut
                            ? 'text-[var(--gs-ink-muted)] no-underline cursor-not-allowed'
                            : 'text-[var(--gs-ink)] hover:text-[var(--gs-accent)]'
                        }`}
                      >
                        {isOut ? 'Out of stock' : p.personalizable ? 'Personalize' : 'Add to bag'}
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="border border-[var(--gs-border)] bg-[var(--gs-surface)] p-12 text-center space-y-3">
            <p className="text-sm text-[var(--gs-ink-secondary)]">
              No gifts match those filters right now.
            </p>
            <button
              type="button"
              onClick={() => {
                setDepartment('All');
                setOccasion('All');
                setPriceRange('all');
                setQuery('');
              }}
              className="text-xs font-medium underline underline-offset-4 text-[var(--gs-ink)] hover:text-[var(--gs-accent)]"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {/* Editorial Footer */}
      <footer className="border-t border-[var(--gs-border)] mt-8">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[var(--gs-ink-muted)]">
          <div>
            <span className="font-display text-lg text-[var(--gs-ink)]">GiftShop</span>
            <span className="ml-3">Hand-packed gifts, linen wrap and custom brass engraving.</span>
          </div>
          <span>Portfolio storefront & operations demo</span>
        </div>
      </footer>

      <ProductDrawer product={selectedProduct} onClose={() => setSelectedId(null)} />
    </div>
  );
}
