import React, { useState, useContext } from 'react';
import { StyleSheet, TextInput, Text, Alert } from 'react-native';
import { ExpenseContext } from '../context/ExpenseContext';
import ScreenWrapper from '../components/ScreenWrapper'
import Dropdown from '../components/Dropdawn';
import InputReal from '../components/InputReal';
import { COLOR } from '../theme/Theme';
import ButtonK from '../components/ButtonK';

export default function AddExpenseScreen({ navigation }) {
    const [editDate, setEditDate] = useState(new Date().toLocaleDateString());
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [location, setLocation] = useState('');
    const [payment, setPayment] = useState('Débito');
    const { addExpense } = useContext(ExpenseContext);

    const handleAddExpense = () => {
        const numericValue = parseFloat(amount.replace(/[^\d,]/g, '').replace(',', '.'));

        if (!description || !amount) {
            Alert.alert('Atenção!', 'Descrição e valor são obrigatórios');
            return;
        }

        const newExpense = {
            id: Date.now(),
            description,
            amount: parseFloat(numericValue),
            location,
            payment,
            date: editDate,
        };

        addExpense(newExpense);
        navigation.goBack();
    };

    return (
        <ScreenWrapper>
            <Text style={styles.label}>Dia</Text>
            <TextInput value={editDate} onChangeText={setEditDate} style={styles.input} />

            <Text style={styles.label}>Descrição<Text style={{ color: COLOR.Red }}>*</Text></Text>
            <TextInput value={description} onChangeText={setDescription} style={styles.input} />

            <Text style={styles.label}>Valor<Text style={{ color: COLOR.Red }}>*</Text></Text>
            <InputReal value={amount} onChangeText={setAmount} />

            <Text style={styles.label}>Local (Opcional)</Text>
            <TextInput value={location} onChangeText={setLocation} style={styles.input} />

            <Text style={styles.label}>Forma de pagamento</Text>
            <Dropdown selectedValue={payment} onValueChange={setPayment} />

            <ButtonK title={'Adicionar Gasto'} onPress={handleAddExpense} />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        marginBottom: 8,
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
})