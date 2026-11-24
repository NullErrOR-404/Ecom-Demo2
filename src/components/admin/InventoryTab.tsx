import { useMemo, useState, type FormEvent } from 'react';
import { MagnifyingGlass, Minus, Plus, Trash, X } from '@phosphor-icons/react';
import { DEPARTMENTS, OCCASIONS } from '../../data/seed';
import { useDemoStore } from '../../store/demoStore';
import type { Department, Occasion } from '../../types/shop';
import { ModalDialog } from '../ModalDialog';

export function InventoryTab() {
  const { products, adjustStock, updateProductPrice, addProduct, deleteProduct } = useDemoStore();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState<'All' | Department>('All');
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [department, setDepartment] = useState<Department>(DEPARTMENTS[0]);
  const [occasion, setOccasion] = useState<Occasion>(OCCASIONS[0]);
  const [price, setPrice] = useState('2499');
  const [stock, setStock] = useState('12');
  const [personalizable, setPersonalizable] = useState(false);
  const [description, setDescription] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (deptFilter !== 'All' && p.department !== deptFilter) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [products, search, deptFilter]);

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addProduct({
      name,
      department,
      occasion,
      price: Number(price) || 1999,
      stock: Number(stock) || 10,
      personalizable,
      description,
    });
    setName('');
    setPrice('2499');
    setStock('12');
    setPersonalizable(false);
    setDescription('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium text-[var(--gs-ink)]">
            Inventory Manager
          </h1>
          <p className="text-xs text-[var(--gs-ink-secondary)] mt-1">
            Edit stock quantities, pricing, or add new items to the storefront catalog.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-[4px] text-xs font-medium bg-[var(--gs-ink)] text-[var(--gs-surface)] hover:bg-[var(--gs-accent)] transition-colors flex items-center gap-1.5"
        >
          <Plus size={15} weight="regular" aria-hidden="true" />
          <span>Add product</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <MagnifyingGlass
            size={15}
            weight="regular"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gs-ink-muted)]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SKU or name..."
            className="pl-9 pr-3 py-1.5 text-xs rounded-[4px] border border-[var(--gs-border-strong)] bg-[var(--gs-surface)] text-[var(--gs-ink)] w-56"
          />
        </div>
        <select
          aria-label="Filter inventory by department"
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value as 'All' | Department)}
          className="px-3 py-1.5 text-xs rounded-[4px] border border-[var(--gs-border-strong)] bg-[var(--gs-surface)] text-[var(--gs-ink)]"
        >
          <option value="All">All departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Inventory Table */}
      <div className="border border-[var(--gs-border)] bg-[var(--gs-surface)] overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[var(--gs-border)] bg-[var(--gs-surface-muted)] text-[var(--gs-ink-secondary)]">
              <th className="py-3 px-4 font-medium">Product</th>
              <th className="py-3 px-4 font-medium">Department</th>
              <th className="py-3 px-4 font-medium text-right">Price (₹)</th>
              <th className="py-3 px-4 font-medium text-center">Stock</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium text-right">Remove</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--gs-surface-chip)]">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-[var(--gs-bg)]/50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-11 object-cover rounded-[2px] shrink-0 bg-[var(--gs-surface-chip)]"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-[var(--gs-ink)] truncate">{p.name}</p>
                      <p className="text-[11px] text-[var(--gs-ink-muted)] tabular-nums">{p.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-[var(--gs-ink-secondary)]">{p.department}</td>
                <td className="py-3 px-4 text-right">
                  <input
                    type="number"
                    min={99}
                    step={50}
                    aria-label={`Price for ${p.name}`}
                    value={p.price}
                    onChange={(e) => updateProductPrice(p.id, Number(e.target.value))}
                    className="w-24 text-right tabular-nums px-2 py-1 rounded-[3px] border border-[var(--gs-border)] bg-[var(--gs-bg)] text-[var(--gs-ink)]"
                  />
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => adjustStock(p.id, -1)}
                      aria-label={`Decrease stock for ${p.name}`}
                      className="p-1 rounded-[3px] border border-[var(--gs-border)] hover:bg-[var(--gs-surface-chip)] transition-colors"
                    >
                      <Minus size={13} weight="regular" />
                    </button>
                    <span className="tabular-nums w-7 text-center font-semibold text-[var(--gs-ink)]">
                      {p.stock}
                    </span>
                    <button
                      type="button"
                      onClick={() => adjustStock(p.id, 1)}
                      aria-label={`Increase stock for ${p.name}`}
                      className="p-1 rounded-[3px] border border-[var(--gs-border)] hover:bg-[var(--gs-surface-chip)] transition-colors"
                    >
                      <Plus size={13} weight="regular" />
                    </button>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {p.stock === 0 ? (
                    <span className="px-2 py-0.5 rounded-[3px] bg-[var(--gs-danger-soft)] text-[var(--gs-danger)] font-medium">
                      Out of stock
                    </span>
                  ) : p.stock <= 5 ? (
                    <span className="px-2 py-0.5 rounded-[3px] bg-[var(--gs-amber-soft)] text-[var(--gs-amber)] font-medium">
                      Low stock
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-[3px] bg-[var(--gs-sage-soft)] text-[var(--gs-sage)] font-medium">
                      In stock
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => deleteProduct(p.id)}
                    aria-label={`Remove ${p.name}`}
                    className="p-1.5 rounded-[3px] text-[var(--gs-ink-muted)] hover:text-[var(--gs-danger)] hover:bg-[var(--gs-danger-soft)] transition-colors"
                  >
                    <Trash size={15} weight="regular" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      <ModalDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        ariaLabel="Add catalog product"
        variant="center"
      >
        <form onSubmit={handleCreate} className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--gs-surface-chip)]">
            <h1 className="font-display text-2xl font-medium text-[var(--gs-ink)]">
              Add catalog item
            </h1>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              aria-label="Close modal"
              className="p-1 text-[var(--gs-ink-secondary)] hover:text-[var(--gs-ink)]"
            >
              <X size={18} weight="regular" />
            </button>
          </div>

          <div className="space-y-1">
            <label htmlFor="new-prod-name" className="text-xs font-medium text-[var(--gs-ink)]">
              Product name
            </label>
            <input
              id="new-prod-name"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Hammered Copper Incense Holder"
              className="w-full px-3 py-2 text-xs rounded-[4px] border border-[var(--gs-border-strong)] bg-[var(--gs-bg)] text-[var(--gs-ink)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="new-prod-dept" className="text-xs font-medium text-[var(--gs-ink)]">
                Department
              </label>
              <select
                id="new-prod-dept"
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full px-2.5 py-2 text-xs rounded-[4px] border border-[var(--gs-border-strong)] bg-[var(--gs-bg)] text-[var(--gs-ink)]"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label htmlFor="new-prod-occ" className="text-xs font-medium text-[var(--gs-ink)]">
                Occasion
              </label>
              <select
                id="new-prod-occ"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value as Occasion)}
                className="w-full px-2.5 py-2 text-xs rounded-[4px] border border-[var(--gs-border-strong)] bg-[var(--gs-bg)] text-[var(--gs-ink)]"
              >
                {OCCASIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="new-prod-price" className="text-xs font-medium text-[var(--gs-ink)]">
                Price (₹)
              </label>
              <input
                id="new-prod-price"
                type="number"
                min={99}
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 text-xs tabular-nums rounded-[4px] border border-[var(--gs-border-strong)] bg-[var(--gs-bg)] text-[var(--gs-ink)]"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="new-prod-stock" className="text-xs font-medium text-[var(--gs-ink)]">
                Initial stock
              </label>
              <input
                id="new-prod-stock"
                type="number"
                min={0}
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 text-xs tabular-nums rounded-[4px] border border-[var(--gs-border-strong)] bg-[var(--gs-bg)] text-[var(--gs-ink)]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="new-prod-desc" className="text-xs font-medium text-[var(--gs-ink)]">
              Short description
            </label>
            <textarea
              id="new-prod-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Materials, dimensions, and packaging details..."
              className="w-full px-3 py-2 text-xs rounded-[4px] border border-[var(--gs-border-strong)] bg-[var(--gs-bg)] text-[var(--gs-ink)]"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-[var(--gs-ink)] cursor-pointer">
            <input
              type="checkbox"
              checked={personalizable}
              onChange={(e) => setPersonalizable(e.target.checked)}
              className="accent-[var(--gs-accent)]"
            />
            <span>Supports custom brass engraving</span>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-[4px] border border-[var(--gs-border-strong)] text-xs font-medium text-[var(--gs-ink)] hover:bg-[var(--gs-surface-chip)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-[4px] text-xs font-medium bg-[var(--gs-ink)] text-[var(--gs-surface)] hover:bg-[var(--gs-accent)] transition-colors"
            >
              Save product
            </button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
}
