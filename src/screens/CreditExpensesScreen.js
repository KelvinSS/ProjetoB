import React, { useContext, useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import ScreenWrapper from '../components/ScreenWrapper';
import { ExpenseContext } from '../context/ExpenseContext';
import { useDateUtils } from '../hooks/useDateUtils';
import { COLOR } from '../theme/Theme';

const CreditExpensesScreen = ({ navigation }) => {
    const { expenses, paymentDay } = useContext(ExpenseContext);

    const currentYear = new Date().getFullYear(); // Ano atual
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Mês atual
    const [selectedYear, setSelectedYear] = useState(currentYear); // Ano selecionado

    const { formatDate, getBillingPeriod, isWithinBillingPeriod, parseDate } = useDateUtils(paymentDay);

    // Obter o intervalo de faturamento para o mês e ano selecionados
    const { startDate: startOfBilling, endDate: endOfBilling } = getBillingPeriod(
        new Date(selectedYear, selectedMonth, paymentDay)
    );

    // Filtrar os gastos de crédito dentro do período de faturamento
    const creditExpenses = expenses.filter(expense => {
        const expenseDate = parseDate(expense.date);
        return (
            expense.payment === 'Crédito' &&
            isWithinBillingPeriod(expenseDate, startOfBilling, endOfBilling)
        );
    });

    // Função para agrupar e ordenar despesas
    const groupedCreditExpenses = creditExpenses.reduce((grouped, expense) => {
        const date = expense.date;
        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(expense);
        return grouped;
    }, {});

    const groupedCreditExpensesArray = Object.keys(groupedCreditExpenses)
        .map(date => ({
            date,
            data: groupedCreditExpenses[date]
        }))
        .sort((a, b) => {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            return dateB - dateA;
        });

    // Calcular o total dos gastos filtrados
    const totalCreditAmount = creditExpenses.reduce((total, expense) => total + expense.amount, 0);

    return (
        <ScreenWrapper>
            <Text style={styles.header}>Gastos com Crédito</Text>

            <Picker
                selectedValue={selectedMonth}
                onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Janeiro" value={0} />
                <Picker.Item label="Fevereiro" value={1} />
                <Picker.Item label="Março" value={2} />
                <Picker.Item label="Abril" value={3} />
                <Picker.Item label="Maio" value={4} />
                <Picker.Item label="Junho" value={5} />
                <Picker.Item label="Julho" value={6} />
                <Picker.Item label="Agosto" value={7} />
                <Picker.Item label="Setembro" value={8} />
                <Picker.Item label="Outubro" value={9} />
                <Picker.Item label="Novembro" value={10} />
                <Picker.Item label="Dezembro" value={11} />
            </Picker>

            <Picker
                selectedValue={selectedYear}
                onValueChange={(itemValue) => setSelectedYear(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label={`${currentYear}`} value={currentYear} />
                <Picker.Item label={`${currentYear - 1}`} value={currentYear - 1} />
                <Picker.Item label={`${currentYear - 2}`} value={currentYear - 2} />
            </Picker>

            {creditExpenses.length === 0 ? (
                <Text style={styles.noExpenses}>Nenhum gasto com crédito.</Text>
            ) : (
                <FlatList
                    data={groupedCreditExpensesArray}
                    keyExtractor={item => item.date}
                    renderItem={({ item }) => (
                        <View style={styles.expenseItem}>
                            <Text>{item.date}</Text>
                            {item.data.map(expense => (
                                <View key={expense.id} style={styles.expenseDetail}>
                                    <Text>{expense.description} - R$ {expense.amount.toFixed(2)}</Text>
                                    <Text>{expense.location ? expense.location : ''}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                />
            )}

            <Text style={styles.totalText}>Total: R$ {totalCreditAmount.toFixed(2)}</Text>
            <Text>Pagar a fatura até o dia {paymentDay}/{selectedMonth + 1}/{selectedYear}</Text>
            <Text>Sua fatura iniciou dia {formatDate(startOfBilling)}</Text>
            <Text>Sua fatura fechou dia {formatDate(endOfBilling)}</Text>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 20,
    },
    picker: {
        marginBottom: 20,
        height: 50,
        backgroundColor: COLOR.Jade,
        color: COLOR.White
    },
    totalText: {
        marginBottom: 10,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    noExpenses: {
        textAlign: 'center',
        marginTop: 20,
    },
    expenseItem: {
        padding: 5,
        height: 50,
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: COLOR.Jade,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    expenseDetail: {
        padding: 5,
    },
});

export default CreditExpensesScreen;
