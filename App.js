import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import { ExpenseProvider } from './src/context/ExpenseContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ExpenseProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ header: () => null }} />
          <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: 'Despesa' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ExpenseProvider>
  );
}
