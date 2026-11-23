import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, DollarSign, Receipt, PiggyBank, BarChart3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/currency';
import { getMonthlyIncome, getMonthlyExpenses, getMonthlySavings, getSavingsRate, getCategoryBreakdown, getMonthlyTrend, getPercentageChange } from '../../utils/calculations';
import { getCategoryById } from '../../data/categories';
import AnimatedCounter from '../common/AnimatedCounter';
import './Analytics.css';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const ChartTooltip = ({ active, payload, label, currency }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="tooltip-value" style={{ color: p.color || p.fill }}>
          {p.name}: {formatCurrency(p.value, currency)}
        </p>
      ))}
    </div>
  );
};

const AnalyticsPage = () => {
  const { transactions, settings } = useApp();
  const now = new Date();
  const cy = now.getFullYear(), cm = now.getMonth();
  const pm = cm === 0 ? 11 : cm - 1, py = cm === 0 ? cy - 1 : cy;

  const income = getMonthlyIncome(transactions, cy, cm);
  const expenses = getMonthlyExpenses(transactions, cy, cm);
  const savings = getMonthlySavings(transactions, cy, cm);
  const savingsRate = getSavingsRate(transactions, cy, cm);
  const prevExpenses = getMonthlyExpenses(transactions, py, pm);
  const expenseChange = getPercentageChange(expenses, prevExpenses);
  const trend = getMonthlyTrend(transactions);
  const breakdown = getCategoryBreakdown(
    transactions.filter(t => { const d = new Date(t.date); return d.getFullYear() === cy && d.getMonth() === cm; }),
    'expense'
  );

  const totalTx = transactions.filter(t => { const d = new Date(t.date); return d.getFullYear() === cy && d.getMonth() === cm; }).length;
  const monthlyExpenseTx = transactions.filter(t => { const d = new Date(t.date); return d.getFullYear() === cy && d.getMonth() === cm && t.type === 'expense'; });
  const avgExpense = monthlyExpenseTx.length > 0 ? Math.round(monthlyExpenseTx.reduce((s, t) => s + t.amount, 0) / monthlyExpenseTx.length) : 0;
  const highestCat = breakdown[0] ? getCategoryById(breakdown[0].category) : null;

  const breakdownChart = useMemo(() => breakdown.map(d => ({
    ...d,
    name: getCategoryById(d.category)?.name || d.category,
    color: getCategoryById(d.category)?.color || '#94a3b8',
  })), [breakdown]);

  const savingsTrend = trend.map(t => ({
    month: t.month,
    savings: t.savings,
    rate: t.income > 0 ? Math.round((t.savings / t.income) * 100) : 0,
  }));

  return (
    <motion.div className="analytics-page" variants={container} initial="hidden" animate="show">
      {/* Stats Row */}
      <div className="analytics-stats">
        <motion.div className="stat-card" variants={item}>
          <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--emerald-400)' }}><TrendingUp size={20} /></div>
          <div className="stat-info">
            <span className="stat-label">Total Income</span>
            <span className="stat-value"><AnimatedCounter value={income} currency={settings.currency} /></span>
          </div>
        </motion.div>
        <motion.div className="stat-card" variants={item}>
          <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red-400)' }}><TrendingDown size={20} /></div>
          <div className="stat-info">
            <span className="stat-label">Total Expenses</span>
            <span className="stat-value"><AnimatedCounter value={expenses} currency={settings.currency} /></span>
            <span className={`stat-change ${expenseChange <= 0 ? 'change-up' : 'change-down'}`}>
              {expenseChange <= 0 ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
              {Math.abs(expenseChange)}% vs last month
            </span>
          </div>
        </motion.div>
        <motion.div className="stat-card" variants={item}>
          <div className="stat-icon" style={{ background: 'rgba(6,182,212,0.1)', color: 'var(--cyan-400)' }}><PiggyBank size={20} /></div>
          <div className="stat-info">
            <span className="stat-label">Net Savings</span>
            <span className="stat-value"><AnimatedCounter value={savings} currency={settings.currency} /></span>
            <span className="stat-sub">{savingsRate}% savings rate</span>
          </div>
        </motion.div>
        <motion.div className="stat-card" variants={item}>
          <div className="stat-icon" style={{ background: 'rgba(168,85,247,0.1)', color: 'var(--purple-400)' }}><BarChart3 size={20} /></div>
          <div className="stat-info">
            <span className="stat-label">Avg Expense</span>
            <span className="stat-value"><AnimatedCounter value={avgExpense} currency={settings.currency} /></span>
            <span className="stat-sub">{totalTx} transactions this month</span>
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="analytics-charts-grid">
        <motion.div className="analytics-card analytics-card-wide" variants={item}>
          <div className="card-glass" />
          <h3>Monthly Income vs Expenses</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={trend} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                <Tooltip content={<ChartTooltip currency={settings.currency} />} />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div className="analytics-card" variants={item}>
          <div className="card-glass" />
          <h3>Spending by Category</h3>
          {breakdownChart.length === 0 ? (
            <div className="chart-empty">No expense data this month</div>
          ) : (
            <>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={breakdownChart} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={3} dataKey="amount" animationDuration={800}>
                      {breakdownChart.map((e, i) => <Cell key={i} fill={e.color} stroke="transparent" />)}
                    </Pie>
                    <Tooltip content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return <div className="chart-tooltip"><p className="tooltip-label">{d.name}</p><p className="tooltip-value">{formatCurrency(d.amount, settings.currency)} ({d.percentage}%)</p></div>;
                    }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="category-list">
                {breakdownChart.map((d, i) => (
                  <div key={i} className="category-row">
                    <span className="cat-dot" style={{ background: d.color }} />
                    <span className="cat-name">{d.name}</span>
                    <span className="cat-amount">{formatCurrency(d.amount, settings.currency)}</span>
                    <span className="cat-pct">{d.percentage}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Savings Trend & Highest Category */}
      <div className="analytics-bottom-row">
        <motion.div className="analytics-card analytics-card-wide" variants={item}>
          <div className="card-glass" />
          <h3>Savings Trend</h3>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <AreaChart data={savingsTrend} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                <Tooltip content={<ChartTooltip currency={settings.currency} />} />
                <Area type="monotone" dataKey="savings" name="Savings" stroke="#06b6d4" strokeWidth={2} fill="url(#savingsGrad)" dot={false} activeDot={{ r: 5, stroke: '#06b6d4', strokeWidth: 2, fill: '#0a0a0f' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div className="analytics-card" variants={item}>
          <div className="card-glass" />
          <h3>Highlights</h3>
          <div className="highlights">
            <div className="highlight-item">
              <span className="highlight-label">Highest Category</span>
              {highestCat ? (
                <div className="highlight-value-row">
                  <span className="highlight-dot" style={{ background: highestCat.color }} />
                  <span className="highlight-name">{highestCat.name}</span>
                  <span className="highlight-amount">{formatCurrency(breakdown[0].amount, settings.currency)}</span>
                </div>
              ) : <span className="highlight-empty">No data</span>}
            </div>
            <div className="highlight-item">
              <span className="highlight-label">Total Transactions</span>
              <span className="highlight-big">{totalTx}</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-label">Average Expense</span>
              <span className="highlight-big">{formatCurrency(avgExpense, settings.currency)}</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-label">Savings Rate</span>
              <span className={`highlight-big ${savingsRate >= 0 ? 'text-green' : 'text-red'}`}>{savingsRate}%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalyticsPage;
