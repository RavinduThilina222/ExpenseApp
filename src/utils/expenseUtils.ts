import AsyncStorage from '@react-native-async-storage/async-storage';

const EXPENSES_KEY = 'expenses';

export const getExpenses = async () => {
  const data = await AsyncStorage.getItem(EXPENSES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveExpense = async (expense: any) => {
  const expenses = await getExpenses();
  expense.id = Date.now();
  expenses.push(expense);
  await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
};

export const calculateTotal = (expenses: any[]) => {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
};

export const getExpensesByCategory = async () => {
  const expenses = await getExpenses();
  const categoryMap: any = {};

  expenses.forEach((e: { category: string; amount: number; }) => {
    if (!categoryMap[e.category]) {
      categoryMap[e.category] = 0;
    }
    categoryMap[e.category] += e.amount;
  });

  return Object.keys(categoryMap).map((category) => ({
    name: category,
    amount: categoryMap[category],
    color: getColor(category),
    legendFontColor: '#000',
    legendFontSize: 12,
  }));
};

const getColor = (category: string) => {
  switch (category) {
    case 'Food': return '#FF6384';
    case 'Travel': return '#36A2EB';
    case 'Shopping': return '#FFCE56';
    default: return '#AAAAAA';
  }
};

export const deleteExpense = async (id: number) => {
  const expenses = await getExpenses();
  const updatedExpenses = expenses.filter((e: { id: number; }) => e.id !== id);
  await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(updatedExpenses));
};

export const updateExpense = async (updatedExpense: any) => {
  const expenses = await getExpenses();
  const index = expenses.findIndex((e: { id: number; }) => e.id === updatedExpense.id);
  if (index !== -1) {
    expenses[index] = updatedExpense;
    await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  }
};
