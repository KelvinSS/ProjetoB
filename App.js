import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Montserrat_400Regular, Montserrat_700Bold, useFonts } from "@expo-google-fonts/montserrat";

import HomeScreen from './src/screens/HomeScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import EditExpenseScreen from './src/screens/EditExpenseScreen';
import ConfigScreen from './src/screens/ConfigScreen';
import CreditExpensesScreen from './src/screens/CreditExpensesScreen';
import LoginScreen from './src/screens/LoginScreen';
import PlanningScreen from './src/screens/PlanningScreen';
import AddRecurringExpenseScreen from './src/screens/AddRecurringExpenseScreen';
import EditPlanningScreen from './src/screens/EditPlanningScreen';
import WalletScreen from './src/screens/WalletScreen';

import { AuthProvider, AuthContext } from './src/context/authContext';
import { PlanningProvider } from './src/context/PlanningContext';
import { ExpenseProvider } from './src/context/ExpenseContext';

import { COLOR } from './src/theme/Theme';

const Stack = createStackNavigator();

function AppNavigator({ navigation }) {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Stack.Navigator
      initialRouteName={isLoggedIn ? 'Home' : 'Login'}
      screenOptions={{
        headerStyle: { backgroundColor: COLOR.Jade },
        headerTintColor: COLOR.White,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ header: () => null }} />
      <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: 'Despesa' }} />
      <Stack.Screen name="EditExpense" component={EditExpenseScreen} options={{ title: 'Editar despesa' }} />
      <Stack.Screen name="Config" component={ConfigScreen} options={{ title: 'Configurar' }} />
      <Stack.Screen name="CreditExpenses" component={CreditExpensesScreen} options={{ title: 'Fatura do cartão' }} />
      <Stack.Screen name="PlanningScreen" component={PlanningScreen} options={{ title: 'Planejamento' }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ header: () => null }} />
      <Stack.Screen name="AddRecurringExpense" component={AddRecurringExpenseScreen} options={{ title: 'Gasto recorrente' }} />
      <Stack.Screen name="EditPlanningScreen" component={EditPlanningScreen} options={{ title: 'Editar Gasto recorrente' }} />
      <Stack.Screen name="WalletScreen" component={WalletScreen} options={{ title: 'Carteira' }} />
    </Stack.Navigator>
  );
}

function AppContent() {
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
      const screen = notification.request.content.data.screen;

      // Verifica se a notificação contém a tela que queremos navegar
      if (screen === 'CreditExpenses') {
        navigation.navigate('CreditExpenses');
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <AuthProvider>
      <ExpenseProvider>
        <PlanningProvider>
          <NavigationContainer>
            <StatusBar barStyle={'light-content'} backgroundColor={COLOR.Jade} />
            <AppNavigator />
          </NavigationContainer>
        </PlanningProvider>
      </ExpenseProvider>
    </AuthProvider>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return <AppContent />;
}
