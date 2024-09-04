import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import EditExpenseScreen from './src/screens/EditExpenseScreen';
import ConfigScreen from './src/screens/ConfigScreen';
import { ExpenseProvider } from './src/context/ExpenseContext';
import { StatusBar } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ExpenseProvider>
      <NavigationContainer>
        <StatusBar barStyle={'dark-content'} backgroundColor={'#ccc'} />
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerStyle: { backgroundColor: '#ccc' } }}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ header: () => null }} />
          <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: 'Despesa' }} />
          <Stack.Screen name='EditExpense' component={EditExpenseScreen} options={{ title: 'Editar despesa' }} />
          <Stack.Screen name='Config' component={ConfigScreen} options={{ title: 'Configurar' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ExpenseProvider>
  );
}
