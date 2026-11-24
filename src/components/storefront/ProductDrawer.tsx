import { useEffect, useState } from 'react';
import { Check, PencilSimpleLine, X } from '@phosphor-icons/react';
import { formatINR } from '../../lib/format';
import { useDemoStore } from '../../store/demoStore';
import type { Product } from '../../types/shop';
import { ModalDialog } from '../ModalDialog';

interface ProductDrawerProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDrawer({ product, onClose }: ProductDrawerProps) {
  const { addToCart } = useDemoStore();
  const [engraving, setEngraving] = useState('');

  useEffect(() => {
    setEngraving('');
  }, [product?.id]);

  if (!product) return null;

  const isOut = product.stock === 0;

  return (
    <ModalDialog open={Boolean(product)} onClose={onClose} ariaLabel={product.name} variant="drawer">
      <div className="h-full overflow-y-auto flex flex-col">
        <div className="px-5 py-4 border-b border-[var(--gs-border)] flex items-center justify-between">
          <span className="text-xs text-[var(--gs-ink-muted)]">{product.department}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="p-1.5 rounded-[4px] text-[var(--gs-ink-secondary)] hover:text-[var(--gs-ink)] hover:bg-[var(--gs-surface-muted)] transition-colors"
          >
            <X size={18} weight="regular" />
          </button>
        </div>

        <div className="w-full aspect-[4/3] bg-[var(--gs-surface-chip)] overflow-hidden shrink-0">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="p-6 space-y-5 flex-1">
          <div>
            <p className="text-xs text-[var(--gs-ink-muted)]">
              SKU {product.sku} — {product.occasion}
            </p>
            <h1 className="font-display text-3xl font-medium text-[var(--gs-ink)] mt-1 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-baseline justify-between mt-3">
              <span className="tabular-nums text-lg font-semibold text-[var(--gs-ink)]">
                {formatINR(product.price)}
              </span>
              <span
                className={`text-xs font-medium ${
                  isOut
                    ? 'text-[var(--gs-danger)]'
                    : product.stock <= 5
                    ? 'text-[var(--gs-accent)]'
                    : 'text-[var(--gs-sage)]'
                }`}
              >
                {isOut ? 'Out of stock' : `${product.stock} in stock`}
              </span>
            </div>
          </div>

          <p className="text-sm text-[var(--gs-ink-secondary)] leading-relaxed">
            {product.description}
          </p>

          <ul className="space-y-1.5 pt-2 border-t border-[var(--gs-border)]">
            {product.details.map((line) => (
              <li
                key={line}
                className="flex items-center gap-2 text-xs text-[var(--gs-ink-secondary)]"
              >
                <Check
                  size={14}
                  weight="regular"
                  className="text-[var(--gs-gold)] shrink-0"
                  aria-hidden="true"
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          {product.personalizable && (
            <div className="space-y-2 pt-3 border-t border-[var(--gs-border)]">
              <label
                htmlFor="engraving-input"
                className="flex items-center gap-1.5 text-xs font-medium text-[var(--gs-ink)]"
              >
                <PencilSimpleLine
                  size={15}
                  weight="light"
                  className="text-[var(--gs-gold)]"
                  aria-hidden="true"
                />
                <span>Custom brass engraving (optional, max 28 characters)</span>
              </label>
              <input
                id="engraving-input"
                type="text"
                maxLength={28}
                value={engraving}
                onChange={(e) => setEngraving(e.target.value)}
                placeholder="e.g. A & R — Nov 2026"
                className="w-full px-3 py-2 text-sm rounded-[4px] border border-[var(--gs-border-strong)] bg-[var(--gs-bg)] text-[var(--gs-ink)]"
              />
            </div>
          )}

          <button
            type="button"
            disabled={isOut}
            onClick={() => {
              addToCart(product.id, engraving);
              onClose();
            }}
            className={`w-full py-3 rounded-[4px] text-sm font-medium transition-colors ${
              isOut
                ? 'bg-[var(--gs-surface-chip)] text-[var(--gs-ink-muted)] cursor-not-allowed'
                : 'bg-[var(--gs-ink)] text-[var(--gs-surface)] hover:bg-[var(--gs-accent)]'
            }`}
          >
            {isOut ? 'Sold out' : `Add to bag — ${formatINR(product.price)}`}
          </button>
        </div>
      </div>
    </ModalDialog>
  );
}
