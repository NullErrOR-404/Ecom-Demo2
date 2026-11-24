import { useState } from 'react';
import { Minus, Plus, X } from '@phosphor-icons/react';
import { GIFT_WRAP_FEE } from '../../data/seed';
import { formatINR } from '../../lib/format';
import { useDemoStore } from '../../store/demoStore';
import { ModalDialog } from '../ModalDialog';

export function CartDrawer() {
  const {
    cartOpen,
    setCartOpen,
    cart,
    products,
    giftWrap,
    setGiftWrap,
    giftNote,
    setGiftNote,
    updateCartQty,
    placeDemoOrder,
  } = useDemoStore();

  const [customerName, setCustomerName] = useState('Aarav Sharma');
  const [city, setCity] = useState('Bengaluru');

  const subtotal = cart.reduce((sum, item) => {
    const prod = products.find((p) => p.id === item.productId);
    return sum + (prod ? prod.price * item.qty : 0);
  }, 0);
  const wrapCost = cart.length > 0 && giftWrap ? GIFT_WRAP_FEE : 0;
  const total = subtotal + wrapCost;

  return (
    <ModalDialog
      open={cartOpen}
      onClose={() => setCartOpen(false)}
      ariaLabel="Your gift bag"
      variant="drawer"
    >
      <div className="h-full flex flex-col">
        <div className="px-5 py-4 border-b border-[var(--gs-border)] flex items-center justify-between">
          <h1 className="font-display text-2xl font-medium text-[var(--gs-ink)]">Your gift bag</h1>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Close bag"
            className="p-1.5 rounded-[4px] text-[var(--gs-ink-secondary)] hover:text-[var(--gs-ink)] hover:bg-[var(--gs-surface-muted)] transition-colors"
          >
            <X size={18} weight="regular" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-5">
          {cart.length === 0 ? (
            <p className="text-sm text-[var(--gs-ink-secondary)] text-center py-12">
              Your bag is empty. Add a gift from the collection to place a demo order.
            </p>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map((item, idx) => {
                  const prod = products.find((p) => p.id === item.productId);
                  if (!prod) return null;
                  return (
                    <div
                      key={`${item.productId}-${item.engraving}`}
                      className="flex gap-3.5 pb-4 border-b border-[var(--gs-surface-chip)]"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-16 h-20 object-cover rounded-[3px] shrink-0 bg-[var(--gs-surface-chip)]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--gs-ink)] leading-snug">
                          {prod.name}
                        </p>
                        {item.engraving && (
                          <p className="text-xs text-[var(--gs-gold)] mt-0.5 truncate">
                            Engraving: “{item.engraving}”
                          </p>
                        )}
                        <p className="tabular-nums text-xs text-[var(--gs-ink-secondary)] mt-1">
                          {formatINR(prod.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 self-start">
                        <button
                          type="button"
                          onClick={() => updateCartQty(idx, -1)}
                          aria-label={`Decrease quantity for ${prod.name}`}
                          className="p-1 rounded-[3px] border border-[var(--gs-border)] hover:bg-[var(--gs-surface-muted)] transition-colors"
                        >
                          <Minus size={13} weight="regular" />
                        </button>
                        <span className="tabular-nums text-xs font-medium w-5 text-center">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQty(idx, 1)}
                          aria-label={`Increase quantity for ${prod.name}`}
                          className="p-1 rounded-[3px] border border-[var(--gs-border)] hover:bg-[var(--gs-surface-muted)] transition-colors"
                        >
                          <Plus size={13} weight="regular" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between gap-3 p-3.5 rounded-[4px] border border-[var(--gs-border)] bg-[var(--gs-bg)] cursor-pointer">
                  <span className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={giftWrap}
                      onChange={(e) => setGiftWrap(e.target.checked)}
                      className="w-4 h-4 accent-[var(--gs-accent)]"
                    />
                    <span>
                      <span className="block text-xs font-medium text-[var(--gs-ink)]">
                        Signature linen gift wrap
                      </span>
                      <span className="block text-[11px] text-[var(--gs-ink-muted)]">
                        Terracotta cotton ribbon, wax seal and stationery card
                      </span>
                    </span>
                  </span>
                  <span className="tabular-nums text-xs font-medium text-[var(--gs-ink)] shrink-0">
                    +{formatINR(GIFT_WRAP_FEE)}
                  </span>
                </label>

                <div className="space-y-1.5">
                  <label htmlFor="gift-note" className="text-xs font-medium text-[var(--gs-ink)]">
                    Handwritten gift note
                  </label>
                  <textarea
                    id="gift-note"
                    rows={2}
                    maxLength={140}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="Write a personal message for the recipient..."
                    className="w-full px-3 py-2 text-xs rounded-[4px] border border-[var(--gs-border-strong)] bg-[var(--gs-bg)] text-[var(--gs-ink)]"
                  />
                </div>

                {giftNote.trim() && (
                  <div className="stationery-card rounded-[4px] p-4 space-y-1.5">
                    <p className="text-[11px] text-[var(--gs-gold)]">Stationery card preview</p>
                    <p className="font-display italic text-base text-[var(--gs-ink)] leading-relaxed">
                      “{giftNote}”
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--gs-surface-chip)]">
                  <div className="space-y-1">
                    <label
                      htmlFor="demo-customer"
                      className="text-xs text-[var(--gs-ink-secondary)]"
                    >
                      Recipient / buyer
                    </label>
                    <input
                      id="demo-customer"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-[4px] border border-[var(--gs-border-strong)] bg-[var(--gs-bg)] text-[var(--gs-ink)]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="demo-city" className="text-xs text-[var(--gs-ink-secondary)]">
                      City
                    </label>
                    <input
                      id="demo-city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-[4px] border border-[var(--gs-border-strong)] bg-[var(--gs-bg)] text-[var(--gs-ink)]"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-5 border-t border-[var(--gs-border)] bg-[var(--gs-bg)] space-y-3">
            <div className="flex justify-between text-xs text-[var(--gs-ink-secondary)]">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatINR(subtotal)}</span>
            </div>
            {wrapCost > 0 && (
              <div className="flex justify-between text-xs text-[var(--gs-ink-secondary)]">
                <span>Signature gift wrap</span>
                <span className="tabular-nums">{formatINR(wrapCost)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-semibold text-[var(--gs-ink)] pt-2 border-t border-[var(--gs-border)]">
              <span>Total</span>
              <span className="tabular-nums">{formatINR(total)}</span>
            </div>
            <button
              type="button"
              onClick={() => placeDemoOrder(customerName, city)}
              className="w-full py-3 rounded-[4px] text-sm font-medium bg-[var(--gs-accent)] text-[var(--gs-surface)] hover:bg-[var(--gs-accent-hover)] transition-colors"
            >
              Place demo order
            </button>
          </div>
        )}
      </div>
    </ModalDialog>
  );
}
