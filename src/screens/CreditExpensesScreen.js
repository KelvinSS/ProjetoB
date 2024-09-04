import React, { useContext, useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { ExpenseContext } from '../context/ExpenseContext';
import ScreenWrapper from '../components/ScreenWrapper';
import { Picker } from '@react-native-picker/picker';

const CreditExpensesScreen = ({ navigation }) => {
    const { expenses, paymentDay } = useContext(ExpenseContext);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Mês atual

    // Filtrar os gastos por meio de pagamento "crédito" e mês selecionado
    const creditExpenses = expenses.filter(expense => {
        const expenseMonth = new Date(expense.date.split('/').reverse().join('-')).getMonth() + 1;
        return expense.payment === 'Crédito' && expenseMonth === selectedMonth;
    });

    // Calcular o total dos gastos filtrados
    const totalCreditAmount = creditExpenses.reduce((total, expense) => total + expense.amount, 0);

    return (
        <ScreenWrapper>
            <Text style={styles.header}>Gastos com Crédito</Text>

            {/* Picker para selecionar o mês */}
            <Picker
                selectedValue={selectedMonth}
                onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Janeiro" value={1} />
                <Picker.Item label="Fevereiro" value={2} />
                <Picker.Item label="Março" value={3} />
                <Picker.Item label="Abril" value={4} />
                <Picker.Item label="Maio" value={5} />
                <Picker.Item label="Junho" value={6} />
                <Picker.Item label="Julho" value={7} />
                <Picker.Item label="Agosto" value={8} />
                <Picker.Item label="Setembro" value={9} />
                <Picker.Item label="Outubro" value={10} />
                <Picker.Item label="Novembro" value={11} />
                <Picker.Item label="Dezembro" value={12} />
            </Picker>

            {creditExpenses.length === 0 ? (
                <Text style={styles.noExpenses}>Nenhum gasto com crédito.</Text>
            ) : (
                <FlatList
                    data={creditExpenses}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.expenseItem}>
                            <Text>{item.description} - R$ {item.amount.toFixed(2)}</Text>
                            <Text>{item.location ? item.location : ''}</Text>
                            <Text>{item.date}</Text>
                        </View>
                    )}
                />
            )}

            <Text style={styles.totalText}>Total: R$ {totalCreditAmount.toFixed(2)}</Text>
            <Text>Pagar a fatura até o dia {paymentDay}/{selectedMonth}</Text>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        alignSelf: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    picker: {
        marginBottom: 20,
        height: 50,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    noExpenses: {
        textAlign: 'center',
        marginTop: 20,
    },
    expenseItem: {
        height: 50,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        alignItems: 'center',
        padding: 5,
    },
});

export default CreditExpensesScreen;
