import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getCategoriesByType } from '../../data/categories';
import './TransactionModal.css';

const TransactionModal = ({ isOpen, onClose, onSave, editingTransaction }) => {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        description: editingTransaction.description,
        amount: String(editingTransaction.amount),
        type: editingTransaction.type,
        category: editingTransaction.category,
        date: editingTransaction.date,
        note: editingTransaction.note || '',
      });
    } else if (isOpen) {
      setForm(f => ({
        description: '',
        amount: '',
        type: isOpen,
        category: '',
        date: new Date().toISOString().split('T')[0],
        note: '',
      }));
    }
    setErrors({});
  }, [editingTransaction, isOpen]);

  const validate = () => {
    const errs = {};
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.amount || Number(form.amount) <= 0) errs.amount = 'Enter a positive amount';
    if (!form.category) errs.category = 'Select a category';
    if (!form.date) errs.date = 'Select a date';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...(editingTransaction ? { id: editingTransaction.id } : {}),
      description: form.description.trim(),
      amount: Number(form.amount),
      type: form.type,
      category: form.category,
      date: form.date,
      note: form.note.trim(),
    });
    onClose();
  };

  const categories = getCategoriesByType(form.type);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-container"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
              <button className="modal-close" onClick={onClose}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {/* Type Toggle */}
              <div className="type-toggle">
                <button
                  type="button"
                  className={`type-btn ${form.type === 'expense' ? 'type-btn-active type-expense' : ''}`}
                  onClick={() => { setForm(f => ({ ...f, type: 'expense', category: '' })); }}
                >
                  Expense
                </button>
                <button
                  type="button"
                  className={`type-btn ${form.type === 'income' ? 'type-btn-active type-income' : ''}`}
                  onClick={() => { setForm(f => ({ ...f, type: 'income', category: '' })); }}
                >
                  Income
                </button>
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Description *</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="e.g. Grocery shopping"
                  className={errors.description ? 'input-error' : ''}
                />
                {errors.description && <span className="error-text">{errors.description}</span>}
              </div>

              {/* Amount */}
              <div className="form-group">
                <label>Amount *</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="0"
                  min="0"
                  step="1"
                  className={errors.amount ? 'input-error' : ''}
                />
                {errors.amount && <span className="error-text">{errors.amount}</span>}
              </div>

              {/* Category */}
              <div className="form-group">
                <label>Category *</label>
                <div className="category-grid">
                  {categories.map(cat => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        className={`category-chip ${form.category === cat.id ? 'category-chip-active' : ''}`}
                        onClick={() => setForm(f => ({ ...f, category: cat.id }))}
                        style={form.category === cat.id ? { borderColor: cat.color, background: `${cat.color}15` } : {}}
                      >
                        <Icon size={15} style={{ color: cat.color }} />
                        <span>{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.category && <span className="error-text">{errors.category}</span>}
              </div>

              {/* Date */}
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className={errors.date ? 'input-error' : ''}
                />
                {errors.date && <span className="error-text">{errors.date}</span>}
              </div>

              {/* Note */}
              <div className="form-group">
                <label>Note (optional)</label>
                <input
                  type="text"
                  value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  placeholder="Add a note..."
                />
              </div>

              {/* Actions */}
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingTransaction ? 'Update' : 'Add'} Transaction
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransactionModal;
