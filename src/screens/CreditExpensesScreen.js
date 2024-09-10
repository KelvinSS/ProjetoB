import React, { useContext, useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { ExpenseContext } from '../context/ExpenseContext';
import ScreenWrapper from '../components/ScreenWrapper';
import { Picker } from '@react-native-picker/picker';

const CreditExpensesScreen = ({ navigation }) => {
    const { expenses, paymentDay } = useContext(ExpenseContext);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Mês atual

    // Função para converter data e garantir que seja tratada corretamente
    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return new Date(`${year}-${month}-${day}`);
    };

    // Função para calcular o intervalo de fatura baseado no dia de fechamento
    const getBillingPeriod = (month, paymentDay) => {
        const currentYear = new Date().getFullYear();

        // Selecione o mês anterior e o ano corretamente para o início da fatura
        const previousMonth = month === 1 ? 12 : month - 1;
        const yearForStart = month === 1 ? currentYear - 1 : currentYear;

        // Data de fechamento da fatura (mês atual, dia de pagamento)
        const endOfBilling = new Date(currentYear, month - 1, paymentDay);

        // Data de início da fatura (dia seguinte ao fechamento do mês anterior)
        let startOfBilling = new Date(yearForStart, previousMonth - 1, paymentDay + 1);

        // Ajuste para garantir que o início da fatura seja sempre o dia seguinte ao fechamento anterior
        if (startOfBilling.getDate() > new Date(yearForStart, previousMonth, 10).getDate()) {
            startOfBilling = new Date(currentYear, month - 1, 1); // Início no primeiro dia do mês atual
        }

        return { startOfBilling, endOfBilling };
    };

    // Função para ajustar o final da data de faturamento para 23:59:59
    const getEndOfBilling = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    };

    // Obter o intervalo de fatura do mês selecionado
    const { startOfBilling, endOfBilling } = getBillingPeriod(selectedMonth, paymentDay);

    // Ajustar o final da data de faturamento para 23:59:59
    const adjustedEndOfBilling = getEndOfBilling(endOfBilling);

    // Filtrar os gastos por meio de pagamento "crédito" e dentro do período de fatura
    const creditExpenses = expenses.filter(expense => {
        const expenseDate = new Date(parseDate(expense.date));
        const normalizedStart = new Date(startOfBilling.getFullYear(), startOfBilling.getMonth(), startOfBilling.getDate());
        const normalizedEnd = new Date(adjustedEndOfBilling.getFullYear(), adjustedEndOfBilling.getMonth(), adjustedEndOfBilling.getDate(), 23, 59, 59);

        return (
            expense.payment === 'Crédito' &&
            expenseDate >= normalizedStart && // Comparação correta
            expenseDate <= normalizedEnd // Comparação correta
        );
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
            <Text>Sua fatura iniciou dia {startOfBilling.toLocaleDateString()}</Text>
            <Text>Sua fatura fechou dia {adjustedEndOfBilling.toLocaleDateString()}</Text>
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
        backgroundColor: '#ccc'
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
