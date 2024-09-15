import React, { useContext } from 'react';
import { View, FlatList, Text, Button, Alert } from 'react-native';
import { ExpenseContext } from '../context/ExpenseContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContext } from '../context/authContext';
import { COLOR, FONTE } from '../theme/Theme';

import ButtonK from '../components/ButtonK';
import ButtonMenu from '../components/ButtonMenu';
import ScreenWrapper from '../components/ScreenWrapper';

const groupExpensesByDate = (expenses) => {
    return expenses.reduce((grouped, expense) => {
        const date = expense.date;
        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(expense);
        return grouped;
    }, {});
};

const calculateTotalAmount = (expenses) => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export default function HomeScreen({ navigation }) {
    const { logout } = useContext(AuthContext);
    const { expenses, walletBalance } = useContext(ExpenseContext);

    const groupedExpenses = groupExpensesByDate(expenses);
    const groupedExpensesArray = Object.keys(groupedExpenses)
        .map(date => ({
            date,
            data: groupedExpenses[date]
        }))
        .sort((a, b) => {
            // Converta a string da data para um objeto Date para garantir que a ordenação funcione corretamente
            const dateA = new Date(a.date.split('/').reverse().join('-'));
            const dateB = new Date(b.date.split('/').reverse().join('-'));
            return dateB - dateA;
        });

    const totalAmount = calculateTotalAmount(expenses);

    const handleLogout = async () => {
        Alert.alert(
            'Sair',
            'Deseja realmente sair?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Sair',
                    style: 'default',
                    onPress: async () => {
                        await logout();
                        navigation.replace('Login'); // Navega de volta para a tela de login
                    }
                }
            ]
        )
    };

    return (
        <ScreenWrapper>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 10,
            }}>
                <TouchableOpacity
                    onPress={handleLogout}
                    style={{ alignSelf: 'center' }}
                >
                    <Text>SAIR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Config')}
                    style={{ alignSelf: 'center' }}
                >
                    <Text>Config</Text>
                </TouchableOpacity>
            </View>

            <Text style={{
                alignSelf: 'center',
                justifyContent: 'center',
                fontSize: 40,
                marginBottom: 20,
                fontWeight: 'bold',
                paddingTop: "20%",
            }}>
                Zenith
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <ButtonMenu
                    onPress={() => navigation.navigate('CreditExpenses')}
                    title={'Ver Fatura'}
                />
                <ButtonMenu
                    onPress={() => navigation.navigate('PlanningScreen')}
                    title={'Planejamento'}
                />
            </View>

            <ButtonK
                title={'Adicionar Gasto'}
                onPress={() => navigation.navigate('AddExpense')}
            />

            <View style={{ flex: 1, marginTop: 30 }}>
                {groupedExpensesArray.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>
                        Nenhum gasto adicionado.
                    </Text>
                ) : (
                    <FlatList
                        style={{ flex: 1, margin: 5 }}
                        data={groupedExpensesArray}
                        keyExtractor={item => item.date}
                        renderItem={({ item }) => (
                            <View>
                                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                                    {item.date}
                                </Text>

                                {item.data.map(expense => (
                                    <TouchableOpacity
                                        key={expense.id}
                                        onPress={() => navigation.navigate('EditExpense', { id: expense.id })}
                                    >
                                        <View style={{
                                            borderColor: COLOR.Grey,
                                            height: 50,
                                            marginBottom: 10,
                                            borderRadius: 5,
                                            borderWidth: 1,
                                            justifyContent: 'space-between',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            padding: 5
                                        }}>
                                            <Text>{expense.description} - R$ {expense.amount.toFixed(2)}</Text>
                                            <Text>{expense.location ? expense.location : ''}</Text>
                                            {expense.payment ?
                                                <View style={{ backgroundColor: COLOR.Grey, width: 80, height: 30, alignItems: "center", justifyContent: 'center', borderRadius: 5 }}>
                                                    <Text>{expense.payment}</Text>
                                                </View>
                                                : <Text></Text>}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    />
                )}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{
                    alignItems: 'center',
                    padding: 10,
                    borderWidth: 1,
                    borderColor: COLOR.Black,
                    borderRadius: 10,
                    width: 150
                }}>
                    <Text style={{ fontSize: 20 }}>Total Gasto:</Text>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>R$ {totalAmount.toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Config')}
                    style={{
                        alignItems: 'center',
                        padding: 10,
                        borderWidth: 1,
                        borderRadius: 10,
                        borderColor: COLOR.Black,
                        width: 150,
                    }}>
                    <Text style={{ fontSize: 20 }}>Saldo Total</Text>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: walletBalance >= 100 ? COLOR.Jade : walletBalance >= 1 ? COLOR.Gold1 : COLOR.Red,
                    }}>
                        R$ {walletBalance.toFixed(2)}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScreenWrapper >
    );
}
