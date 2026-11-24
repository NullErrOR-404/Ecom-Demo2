import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { EASE_OUT, TIMING } from '../../lib/motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DEPARTMENTS } from '../../data/seed';
import { formatCompactINR, formatINR } from '../../lib/format';
import { useDemoStore } from '../../store/demoStore';
import type { DateRangeDays } from '../../types/shop';

const CHART_COLORS = ['#A84A2F', '#8E6E3F', '#496350', '#3D332D'];

export function AnalyticsTab() {
  const { orders, products } = useDemoStore();
  const [range, setRange] = useState<DateRangeDays>(30);

  const stats = useMemo(() => {
    const inRange = orders.filter((o) => o.createdAtDaysAgo <= range);
    const revenue = inRange.reduce((sum, o) => sum + o.total, 0);
    const orderCount = inRange.length;
    const avgOrder = orderCount > 0 ? Math.round(revenue / orderCount) : 0;
    const lowStockCount = products.filter((p) => p.stock <= 5).length;

    // Revenue by department
    const deptTotals = new Map<string, number>();
    DEPARTMENTS.forEach((d) => deptTotals.set(d, 0));
    inRange.forEach((o) => {
      o.items.forEach((item) => {
        deptTotals.set(
          item.department,
          (deptTotals.get(item.department) ?? 0) + item.price * item.qty
        );
      });
    });
    const byDepartment = DEPARTMENTS.map((name, idx) => ({
      name,
      value: deptTotals.get(name) ?? 0,
      color: CHART_COLORS[idx % CHART_COLORS.length],
    }));
    const deptGrandTotal = byDepartment.reduce((s, d) => s + d.value, 0) || 1;

    // Bucketed revenue over time
    const buckets = range === 7 ? 7 : 6;
    const step = range / buckets;
    const timeline = Array.from({ length: buckets }, (_, idx) => {
      const startDay = range - (idx + 1) * step;
      const endDay = range - idx * step;
      const bucketOrders = inRange.filter(
        (o) => o.createdAtDaysAgo >= startDay && o.createdAtDaysAgo <= endDay
      );
      const rev = bucketOrders.reduce((s, o) => s + o.total, 0);
      const label = idx === buckets - 1 ? 'Today' : `-${Math.round(endDay)}d`;
      return { label, revenue: rev, orders: bucketOrders.length };
    });

    // Top-selling gifts
    const giftMap = new Map<string, number>();
    inRange.forEach((o) => {
      o.items.forEach((item) => {
        giftMap.set(item.name, (giftMap.get(item.name) ?? 0) + item.price * item.qty);
      });
    });
    const topGifts = Array.from(giftMap.entries())
      .map(([name, rev]) => ({
        name: name.length > 26 ? `${name.slice(0, 24)}…` : name,
        fullName: name,
        revenue: rev,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      revenue,
      orderCount,
      avgOrder,
      lowStockCount,
      byDepartment,
      deptGrandTotal,
      timeline,
      topGifts,
    };
  }, [orders, products, range]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium text-[var(--gs-ink)]">
            Sales Analytics
          </h1>
          <p className="text-xs text-[var(--gs-ink-secondary)] mt-1">
            Revenue trends, department share, and top-performing gifts.
          </p>
        </div>

        <div
          role="group"
          aria-label="Date range"
          className="inline-flex p-0.5 rounded-[4px] border border-[var(--gs-border-strong)] bg-[var(--gs-surface-chip)]"
        >
          {([7, 30, 90] as const).map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => setRange(days)}
              className={`px-3 py-1 text-xs font-medium rounded-[3px] transition-colors ${
                range === days
                  ? 'bg-[var(--gs-surface)] text-[var(--gs-ink)] shadow-xs'
                  : 'text-[var(--gs-ink-secondary)] hover:text-[var(--gs-ink)]'
              }`}
            >
              {days}D
            </button>
          ))}
        </div>
      </div>

      {/* Hairline-divided KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border border-[var(--gs-border)] bg-[var(--gs-surface)] divide-y lg:divide-y-0 lg:divide-x divide-[var(--gs-border)]">
        {[
          { label: `Gross revenue (${range} days)`, value: formatINR(stats.revenue), accent: false },
          { label: 'Orders placed', value: String(stats.orderCount), accent: false },
          { label: 'Average order value', value: formatINR(stats.avgOrder), accent: false },
          {
            label: 'Low-stock SKUs (5 or fewer)',
            value: String(stats.lowStockCount),
            accent: stats.lowStockCount > 0,
            sage: stats.lowStockCount === 0,
          },
        ].map((kpi, idx) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: TIMING.panel, delay: idx * TIMING.stagger, ease: EASE_OUT }}
            className="p-5"
          >
            <p className="text-xs text-[var(--gs-ink-muted)]">{kpi.label}</p>
            <p
              className={`font-display tabular-nums text-3xl font-medium mt-1.5 ${
                kpi.accent
                  ? 'text-[var(--gs-accent)]'
                  : kpi.sage
                  ? 'text-[var(--gs-sage)]'
                  : 'text-[var(--gs-ink)]'
              }`}
            >
              {kpi.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Revenue Area Chart + Department Donut Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 border border-[var(--gs-border)] bg-[var(--gs-surface)] p-5">
          <h2 className="text-sm font-semibold text-[var(--gs-ink)] mb-4">
            Revenue over time ({range} days)
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.timeline} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A84A2F" stopOpacity={0.24} />
                    <stop offset="95%" stopColor="#A84A2F" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E9E1D3" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#75685D' }}
                  axisLine={{ stroke: '#D9CEBC' }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v: number) => formatCompactINR(v)}
                  tick={{ fontSize: 11, fill: '#75685D' }}
                  axisLine={false}
                  tickLine={false}
                  width={56}
                />
                <Tooltip
                  formatter={(value) => [formatINR(Number(value ?? 0)), 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#FBF8F3',
                    border: '1px solid #C5B69F',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#1D1714',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#A84A2F"
                  strokeWidth={2}
                  fill="url(#revGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="xl:col-span-5 border border-[var(--gs-border)] bg-[var(--gs-surface)] p-5 flex flex-col">
          <h2 className="text-sm font-semibold text-[var(--gs-ink)] mb-4">
            Sales by department
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-5 flex-1">
            <div className="w-44 h-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.byDepartment}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {stats.byDepartment.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [formatINR(Number(value ?? 0)), 'Sales']}
                    contentStyle={{
                      backgroundColor: '#FBF8F3',
                      border: '1px solid #C5B69F',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 w-full space-y-2.5">
              {stats.byDepartment.map((d) => {
                const pct = Math.round((d.value / stats.deptGrandTotal) * 100);
                return (
                  <div key={d.name} className="flex items-center justify-between gap-2 text-xs">
                    <span className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-[2px] shrink-0"
                        style={{ backgroundColor: d.color }}
                      />
                      <span className="truncate text-[var(--gs-ink)]">{d.name}</span>
                    </span>
                    <span className="tabular-nums text-[var(--gs-ink-secondary)] shrink-0">
                      {formatINR(d.value)} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Top Selling Gifts Horizontal Bar Chart */}
      <div className="border border-[var(--gs-border)] bg-[var(--gs-surface)] p-5">
        <h2 className="text-sm font-semibold text-[var(--gs-ink)] mb-4">
          Top-selling gifts ({range} days)
        </h2>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.topGifts}
              layout="vertical"
              margin={{ top: 4, right: 20, left: 16, bottom: 4 }}
            >
              <CartesianGrid stroke="#E9E1D3" strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(v: number) => formatCompactINR(v)}
                tick={{ fontSize: 11, fill: '#75685D' }}
                axisLine={{ stroke: '#D9CEBC' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={170}
                tick={{ fontSize: 11, fill: '#1D1714' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => [formatINR(Number(value ?? 0)), 'Revenue']}
                contentStyle={{
                  backgroundColor: '#FBF8F3',
                  border: '1px solid #C5B69F',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="revenue" fill="#8E6E3F" radius={[0, 3, 3, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
