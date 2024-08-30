import React, { useContext } from 'react';
import { View, FlatList, Text, Button } from 'react-native';
import { ExpenseContext } from '../context/ExpenseContext';
import ScreenWrapper from '../components/ScreenWrapper';

// Função para agrupar os gastos por data
const groupExpensesByDate = (expenses) => {
    return expenses.reduce((grouped, expense) => {
        const date = expense.date; // Formato da data já deve estar como string no formato "dd/mm/yyyy"
        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(expense);
        return grouped;
    }, {});
};

export default function HomeScreen({ navigation }) {
    const { expenses, deleteExpense } = useContext(ExpenseContext);

    // Agrupa os gastos por data
    const groupedExpenses = groupExpensesByDate(expenses);
    const groupedExpensesArray = Object.keys(groupedExpenses).map(date => ({
        date,
        data: groupedExpenses[date]
    }));

    return (
        <ScreenWrapper>
            <Text style={{
                alignSelf: 'center',
                justifyContent: 'center',
                fontSize: 40,
                marginBottom: 20,
                fontWeight: 'bold',
                paddingTop: "20%"
            }}>
                ProjetoB
            </Text>
            <Button title="Adicionar Gasto" onPress={() => navigation.navigate('AddExpense')} />
            <View style={{ marginTop: 30 }}>
                <Text style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                }}>
                    Ultimos lançamentos
                </Text>
                <FlatList
                    style={{ margin: 5 }}
                    data={groupedExpensesArray}
                    keyExtractor={item => item.date}
                    renderItem={({ item }) => (
                        <View>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.date}</Text>
                            {item.data.map(expense => (
                                <View key={expense.id} style={{ marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: '#ccc', borderRadius: 5, alignItems: 'center', padding: 5 }}>
                                    <Text>{expense.description} - R$ {expense.amount}</Text>
                                    <Text>{expense.location ? expense.location : ''}</Text>
                                    <Button title="X" onPress={() => deleteExpense(expense.id)} color={'red'} />
                                </View>
                            ))}
                        </View>
                    )}
                />
            </View>
        </ScreenWrapper>
    );
}
