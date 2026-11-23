import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { generateSampleData, defaultBudgets } from '../data/sampleData';

const AppContext = createContext();

const STORAGE_KEYS = {
  TRANSACTIONS: 'velora_transactions',
  BUDGETS: 'velora_budgets',
  SETTINGS: 'velora_settings',
  INITIALIZED: 'velora_initialized',
};

const defaultSettings = { currency: 'INR', theme: 'dark' };

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [settings, setSettings] = useState(defaultSettings);
  const [currentPage, setCurrentPage] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
      if (!initialized) {
        const sampleTx = generateSampleData();
        setTransactions(sampleTx);
        setBudgets(defaultBudgets);
        setSettings(defaultSettings);
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(sampleTx));
        localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(defaultBudgets));
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
        localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
      } else {
        const storedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        const storedBudgets = localStorage.getItem(STORAGE_KEYS.BUDGETS);
        const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        setTransactions(storedTx ? JSON.parse(storedTx) : []);
        setBudgets(storedBudgets ? JSON.parse(storedBudgets) : []);
        setSettings(storedSettings ? JSON.parse(storedSettings) : defaultSettings);
      }
    } catch (e) {
      console.error('Error loading data:', e);
      setTransactions(generateSampleData());
      setBudgets(defaultBudgets);
    }
    setTimeout(() => setIsLoading(false), 2200);
  }, []);

  useEffect(() => { if (!isLoading) localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions)); }, [transactions, isLoading]);
  useEffect(() => { if (!isLoading) localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets)); }, [budgets, isLoading]);
  useEffect(() => { if (!isLoading) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)); }, [settings, isLoading]);

  const addTransaction = useCallback((tx) => {
    setTransactions(prev => [{ ...tx, id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36) }, ...prev]);
  }, []);
  const updateTransaction = useCallback((id, updates) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);
  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);
  const addBudget = useCallback((budget) => {
    setBudgets(prev => [...prev, { ...budget, id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36) }]);
  }, []);
  const updateBudget = useCallback((id, updates) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  }, []);
  const deleteBudget = useCallback((id) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  }, []);
  const updateSettings = useCallback((updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);
  const resetAllData = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    const sampleTx = generateSampleData();
    setTransactions(sampleTx);
    setBudgets(defaultBudgets);
    setSettings(defaultSettings);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(sampleTx));
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(defaultBudgets));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }, []);
  const clearAllData = useCallback(() => {
    setTransactions([]);
    setBudgets([]);
    setSettings(defaultSettings);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }, []);

  return (
    <AppContext.Provider value={{
      transactions, budgets, settings, currentPage, isLoading,
      setCurrentPage, addTransaction, updateTransaction, deleteTransaction,
      addBudget, updateBudget, deleteBudget, updateSettings, resetAllData, clearAllData,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
