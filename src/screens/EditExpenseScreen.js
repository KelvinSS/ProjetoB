import React, { useState, useContext } from 'react';
import { View, Text, Alert } from 'react-native';
import { ExpenseContext } from '../context/ExpenseContext';
import { COLOR } from '../theme/Theme';
import Dropdown from '../components/Dropdown';
import InputReal from '../components/MoneyInput';
import InputStyle from '../components/FormInput';
import JadeButton from '../components/JadeButton';
import ScreenWrapper from '../components/ScreenWrapper';

const EditExpenseScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const { expenses, updateExpense, deleteExpense } = useContext(ExpenseContext);

    const expenseToEdit = expenses.find(expense => expense.id === id);

    if (!expenseToEdit) {
        return <Text>Gasto não encontrado</Text>;
    }

    const [newEditDate, setNewEditDate] = useState(expenseToEdit.date || '');
    const [newDescription, setNewDescription] = useState(expenseToEdit.description || '');
    const [newAmount, setNewAmount] = useState(expenseToEdit.amount ? expenseToEdit.amount.toString() : '');
    const [newLocation, setNewLocation] = useState(expenseToEdit.location || '');
    const [newPayment, setNewPayment] = useState(expenseToEdit.payment || '');
    const [newIsRecurring, setNewIsRecurring] = useState(expenseToEdit.isRecurring || '');
    const [newRecurrenceInterval, setNewRecurrenceInterval] = useState(expenseToEdit.recurrenceInterval || '');
    const [newStatus, setNewStatus] = useState(expenseToEdit.status || '');

    const handleSave = () => {
        const numericValue = parseFloat(newAmount.replace(/[^\d,]/g, '').replace(',', '.'));

        if (!newDescription || !newAmount) {
            Alert.alert('Descrição e valor são obrigatórios');
            return;
        }

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
            {newIsRecurring ? (<>
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
                    <InputStyle
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

            </>) : (<>
                <Dropdown
                    selectedValue={newPayment}
                    onValueChange={setNewPayment}
                    title={'Forma de pagamento'}
                    type={'paymentType'}
                />

                <View>
                    <InputStyle
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
            </>)}

            <View>
                <JadeButton  title={"Salvar"} onPress={handleSave} />
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
