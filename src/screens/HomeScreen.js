import React, { useContext } from 'react';
import { View, FlatList, Text, Alert, TouchableOpacity } from 'react-native';
import { ExpenseContext } from '../context/ExpenseContext';
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
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair',
                    onPress: async () => {
                        await logout();
                        navigation.replace('Login');
                    }
                }
            ]
        );
    };

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
                    <Text style={styles.headerText}>SAIR</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Config')} style={styles.headerButton}>
                    <Text style={styles.headerText}>Config</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.title}>
                <Text style={{ color: COLOR.Jade }}>Z</Text>enith
            </Text>

            <View style={styles.menuButtonsContainer}>
                <ButtonMenu onPress={() => navigation.navigate('CreditExpenses')} title={'Ver Fatura'} disabled />
                <ButtonMenu onPress={() => navigation.navigate('PlanningScreen')} title={'Planejamento'} disabled />
            </View>

            <ButtonK title={'Adicionar Gasto'} onPress={() => navigation.navigate('AddExpense')} />

            <View style={styles.expensesContainer}>
                {groupedExpensesArray.length === 0 ? (
                    <Text style={styles.noExpensesText}>Nenhum gasto adicionado.</Text>
                ) : (
                    <FlatList
                        data={groupedExpensesArray}
                        keyExtractor={item => item.date}
                        renderItem={({ item }) => (
                            <View>
                                <Text style={styles.expenseDate}>{item.date}</Text>
                                {item.data.map(expense => (
                                    <TouchableOpacity
                                        key={expense.id}
                                        onPress={() => navigation.navigate('EditExpense', { id: expense.id })}
                                    >
                                        <View style={[
                                            styles.expenseItem,
                                            { borderColor: expense.status === 'Pago' ? COLOR.Jade : COLOR.Grey }
                                        ]}>
                                            <Text>{expense.description} - R$ {expense.amount.toFixed(2)}</Text>
                                            <Text>{expense.location || ''}</Text>
                                            <View style={styles.statusContainer}>
                                                <Text>{expense.payment || expense.status}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    />
                )}
            </View>

            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>Total Gasto:</Text>
                    <Text style={styles.totalAmount}>R$ {totalAmount.toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('WalletScreen')}
                    style={styles.walletContainer}
                >
                    <Text style={styles.walletText}>Carteira</Text>
                    <Text style={[
                        styles.walletAmount,
                        {
                            color: walletBalance >= 100 ? COLOR.Jade :
                                walletBalance >= 1 ? COLOR.Gold1 : COLOR.Red
                        }
                    ]}>
                        R$ {walletBalance.toFixed(2)}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScreenWrapper>
    );
}

const styles = {
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    headerButton: {
        alignSelf: 'center',
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLOR.Black,
    },
    title: {
        fontSize: 40,
        marginBottom: 20,
        paddingTop: "20%",
        alignSelf: 'center',
        justifyContent: 'center',
        fontFamily: FONTE.Bold,
    },
    menuButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    expensesContainer: {
        flex: 1,
        marginTop: 30,
    },
    noExpensesText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: COLOR.Grey,
    },
    expenseDate: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    expenseItem: {
        height: 50,
        borderRadius: 5,
        borderWidth: 1,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    statusContainer: {
        backgroundColor: COLOR.Grey,
        width: 80,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    totalContainer: {
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: COLOR.Black,
        borderRadius: 10,
        width: 150,
    },
    totalText: {
        fontSize: 20,
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    walletContainer: {
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: COLOR.Black,
        width: 150,
    },
    walletText: {
        fontSize: 20,
    },
    walletAmount: {
        fontSize: 20,
        fontWeight: 'bold',
    },
};
