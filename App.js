import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import * as Notifications from 'expo-notifications';

import HomeScreen from './src/screens/HomeScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import EditExpenseScreen from './src/screens/EditExpenseScreen';
import ConfigScreen from './src/screens/ConfigScreen';
import CreditExpensesScreen from './src/screens/CreditExpensesScreen';
import LoginScreen from './src/screens/LoginScreen';
import PlanningScreen from './src/screens/PlanningScreen';
import { AuthProvider, AuthContext } from './src/context/authContext';
import { ExpenseProvider } from './src/context/ExpenseContext';

const Stack = createStackNavigator();

function AppNavigator() {
  const { isLoggedIn } = useContext(AuthContext); // Acessa o estado de login do AuthContext

  return (
    <Stack.Navigator initialRouteName={isLoggedIn ? 'Home' : 'Login'} screenOptions={{ headerStyle: { backgroundColor: '#ccc' } }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ header: () => null }} />
      <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: 'Despesa' }} />
      <Stack.Screen name="EditExpense" component={EditExpenseScreen} options={{ title: 'Editar despesa' }} />
      <Stack.Screen name="Config" component={ConfigScreen} options={{ title: 'Configurar' }} />
      <Stack.Screen name="CreditExpenses" component={CreditExpensesScreen} options={{ title: 'Fatura do cartão' }} />
      <Stack.Screen name="PlanningScreen" component={PlanningScreen} options={{ title: 'Planejamento' }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ header: () => null }} />
    </Stack.Navigator>
  );
}

export default function App() {

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };

    getPermissions();

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const { notification } = response;
      if (notification.request.content.data.screen === 'CreditExpenses') {
        navigation.navigate('CreditExpenses');
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <AuthProvider>
      <ExpenseProvider>
        <NavigationContainer>
          <StatusBar barStyle={'dark-content'} backgroundColor={'#ccc'} />
          <AppNavigator />
        </NavigationContainer>
      </ExpenseProvider>
    </AuthProvider>
  );
}
