import React, { useState, useContext } from 'react';
import { StyleSheet, TextInput, Button, Text } from 'react-native';
import { ExpenseContext } from '../context/ExpenseContext';
import ScreenWrapper from '../components/ScreenWrapper'
import { Picker } from '@react-native-picker/picker';

export default function AddExpenseScreen({ navigation }) {
    const [editDate, setEditDate] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [location, setLocation] = useState('');
    const [payment, setPayment] = useState('Débito');
    const { addExpense } = useContext(ExpenseContext);

    const handleAddExpense = () => {
        const newExpense = {
            id: Date.now(),
            description,
            amount: parseFloat(amount),
            location,
            payment,
            date: editDate,
        };

        addExpense(newExpense);
        navigation.goBack();
    };

    return (
        <ScreenWrapper>
            <Text style={styles.label}>Dia: {new Date().toLocaleDateString()}</Text>
            <TextInput value={editDate} onChangeText={setEditDate} style={styles.input} />
            <Text style={styles.label}>Descrição</Text>
            <TextInput value={description} onChangeText={setDescription} style={styles.input} />
            <Text style={styles.label}>Valor</Text>
            <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric" style={styles.input} />
            <Text style={styles.label}>Local (Opcional)</Text>
            <TextInput value={location} onChangeText={setLocation} style={styles.input} />
            <Text style={styles.label}>Forma de pagamento</Text>
            <Picker
                selectedValue={payment}
                onValueChange={(itemValue) => setPayment(itemValue)}
                mode='dropdown'
                borderColor='red'
                style={{ backgroundColor: '#ccc', marginBottom: 15 }}
                borderWidth='2'
            >
                <Picker.Item label='Débito' value={'Débito'} />
                <Picker.Item label='Pix' value={'Pix'} />
                <Picker.Item label='Crédito' value={'Crédito'} />
            </Picker>
            <Button title="Adicionar Gasto" onPress={handleAddExpense} />
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
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        marginBottom: 10,
    },
})