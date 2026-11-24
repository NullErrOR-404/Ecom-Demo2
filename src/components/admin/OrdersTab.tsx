import { formatDaysAgo, formatINR } from '../../lib/format';
import { useDemoStore } from '../../store/demoStore';
import type { OrderStatus } from '../../types/shop';

const STATUSES: OrderStatus[] = ['Pending', 'Packed', 'Shipped', 'Delivered'];

export function OrdersTab() {
  const { orders, updateOrderStatus } = useDemoStore();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-medium text-[var(--gs-ink)]">Orders Log</h1>
        <p className="text-xs text-[var(--gs-ink-secondary)] mt-1">
          Fulfillment queue including custom engraving requests, linen gift wrap, and handwritten notes.
        </p>
      </div>

      <div className="border border-[var(--gs-border)] bg-[var(--gs-surface)] overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[var(--gs-border)] bg-[var(--gs-surface-muted)] text-[var(--gs-ink-secondary)]">
              <th className="py-3 px-4 font-medium">Order</th>
              <th className="py-3 px-4 font-medium">Customer</th>
              <th className="py-3 px-4 font-medium">Items and gift details</th>
              <th className="py-3 px-4 font-medium text-right">Total</th>
              <th className="py-3 px-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--gs-surface-chip)]">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-[var(--gs-bg)]/50">
                <td className="py-3.5 px-4 tabular-nums font-semibold text-[var(--gs-ink)]">
                  #{order.id}
                </td>
                <td className="py-3.5 px-4">
                  <p className="font-medium text-[var(--gs-ink)]">{order.customer}</p>
                  <p className="text-[11px] text-[var(--gs-ink-muted)]">
                    {order.city}, {formatDaysAgo(order.createdAtDaysAgo)}
                  </p>
                </td>
                <td className="py-3.5 px-4 text-[var(--gs-ink-secondary)] max-w-md space-y-1">
                  <div>
                    {order.items.map((item, idx) => (
                      <span key={`${order.id}-${item.productId}-${idx}`}>
                        {idx > 0 ? ', ' : ''}
                        {item.qty}× {item.name}
                        {item.engraving ? ` (“${item.engraving}”)` : ''}
                      </span>
                    ))}
                  </div>
                  {order.giftWrap && (
                    <p className="text-[11px] text-[var(--gs-gold)]">
                      Signature linen wrap{order.giftNote ? ` — “${order.giftNote}”` : ''}
                    </p>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right tabular-nums font-semibold text-[var(--gs-ink)]">
                  {formatINR(order.total)}
                </td>
                <td className="py-3.5 px-4">
                  <select
                    aria-label={`Order status for #${order.id}`}
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                    className="px-2.5 py-1 rounded-[3px] border border-[var(--gs-border-strong)] bg-[var(--gs-bg)] text-[var(--gs-ink)] text-xs"
                  >
                    {STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
