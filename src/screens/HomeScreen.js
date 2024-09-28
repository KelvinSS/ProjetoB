import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ExpenseContext } from '../context/ExpenseContext';
import { AuthContext } from '../context/authContext';
import { useDateUtils } from '../hooks/useDateUtils';
import { COLOR, FONTE } from '../theme/Theme';
import { formatCurrency } from '../utils/formatCurrency';
import RText from '../components/RText';
import Dropdown from '../components/Dropdown';
import JadeButton from '../components/JadeButton';
import ButtonMenu from '../components/ButtonMenu';
import ZenithName from '../components/ZenithName';
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
    const { expenses, walletBalance, getExpensesByCategory } = useContext(ExpenseContext);

    const { getCurrentMonth } = useDateUtils();
    const currentMonth = getCurrentMonth(); // Pega nome do mês atual
    const currentYear = new Date().getFullYear(); // Pega o ano atual
    const [selectedYear, setSelectedYear] = useState(currentYear.toString());
    const [selectedMonth, setSelectedMonth] = useState(currentMonth)
    const [category, setCategory] = useState(selectedMonth);

    useEffect(() => {
        setCategory(selectedMonth + selectedYear);
    }, [selectedMonth, selectedYear]);

    const groupedCategory = getExpensesByCategory(category);
    const groupedExpenses = groupExpensesByDate(groupedCategory);
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
    const totalAmount = calculateTotalAmount(groupedCategory);

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
                    <Icon
                        name={'exit-outline'}
                        size={24}
                        color={COLOR.Jade}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Config')} style={styles.headerButton}>
                    <Icon
                        name={'construct-outline'}
                        size={24}
                        color={COLOR.Jade}
                    />
                </TouchableOpacity>
            </View>

            <ZenithName />

            <View style={styles.menuButtonsContainer}>
                <ButtonMenu onPress={() => navigation.navigate('CreditExpenses')} title={'Ver Fatura'} disabled style={{ marginRight: 5 }} />
                <ButtonMenu onPress={() => navigation.navigate('PlanningScreen')} title={'Planejamento'} disabled style={{ marginLeft: 5 }} />
            </View>

            <JadeButton title={'Adicionar Gasto'} onPress={() => navigation.navigate('AddExpense')} icon />

            <View style={styles.dropdownContainer}>
                <Dropdown
                    selectedValue={selectedMonth}
                    onValueChange={setSelectedMonth}
                    type="months"
                    width='48%'
                />
                <Dropdown
                    selectedValue={selectedYear}
                    onValueChange={setSelectedYear}
                    type="years"
                    width='48%'
                />
            </View>

            <View style={styles.expensesContainer}>
                {groupedExpensesArray.length === 0 ? (
                    <RText style={styles.noExpensesText}>Nenhum gasto adicionado.</RText>
                ) : (
                    <FlatList
                        data={groupedExpensesArray}
                        keyExtractor={item => item.date}
                        renderItem={({ item }) => (
                            <View>
                                <RText style={styles.expenseDate}>{item.date}</RText>
                                {item.data.map(expense => (
                                    <TouchableOpacity
                                        key={expense.id}
                                        onPress={() => navigation.navigate('EditExpense', { id: expense.id })}
                                    >
                                        <View style={[
                                            styles.expenseItem,
                                            {
                                                borderColor:
                                                    expense.status === 'Pago' ? COLOR.Jade :
                                                        expense.status === 'Aguardando' ? COLOR.Gold1 :
                                                            COLOR.Grey
                                            }
                                        ]}>
                                            <RText>
                                                {expense.description} - {formatCurrency(expense.amount)}
                                                {`\n`}
                                                {expense.location}
                                            </RText>

                                            <View style={styles.statusContainer}>
                                                <RText style={{ fontSize: 16 }}>{expense.payment || expense.status}</RText>
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
                    <RText style={styles.totalText}>Total Gasto</RText>
                    <RText style={styles.totalAmount}>{formatCurrency(totalAmount)}</RText>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('WalletScreen')}
                    style={styles.walletContainer}
                >
                    <RText style={styles.walletText}>Carteira</RText>
                    <RText style={[
                        styles.walletAmount,
                        {
                            color: walletBalance >= 100 ? COLOR.Jade :
                                walletBalance >= 1 ? COLOR.Gold1 : COLOR.Red
                        }
                    ]}>
                        {formatCurrency(walletBalance)}
                    </RText>

                </TouchableOpacity>
            </View>
        </ScreenWrapper>
    );
}

const styles = {
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
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
        width: 158,
    },
    totalText: {
        fontSize: 20,
    },
    totalAmount: {
        fontSize: 19,
        fontWeight: 'bold',
    },
    walletContainer: {
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: COLOR.Black,
        width: 158,
    },
    walletText: {
        fontSize: 20,
    },
    walletAmount: {
        fontSize: 19,
        fontWeight: 'bold',
    },
    dropdownContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    }
};
