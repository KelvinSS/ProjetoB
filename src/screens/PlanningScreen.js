import React, { useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

import { PlanningContext } from '../context/PlanningContext';

import { Picker } from '@react-native-picker/picker';
import ScreenWrapper from '../components/ScreenWrapper';
import JadeButton from '../components/JadeButton';
import { COLOR } from '../theme/Theme';

const groupPlanningByDate = (planningExpenses) => {
    return planningExpenses.reduce((grouped, planningExpense) => {
        const date = planningExpense.date;
        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(planningExpense);
        return grouped;
    }, {});
};

export default function PlanningScreen({ navigation }) {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    const { planningExpenses } = useContext(PlanningContext);

    const groupedPlanning = groupPlanningByDate(planningExpenses || []);
    const groupedPlanningArray = Object.keys(groupedPlanning)
        .map(date => ({
            date,
            data: groupedPlanning[date]
        }))
        .sort((a, b) => {
            const [dayA, monthA, yearA] = a.date.split('/');
            const [dayB, monthB, yearB] = b.date.split('/');
            const dateA = new Date(yearA, monthA - 1, dayA);
            const dateB = new Date(yearB, monthB - 1, dayB);
            return dateB - dateA;
        });

    const filteredPlanningArray = groupedPlanningArray.filter(item => {
        const [day, month, year] = item.date.split('/');
        return parseInt(month) === selectedMonth;
    });

    return (
        <ScreenWrapper>
            <Text>Selecione o mês:</Text>
            <Picker
                selectedValue={selectedMonth}
                onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                style={{ backgroundColor: COLOR.Jade, color: COLOR.White }}
            >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <Picker.Item key={month} label={`Mês ${month}`} value={month} />
                ))}
            </Picker>

            <JadeButton
                title={'Adicionar Gasto recorrente'}
                onPress={() => navigation.navigate('AddRecurringExpense')}
                style={{ marginTop: 10 }}
            />

            <Text style={{ marginTop: 20 }}>Gastos Recorrentes</Text>
            {filteredPlanningArray.length === 0 ? (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>
                    Nenhum gasto adicionado para o mês selecionado.
                </Text>
            ) : (
                <FlatList
                    style={{ flex: 1, margin: 5 }}
                    data={filteredPlanningArray}
                    keyExtractor={item => item.date}
                    renderItem={({ item }) => (
                        <View>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                                {item.date}
                            </Text>

                            {item.data.map(expense => (
                                <TouchableOpacity
                                    key={expense.id}
                                    onPress={() => navigation.navigate('EditPlanningScreen', { id: expense.id })}
                                >
                                    <View style={{
                                        borderColor: COLOR.Grey,
                                        height: 50,
                                        marginBottom: 10,
                                        borderRadius: 5,
                                        borderWidth: 1,
                                        padding: 5,
                                        justifyContent: 'space-between',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                        <Text>{expense.description}</Text>
                                        <Text>R$ {expense.amount.toFixed(2)}</Text>

                                        <View style={{
                                            backgroundColor: COLOR.Grey,
                                            width: 80,
                                            height: 30,
                                            borderRadius: 5,
                                            alignItems: "center",
                                            justifyContent: 'center',
                                        }}>
                                            <Text>{expense.status}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                />
            )}
        </ScreenWrapper>
    );
};
