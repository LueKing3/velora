import {
  Utensils, ShoppingBag, Car, GraduationCap, Gamepad2,
  Receipt, Heart, Plane, MoreHorizontal,
  Briefcase, Laptop, Building2, TrendingUp, Gift, Coins
} from 'lucide-react';

export const expenseCategories = [
  { id: 'food', name: 'Food & Dining', icon: Utensils, color: '#f97316' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: '#a855f7' },
  { id: 'transport', name: 'Transportation', icon: Car, color: '#3b82f6' },
  { id: 'education', name: 'Education', icon: GraduationCap, color: '#06b6d4' },
  { id: 'entertainment', name: 'Entertainment', icon: Gamepad2, color: '#f472b6' },
  { id: 'bills', name: 'Bills & Utilities', icon: Receipt, color: '#facc15' },
  { id: 'healthcare', name: 'Healthcare', icon: Heart, color: '#ef4444' },
  { id: 'travel', name: 'Travel', icon: Plane, color: '#22d3ee' },
  { id: 'other_expense', name: 'Other', icon: MoreHorizontal, color: '#94a3b8' },
];

export const incomeCategories = [
  { id: 'salary', name: 'Salary', icon: Briefcase, color: '#10b981' },
  { id: 'freelance', name: 'Freelance', icon: Laptop, color: '#34d399' },
  { id: 'business', name: 'Business', icon: Building2, color: '#059669' },
  { id: 'investments', name: 'Investments', icon: TrendingUp, color: '#84cc16' },
  { id: 'gifts', name: 'Gifts', icon: Gift, color: '#a3e635' },
  { id: 'other_income', name: 'Other', icon: Coins, color: '#6ee7b7' },
];

export const allCategories = [...expenseCategories, ...incomeCategories];
export const getCategoryById = (id) => allCategories.find(c => c.id === id);
export const getCategoriesByType = (type) => type === 'income' ? incomeCategories : expenseCategories;
