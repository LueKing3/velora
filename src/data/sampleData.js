const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

export const generateSampleData = () => {
  const now = new Date();
  const cm = now.getMonth();
  const cy = now.getFullYear();
  const pm = cm === 0 ? 11 : cm - 1;
  const py = cm === 0 ? cy - 1 : cy;
  const d = (y, m, day) => new Date(y, m, day).toISOString().split('T')[0];

  return [
    { id: generateId(), description: 'Monthly Salary', amount: 75000, type: 'income', category: 'salary', date: d(cy,cm,1), note: 'November salary' },
    { id: generateId(), description: 'Freelance Web Project', amount: 15000, type: 'income', category: 'freelance', date: d(cy,cm,5), note: 'Portfolio website' },
    { id: generateId(), description: 'Stock Dividends', amount: 3200, type: 'income', category: 'investments', date: d(cy,cm,10), note: '' },
    { id: generateId(), description: 'Grocery Shopping', amount: 4500, type: 'expense', category: 'food', date: d(cy,cm,2), note: 'Weekly groceries from BigBasket' },
    { id: generateId(), description: 'Zomato Orders', amount: 1800, type: 'expense', category: 'food', date: d(cy,cm,4), note: '' },
    { id: generateId(), description: 'Restaurant Dinner', amount: 2200, type: 'expense', category: 'food', date: d(cy,cm,8), note: 'Birthday dinner' },
    { id: generateId(), description: 'Coffee & Snacks', amount: 850, type: 'expense', category: 'food', date: d(cy,cm,15), note: '' },
    { id: generateId(), description: 'Amazon Shopping', amount: 6500, type: 'expense', category: 'shopping', date: d(cy,cm,3), note: 'Electronics & accessories' },
    { id: generateId(), description: 'Clothes - Myntra', amount: 3200, type: 'expense', category: 'shopping', date: d(cy,cm,12), note: 'Winter collection' },
    { id: generateId(), description: 'Metro Card Recharge', amount: 500, type: 'expense', category: 'transport', date: d(cy,cm,1), note: '' },
    { id: generateId(), description: 'Uber Rides', amount: 1200, type: 'expense', category: 'transport', date: d(cy,cm,7), note: '' },
    { id: generateId(), description: 'Petrol', amount: 2800, type: 'expense', category: 'transport', date: d(cy,cm,14), note: '' },
    { id: generateId(), description: 'Coursera Subscription', amount: 3999, type: 'expense', category: 'education', date: d(cy,cm,1), note: 'Annual plan' },
    { id: generateId(), description: 'Books - Amazon', amount: 1500, type: 'expense', category: 'education', date: d(cy,cm,9), note: '' },
    { id: generateId(), description: 'Netflix Subscription', amount: 649, type: 'expense', category: 'entertainment', date: d(cy,cm,1), note: '' },
    { id: generateId(), description: 'Movie Tickets', amount: 800, type: 'expense', category: 'entertainment', date: d(cy,cm,11), note: 'IMAX show' },
    { id: generateId(), description: 'Electricity Bill', amount: 2100, type: 'expense', category: 'bills', date: d(cy,cm,5), note: '' },
    { id: generateId(), description: 'WiFi Bill', amount: 999, type: 'expense', category: 'bills', date: d(cy,cm,5), note: 'Jio Fiber' },
    { id: generateId(), description: 'Mobile Recharge', amount: 599, type: 'expense', category: 'bills', date: d(cy,cm,10), note: '' },
    { id: generateId(), description: 'Health Checkup', amount: 1500, type: 'expense', category: 'healthcare', date: d(cy,cm,6), note: 'Annual checkup' },
    // Previous month
    { id: generateId(), description: 'Monthly Salary', amount: 75000, type: 'income', category: 'salary', date: d(py,pm,1), note: 'October salary' },
    { id: generateId(), description: 'Freelance Design Work', amount: 8000, type: 'income', category: 'freelance', date: d(py,pm,15), note: '' },
    { id: generateId(), description: 'Grocery Shopping', amount: 5200, type: 'expense', category: 'food', date: d(py,pm,3), note: '' },
    { id: generateId(), description: 'Swiggy Orders', amount: 2500, type: 'expense', category: 'food', date: d(py,pm,8), note: '' },
    { id: generateId(), description: 'Flipkart Shopping', amount: 8900, type: 'expense', category: 'shopping', date: d(py,pm,5), note: 'Diwali shopping' },
    { id: generateId(), description: 'Auto & Cab Rides', amount: 1800, type: 'expense', category: 'transport', date: d(py,pm,10), note: '' },
    { id: generateId(), description: 'Electricity Bill', amount: 2400, type: 'expense', category: 'bills', date: d(py,pm,5), note: '' },
    { id: generateId(), description: 'Gym Membership', amount: 2000, type: 'expense', category: 'healthcare', date: d(py,pm,1), note: '' },
    { id: generateId(), description: 'Weekend Trip', amount: 5500, type: 'expense', category: 'travel', date: d(py,pm,20), note: 'Rishikesh trip' },
    { id: generateId(), description: 'Netflix + Spotify', amount: 848, type: 'expense', category: 'entertainment', date: d(py,pm,1), note: '' },
  ];
};

export const defaultBudgets = [
  { id: generateId(), category: 'food', amount: 12000, month: new Date().toISOString().slice(0, 7) },
  { id: generateId(), category: 'shopping', amount: 8000, month: new Date().toISOString().slice(0, 7) },
  { id: generateId(), category: 'transport', amount: 5000, month: new Date().toISOString().slice(0, 7) },
  { id: generateId(), category: 'entertainment', amount: 2000, month: new Date().toISOString().slice(0, 7) },
  { id: generateId(), category: 'bills', amount: 5000, month: new Date().toISOString().slice(0, 7) },
];
