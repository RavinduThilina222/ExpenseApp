import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './../screens/HomeScreen';
import AddExpenseScreen from './../screens/AddExpenses';
import ExpenseDetailScreen from './../screens/ExpenseDetailScreen';
import ChartScreen from './../screens/ChartScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
      <Stack.Screen name="ExpenseDetail" component={ExpenseDetailScreen} />
      <Stack.Screen name="Chart" component={ChartScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;