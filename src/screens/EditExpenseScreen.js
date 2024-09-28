import React, { useState, useContext } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { ExpenseContext } from '../context/ExpenseContext';
import { COLOR } from '../theme/Theme';
import Dropdown from '../components/Dropdown';
import InputReal from '../components/MoneyInput';
import InputStyle from '../components/FormInput';
import JadeButton from '../components/JadeButton';
import ScreenWrapper from '../components/ScreenWrapper';

import { format, parse, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '../utils/formatCurrency';
import DateInput from '../components/DateInput';
import RText from '../components/RText';

const EditExpenseScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const { expenses, updateExpense, deleteExpense, updateWalletBalance, walletBalance } = useContext(ExpenseContext);

    const expenseToEdit = expenses.find(expense => expense.id === id);

    if (!expenseToEdit) {
        return <Text>Gasto não encontrado</Text>;
    }

    const [newEditDate, setNewEditDate] = useState(expenseToEdit.date || '');
    const [newDescription, setNewDescription] = useState(expenseToEdit.description || '');
    const [newAmount, setNewAmount] = useState(expenseToEdit.amount ? formatCurrency(expenseToEdit.amount.toString()) : '');
    const [newLocation, setNewLocation] = useState(expenseToEdit.location || '');
    const [newPayment, setNewPayment] = useState(expenseToEdit.payment || '');
    const [newIsRecurring, setNewIsRecurring] = useState(expenseToEdit.isRecurring || '');
    const [newRecurrenceInterval, setNewRecurrenceInterval] = useState(expenseToEdit.recurrenceInterval || '');
    const [newStatus, setNewStatus] = useState(expenseToEdit.status || '');

    const handleSave = () => {
        const parsedDate = parse(newEditDate, 'dd/MM/yyyy', new Date());

        if (!isValid(parsedDate)) {
            Alert.alert('Atenção!', 'A data inserida está no formato incorreto');
            return;
        }

        const newMonthName = format(parsedDate, 'MMMM', { locale: ptBR });
        const formattedMonthName = newMonthName.charAt(0).toUpperCase() + newMonthName.slice(1);
        const newYear = format(parsedDate, 'yyyy');
        const numericValue = parseFloat(newAmount.replace(/[^\d,]/g, '').replace(',', '.'));

        if (!newDescription || !newAmount) {
            Alert.alert('Descrição e valor são obrigatórios');
            return;
        };

        const oldAmount = expenseToEdit.amount;
        const amountDifference = numericValue - oldAmount;

        if (newIsRecurring === 'Diário') {
            updateWalletBalance(walletBalance - amountDifference);
        };

        updateExpense({
            id,
            description: newDescription,
            amount: parseFloat(numericValue),
            location: newLocation,
            payment: newPayment,
            date: newEditDate,
            isRecurring: newIsRecurring,
            recurrenceInterval: newRecurrenceInterval,
            status: newStatus,
            category: formattedMonthName + newYear,
        });

        navigation.goBack();
        Alert.alert('', `${newDescription} Atualizado com sucesso.`)
    };

    const handleDelete = () => {
        Alert.alert(
            'Confirmar Exclusão',
            'Tem certeza de que deseja excluir este gasto?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Excluir',
                    onPress: () => {
                        deleteExpense(id);
                        navigation.goBack();
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    return (
        <ScreenWrapper>
            <ScrollView>
                {newIsRecurring === 'Recorrente' ? (<>
                    {/* recorrente */}
                    <View>
                        <View>
                            <Dropdown
                                selectedValue={newPayment}
                                onValueChange={setNewPayment}
                                title={'Forma de pagamento'}
                                type={'paymentType'}
                            />
                            <Dropdown
                                selectedValue={newRecurrenceInterval}
                                onValueChange={setNewRecurrenceInterval}
                                title={'Intervalo de Recorrência'}
                                type={'recurrenceInterval'}
                            />
                        </View>

                        <View>
                            <DateInput
                                value={newEditDate}
                                onChangeText={setNewEditDate}
                                title={'Data'}
                            />
                            <InputStyle
                                value={newDescription}
                                onChangeText={setNewDescription}
                                title={'Descrição'}
                            />
                            <InputReal
                                value={newAmount}
                                onChangeText={setNewAmount}
                                title={'Valor'}
                            />
                        </View>

                        <Dropdown
                            selectedValue={newStatus}
                            onValueChange={setNewStatus}
                            title={'Status'}
                            type={'status'}
                        />
                    </View>
                </>) : newIsRecurring === 'Diário' ? (<>
                    {/* Diário */}
                    <View>
                        <Dropdown
                            selectedValue={newPayment}
                            onValueChange={setNewPayment}
                            title={'Forma de pagamento'}
                            type={'paymentType'}
                        />
                        <DateInput
                            value={newEditDate}
                            onChangeText={setNewEditDate}
                            title={'Data'}
                        />
                        <InputStyle
                            value={newDescription}
                            onChangeText={setNewDescription}
                            title={'Descrição'}
                        />
                        <InputReal
                            value={newAmount}
                            onChangeText={setNewAmount}
                            title={'Valor'}
                        />
                        <InputStyle
                            value={newLocation}
                            onChangeText={setNewLocation}
                            title={'Local'}
                        />
                    </View>
                </>) : ''}
            </ScrollView>

            <View>
                <JadeButton title={"Salvar"} onPress={handleSave} />
                <JadeButton
                    style={{ backgroundColor: COLOR.Red, marginTop: 10 }}
                    onPress={handleDelete}
                    title={"Deletar"}
                />
            </View>

        </ScreenWrapper>
    );
};

export default EditExpenseScreen;
