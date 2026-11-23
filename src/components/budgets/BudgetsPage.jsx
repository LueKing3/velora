import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { expenseCategories, getCategoryById } from '../../data/categories';
import { formatCurrency } from '../../utils/currency';
import { getSpentInCategory } from '../../utils/calculations';
import './Budgets.css';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const BudgetsPage = () => {
  const { budgets, transactions, settings, addBudget, updateBudget, deleteBudget } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ category: '', amount: '', month: new Date().toISOString().slice(0, 7) });
  const [errors, setErrors] = useState({});

  const now = new Date();

  const openAdd = () => { setEditing(null); setForm({ category: '', amount: '', month: new Date().toISOString().slice(0, 7) }); setErrors({}); setShowModal(true); };
  const openEdit = (b) => { setEditing(b); setForm({ category: b.category, amount: String(b.amount), month: b.month }); setErrors({}); setShowModal(true); };

  const validate = () => {
    const errs = {};
    if (!form.category) errs.category = 'Select a category';
    if (!form.amount || Number(form.amount) <= 0) errs.amount = 'Enter a positive amount';
    if (!editing && budgets.some(b => b.category === form.category && b.month === form.month)) errs.category = 'Budget already exists for this category';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editing) {
      updateBudget(editing.id, { category: form.category, amount: Number(form.amount), month: form.month });
    } else {
      addBudget({ category: form.category, amount: Number(form.amount), month: form.month });
    }
    setShowModal(false);
  };

  const currentBudgets = budgets.filter(b => b.month === new Date().toISOString().slice(0, 7));

  return (
    <div className="budgets-page">
      <div className="budgets-toolbar">
        <div>
          <span className="budgets-month">{now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus size={18} /> Add Budget</button>
      </div>

      {currentBudgets.length === 0 ? (
        <motion.div className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="empty-icon">📋</div>
          <h3>No budgets set</h3>
          <p>Create category budgets to track your spending limits.</p>
          <button className="btn-primary" onClick={openAdd}><Plus size={18} /> Create Budget</button>
        </motion.div>
      ) : (
        <motion.div className="budgets-grid" variants={container} initial="hidden" animate="show">
          {currentBudgets.map(budget => {
            const cat = getCategoryById(budget.category);
            const Icon = cat?.icon;
            const [y, m] = budget.month.split('-').map(Number);
            const spent = getSpentInCategory(transactions, budget.category, y, m - 1);
            const remaining = budget.amount - spent;
            const pct = Math.min(Math.round((spent / budget.amount) * 100), 100);
            const overBudget = spent > budget.amount;
            const nearLimit = pct >= 80 && !overBudget;

            return (
              <motion.div key={budget.id} className="budget-card" variants={item}>
                <div className="card-glass" />
                <div className="budget-card-header">
                  <div className="budget-cat-icon" style={{ background: `${cat?.color}15`, color: cat?.color }}>
                    {Icon && <Icon size={20} />}
                  </div>
                  <div className="budget-cat-info">
                    <span className="budget-cat-name">{cat?.name || budget.category}</span>
                    <span className={`budget-status ${overBudget ? 'status-over' : nearLimit ? 'status-near' : 'status-ok'}`}>
                      {overBudget ? (
                        <><AlertTriangle size={12} /> Over Budget</>
                      ) : nearLimit ? (
                        <><AlertTriangle size={12} /> Near Limit</>
                      ) : (
                        <><CheckCircle size={12} /> Within Budget</>
                      )}
                    </span>
                  </div>
                  <div className="budget-actions">
                    <button className="tx-action-btn" onClick={() => openEdit(budget)}><Edit3 size={15} /></button>
                    <button className="tx-action-btn tx-action-delete" onClick={() => deleteBudget(budget.id)}><Trash2 size={15} /></button>
                  </div>
                </div>

                <div className="budget-progress-wrap">
                  <div className="budget-progress-bar">
                    <motion.div
                      className={`budget-progress-fill ${overBudget ? 'fill-over' : nearLimit ? 'fill-near' : 'fill-ok'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="budget-pct">{pct}%</span>
                </div>

                <div className="budget-amounts">
                  <div className="budget-amt-item">
                    <span className="budget-amt-label">Spent</span>
                    <span className="budget-amt-value">{formatCurrency(spent, settings.currency)}</span>
                  </div>
                  <div className="budget-amt-item">
                    <span className="budget-amt-label">Budget</span>
                    <span className="budget-amt-value">{formatCurrency(budget.amount, settings.currency)}</span>
                  </div>
                  <div className="budget-amt-item">
                    <span className="budget-amt-label">Remaining</span>
                    <span className={`budget-amt-value ${remaining < 0 ? 'text-red' : 'text-green'}`}>
                      {formatCurrency(Math.abs(remaining), settings.currency)}
                      {remaining < 0 && ' over'}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Budget Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
            <motion.div className="modal-container" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
              <div className="modal-header">
                <h2>{editing ? 'Edit Budget' : 'Add Budget'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
              </div>
              <div className="modal-form" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="form-group">
                  <label>Category *</label>
                  <div className="category-grid">
                    {expenseCategories.map(cat => {
                      const CIcon = cat.icon;
                      return (
                        <button key={cat.id} type="button"
                          className={`category-chip ${form.category === cat.id ? 'category-chip-active' : ''}`}
                          onClick={() => setForm(f => ({ ...f, category: cat.id }))}
                          style={form.category === cat.id ? { borderColor: cat.color, background: `${cat.color}15` } : {}}
                          disabled={!editing && budgets.some(b => b.category === cat.id && b.month === form.month)}
                        >
                          <CIcon size={15} style={{ color: cat.color }} />
                          <span>{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.category && <span className="error-text">{errors.category}</span>}
                </div>
                <div className="form-group">
                  <label>Budget Amount *</label>
                  <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0" min="0" className={errors.amount ? 'input-error' : ''} />
                  {errors.amount && <span className="error-text">{errors.amount}</span>}
                </div>
                <div className="modal-actions">
                  <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="btn-primary" onClick={handleSave}>{editing ? 'Update' : 'Create'} Budget</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BudgetsPage;
