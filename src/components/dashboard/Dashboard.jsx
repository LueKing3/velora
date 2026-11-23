import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight, Plus, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/currency';
import { getBalance, getMonthlyIncome, getMonthlyExpenses, getMonthlySavings, getSavingsRate, getPercentageChange, getCategoryBreakdown, getMonthlyTrend } from '../../utils/calculations';
import { getCategoryById } from '../../data/categories';
import CashFlowChart from './CashFlowChart';
import ExpenseBreakdownChart from './ExpenseBreakdownChart';
import AnimatedCounter from '../common/AnimatedCounter';
import './Dashboard.css';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

const Dashboard = ({ onAddTransaction }) => {
  const { transactions, settings, setCurrentPage } = useApp();
  const now = new Date();
  const cy = now.getFullYear(), cm = now.getMonth();
  const pm = cm === 0 ? 11 : cm - 1, py = cm === 0 ? cy - 1 : cy;

  const balance = getBalance(transactions);
  const income = getMonthlyIncome(transactions, cy, cm);
  const expenses = getMonthlyExpenses(transactions, cy, cm);
  const savings = getMonthlySavings(transactions, cy, cm);
  const savingsRate = getSavingsRate(transactions, cy, cm);
  const prevIncome = getMonthlyIncome(transactions, py, pm);
  const prevExpenses = getMonthlyExpenses(transactions, py, pm);
  const incomeChange = getPercentageChange(income, prevIncome);
  const expenseChange = getPercentageChange(expenses, prevExpenses);
  const monthlyBreakdown = getCategoryBreakdown(transactions.filter(t => { const d = new Date(t.date); return d.getFullYear() === cy && d.getMonth() === cm; }), 'expense');
  const trend = getMonthlyTrend(transactions);
  const recentTx = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <motion.div className="dashboard" variants={container} initial="hidden" animate="show">
      {/* Summary Cards */}
      <div className="summary-cards">
        <motion.div className="summary-card summary-card-balance" variants={item}>
          <div className="card-glass" />
          <div className="summary-card-header">
            <div className="summary-icon-wrap summary-icon-balance">
              <Wallet size={20} />
            </div>
            <span className="summary-label">Total Balance</span>
          </div>
          <div className="summary-value-row">
            <span className="summary-value">
              <AnimatedCounter value={balance} currency={settings.currency} />
            </span>
          </div>
          <span className="summary-sub">All-time net balance</span>
        </motion.div>

        <motion.div className="summary-card summary-card-income" variants={item}>
          <div className="card-glass" />
          <div className="summary-card-header">
            <div className="summary-icon-wrap summary-icon-income">
              <TrendingUp size={20} />
            </div>
            <span className="summary-label">Monthly Income</span>
          </div>
          <div className="summary-value-row">
            <span className="summary-value">
              <AnimatedCounter value={income} currency={settings.currency} />
            </span>
            {prevIncome > 0 && (
              <span className={`summary-change ${incomeChange >= 0 ? 'change-up' : 'change-down'}`}>
                {incomeChange >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(incomeChange)}%
              </span>
            )}
          </div>
          <span className="summary-sub">vs last month</span>
        </motion.div>

        <motion.div className="summary-card summary-card-expense" variants={item}>
          <div className="card-glass" />
          <div className="summary-card-header">
            <div className="summary-icon-wrap summary-icon-expense">
              <TrendingDown size={20} />
            </div>
            <span className="summary-label">Monthly Expenses</span>
          </div>
          <div className="summary-value-row">
            <span className="summary-value">
              <AnimatedCounter value={expenses} currency={settings.currency} />
            </span>
            {prevExpenses > 0 && (
              <span className={`summary-change ${expenseChange <= 0 ? 'change-up' : 'change-down'}`}>
                {expenseChange <= 0 ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                {Math.abs(expenseChange)}%
              </span>
            )}
          </div>
          <span className="summary-sub">vs last month</span>
        </motion.div>

        <motion.div className="summary-card summary-card-savings" variants={item}>
          <div className="card-glass" />
          <div className="summary-card-header">
            <div className="summary-icon-wrap summary-icon-savings">
              <PiggyBank size={20} />
            </div>
            <span className="summary-label">Savings</span>
          </div>
          <div className="summary-value-row">
            <span className="summary-value">
              <AnimatedCounter value={savings} currency={settings.currency} />
            </span>
            <span className={`summary-change ${savingsRate >= 0 ? 'change-up' : 'change-down'}`}>
              {savingsRate}%
            </span>
          </div>
          <span className="summary-sub">of monthly income saved</span>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="dashboard-charts-row">
        <motion.div className="dashboard-card chart-card-wide" variants={item}>
          <div className="card-glass" />
          <div className="dashboard-card-header">
            <h3>Cash Flow</h3>
            <span className="card-header-sub">Income vs Expenses trend</span>
          </div>
          <CashFlowChart data={trend} currency={settings.currency} />
        </motion.div>

        <motion.div className="dashboard-card chart-card-narrow" variants={item}>
          <div className="card-glass" />
          <div className="dashboard-card-header">
            <h3>Expense Breakdown</h3>
            <span className="card-header-sub">This month by category</span>
          </div>
          <ExpenseBreakdownChart data={monthlyBreakdown} currency={settings.currency} />
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="dashboard-bottom-row">
        <motion.div className="dashboard-card recent-tx-card" variants={item}>
          <div className="card-glass" />
          <div className="dashboard-card-header">
            <h3>Recent Transactions</h3>
            <button className="card-action-btn" onClick={() => setCurrentPage('transactions')}>
              View All <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="recent-tx-list">
            {recentTx.length === 0 ? (
              <div className="empty-state-mini">
                <p>No transactions yet</p>
                <button className="btn-add-mini" onClick={() => onAddTransaction('expense')}>
                  <Plus size={14} /> Add Transaction
                </button>
              </div>
            ) : (
              recentTx.map(tx => {
                const cat = getCategoryById(tx.category);
                const Icon = cat?.icon;
                return (
                  <div key={tx.id} className="recent-tx-item">
                    <div className="recent-tx-icon" style={{ background: `${cat?.color}15`, color: cat?.color }}>
                      {Icon && <Icon size={18} />}
                    </div>
                    <div className="recent-tx-info">
                      <span className="recent-tx-desc">{tx.description}</span>
                      <span className="recent-tx-date">{new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <span className={`recent-tx-amount ${tx.type === 'income' ? 'amount-income' : 'amount-expense'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, settings.currency)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

        <motion.div className="dashboard-card quick-actions-card" variants={item}>
          <div className="card-glass" />
          <div className="dashboard-card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <button className="quick-action-btn qa-expense" onClick={() => onAddTransaction('expense')}>
              <div className="qa-icon"><TrendingDown size={22} /></div>
              <span>Add Expense</span>
            </button>
            <button className="quick-action-btn qa-income" onClick={() => onAddTransaction('income')}>
              <div className="qa-icon"><TrendingUp size={22} /></div>
              <span>Add Income</span>
            </button>
            <button className="quick-action-btn qa-analytics" onClick={() => setCurrentPage('analytics')}>
              <div className="qa-icon"><Eye size={22} /></div>
              <span>View Analytics</span>
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
