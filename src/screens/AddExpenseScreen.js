import React, { useState, useContext } from 'react';
import { StyleSheet, Alert, View, ScrollView } from 'react-native';
import { ExpenseContext } from '../context/ExpenseContext';
import { COLOR } from '../theme/Theme';
import { format, parse, isValid, addMonths, setDate } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import uuid from 'react-native-uuid';
import RText from '../components/RText';
import Dropdown from '../components/Dropdown';
import DateInput from '../components/DateInput';
import InputReal from '../components/MoneyInput';
import InputStyle from '../components/FormInput';
import JadeButton from '../components/JadeButton';
import ScreenWrapper from '../components/ScreenWrapper';

export default function AddExpenseScreen({ navigation }) {
    const [editDate, setEditDate] = useState(new Date().toLocaleDateString());
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [location, setLocation] = useState('');
    const [payment, setPayment] = useState('Débito');
    const [status, setStatus] = useState('Aguardando');
    const [isRecurring, setIsRecurring] = useState('Diário');
    const [recurrenceInterval, setRecurrenceInterval] = useState('Mensal');

    const { addExpense } = useContext(ExpenseContext);

    const handleAddExpense = () => {
        const parsedDate = parse(editDate, 'dd/MM/yyyy', new Date());

        if (!isValid(parsedDate)) {
            Alert.alert('Atenção!', 'A data inserida está no formato incorreto');
            return;
        }

        const newMonthName = format(parsedDate, 'MMMM', { locale: ptBR });
        const formattedMonthName = newMonthName.charAt(0).toUpperCase() + newMonthName.slice(1);
        const newYear = format(parsedDate, 'yyyy');

        const numericValue = parseFloat(amount.replace(/[^\d,]/g, '').replace(',', '.'));

        if (!description || !amount) {
            Alert.alert('Atenção!', 'Descrição e valor são obrigatórios');
            return;
        }

        if (isRecurring === 'Diário') {
            const newExpense = {
                isRecurring,
                id: Date.now(),
                description,
                amount: parseFloat(numericValue),
                date: editDate,
                location: location,
                payment: payment,
                category: formattedMonthName + newYear,
            };

            addExpense(newExpense);
            navigation.goBack();

        }
        else if (isRecurring === 'Recorrente') {
            let currentMonthDate = parsedDate;
            const endOfYear = new Date(format(parsedDate, 'yyyy'), 11, 31);

            const selectedDay = parseInt(format(parsedDate, 'd'));
            const expensesToAdd = [];

            while (currentMonthDate <= endOfYear) {
                const formattedMonthName = format(currentMonthDate, 'MMMM', { locale: ptBR }).charAt(0).toUpperCase() + format(currentMonthDate, 'MMMM', { locale: ptBR }).slice(1);
                const newYear = format(currentMonthDate, 'yyyy');

                const lastDayOfMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 0).getDate();
                const adjustedDay = selectedDay > lastDayOfMonth ? lastDayOfMonth : selectedDay;

                currentMonthDate = setDate(currentMonthDate, adjustedDay);

                const newExpense = {
                    isRecurring,
                    id: uuid.v4(),
                    description,
                    amount: parseFloat(numericValue),
                    date: format(currentMonthDate, 'dd/MM/yyyy'),
                    location: location,
                    recurrenceInterval: recurrenceInterval,
                    status: status,
                    category: formattedMonthName + newYear,
                };

                expensesToAdd.push(newExpense);
                currentMonthDate = addMonths(currentMonthDate, 1);
            }

            expensesToAdd.forEach(expense => addExpense(expense));

            navigation.goBack();
        };
    };

    return (
        <ScreenWrapper>
            <ScrollView>
                <Dropdown
                    selectedValue={isRecurring}
                    onValueChange={setIsRecurring}
                    title={'Tipo de gasto'}
                    type={'recurrent'}
                />

                {isRecurring === 'Recorrente' ? (
                    <>
                        {/* Recorrente */}
                        <Dropdown
                            selectedValue={recurrenceInterval}
                            onValueChange={setRecurrenceInterval}
                            title={'Intervalo de Recorrência'}
                            type={'recurrenceInterval'}
                        />

                        <View>
                            <DateInput
                                value={editDate}
                                onChangeText={setEditDate}
                                title={'Data'}
                            />
                            <InputStyle
                                value={description}
                                onChangeText={setDescription}
                                titleRequired={'Descrição'}
                            />
                            <InputReal
                                value={amount}
                                onChangeText={setAmount}
                                titleRequired={'Valor'}
                            />
                        </View>

                        <Dropdown
                            selectedValue={status}
                            onValueChange={setStatus}
                            title={'Status'}
                            type={'status'}
                        />
                    </>
                ) : isRecurring === 'Diário' ? (
                    <>
                        {/* Diario */}
                        <View>
                            <DateInput
                                value={editDate}
                                onChangeText={setEditDate}
                                title={'Data'}
                            />
                            <InputStyle
                                value={description}
                                onChangeText={setDescription}
                                titleRequired={'Descrição'}
                            />
                            <InputReal
                                value={amount}
                                onChangeText={setAmount}
                                titleRequired={'Valor'}
                            />
                            <InputStyle
                                value={location}
                                onChangeText={setLocation}
                                title={'Local'}
                            />
                        </View>

                        <View>
                            <RText style={styles.label}>Forma de pagamento</RText>
                            <Dropdown selectedValue={payment} onValueChange={setPayment} type={'paymentType'} />
                        </View>
                    </>
                ) : ''}
            </ScrollView>

            <JadeButton title={'Adicionar Gasto'} onPress={handleAddExpense} />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold'
    },
    input: {
        height: 40,
        borderColor: COLOR.Jade,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        marginBottom: 10,
    },
});