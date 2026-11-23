import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, Edit3, Trash2, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getCategoryById, expenseCategories, incomeCategories, allCategories } from '../../data/categories';
import { formatCurrency } from '../../utils/currency';
import './Transactions.css';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const TransactionsPage = ({ searchQuery, onAddTransaction, onEditTransaction }) => {
  const { transactions, deleteTransaction, settings } = useApp();
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = useMemo(() => {
    let result = [...transactions];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => t.description.toLowerCase().includes(q) || (t.note && t.note.toLowerCase().includes(q)));
    }
    if (typeFilter !== 'all') result = result.filter(t => t.type === typeFilter);
    if (categoryFilter !== 'all') result = result.filter(t => t.category === categoryFilter);
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'highest') return b.amount - a.amount;
      if (sortBy === 'lowest') return a.amount - b.amount;
      return 0;
    });
    return result;
  }, [transactions, searchQuery, typeFilter, categoryFilter, sortBy]);

  const handleDelete = (id) => {
    deleteTransaction(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="transactions-page">
      <div className="tx-toolbar">
        <div className="tx-filters">
          <div className="filter-group">
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="filter-select">
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <ChevronDown size={14} className="select-chevron" />
          </div>
          <div className="filter-group">
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="filter-select">
              <option value="all">All Categories</option>
              <optgroup label="Expenses">
                {expenseCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </optgroup>
              <optgroup label="Income">
                {incomeCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </optgroup>
            </select>
            <ChevronDown size={14} className="select-chevron" />
          </div>
          <div className="filter-group">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="filter-select">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
            <ChevronDown size={14} className="select-chevron" />
          </div>
        </div>
        <button className="btn-primary" onClick={() => onAddTransaction('expense')}>
          <Plus size={18} /> Add Transaction
        </button>
      </div>

      <div className="tx-summary-bar">
        <span className="tx-count">{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</span>
        <div className="tx-totals">
          <span className="tx-total-income">
            Income: {formatCurrency(filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), settings.currency)}
          </span>
          <span className="tx-total-expense">
            Expenses: {formatCurrency(filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), settings.currency)}
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <motion.div className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="empty-icon">📊</div>
          <h3>No transactions found</h3>
          <p>Try adjusting your filters or add a new transaction.</p>
          <button className="btn-primary" onClick={() => onAddTransaction('expense')}>
            <Plus size={18} /> Add Transaction
          </button>
        </motion.div>
      ) : (
        <motion.div className="tx-list" variants={container} initial="hidden" animate="show">
          <AnimatePresence mode="popLayout">
            {filtered.map(tx => {
              const cat = getCategoryById(tx.category);
              const Icon = cat?.icon;
              return (
                <motion.div
                  key={tx.id}
                  className="tx-row"
                  variants={item}
                  layout
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                >
                  <div className="tx-row-left">
                    <div className="tx-cat-icon" style={{ background: `${cat?.color}15`, color: cat?.color }}>
                      {Icon && <Icon size={20} />}
                    </div>
                    <div className="tx-row-info">
                      <span className="tx-row-desc">{tx.description}</span>
                      <span className="tx-row-meta">
                        {cat?.name} • {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {tx.note && ` • ${tx.note}`}
                      </span>
                    </div>
                  </div>
                  <div className="tx-row-right">
                    <span className={`tx-row-amount ${tx.type === 'income' ? 'amount-income' : 'amount-expense'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, settings.currency)}
                    </span>
                    <div className="tx-row-actions">
                      <button className="tx-action-btn" onClick={() => onEditTransaction(tx)} title="Edit">
                        <Edit3 size={15} />
                      </button>
                      {deleteConfirm === tx.id ? (
                        <div className="delete-confirm">
                          <button className="btn-delete-yes" onClick={() => handleDelete(tx.id)}>Delete</button>
                          <button className="btn-delete-no" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                        </div>
                      ) : (
                        <button className="tx-action-btn tx-action-delete" onClick={() => setDeleteConfirm(tx.id)} title="Delete">
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default TransactionsPage;
