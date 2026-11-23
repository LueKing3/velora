import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Background from './components/common/Background';
import LoadingScreen from './components/common/LoadingScreen';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import TransactionsPage from './components/transactions/TransactionsPage';
import TransactionModal from './components/transactions/TransactionModal';
import AnalyticsPage from './components/analytics/AnalyticsPage';
import BudgetsPage from './components/budgets/BudgetsPage';
import SettingsPage from './components/settings/SettingsPage';
import './App.css';

const MainContent = () => {
  const { currentPage, addTransaction, updateTransaction, isLoading } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(null); // 'expense' | 'income' | null
  const [editingTx, setEditingTx] = useState(null);

  const handleOpenAdd = (type = 'expense') => {
    setEditingTx(null);
    setModalOpen(type);
  };

  const handleOpenEdit = (tx) => {
    setEditingTx(tx);
    setModalOpen(tx.type);
  };

  const handleSaveTransaction = (txData) => {
    if (editingTx) {
      updateTransaction(editingTx.id, txData);
    } else {
      addTransaction(txData);
    }
    setModalOpen(null);
    setEditingTx(null);
  };

  return (
    <div className="velora-layout">
      <Background />
      <LoadingScreen isLoading={isLoading} />
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <div className="velora-main-wrapper">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="velora-content-area">
          {currentPage === 'overview' && (
            <Dashboard onAddTransaction={handleOpenAdd} />
          )}
          {currentPage === 'transactions' && (
            <TransactionsPage 
              searchQuery={searchQuery}
              onAddTransaction={handleOpenAdd}
              onEditTransaction={handleOpenEdit}
            />
          )}
          {currentPage === 'analytics' && (
            <AnalyticsPage />
          )}
          {currentPage === 'budgets' && (
            <BudgetsPage />
          )}
          {currentPage === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>

      <TransactionModal 
        isOpen={modalOpen}
        editingTransaction={editingTx}
        onClose={() => {
          setModalOpen(null);
          setEditingTx(null);
        }}
        onSave={handleSaveTransaction}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
