import React, { useState, useContext } from 'react';
import { StyleSheet, TextInput, Button } from 'react-native';
import { ExpenseContext } from '../context/ExpenseContext';
import ScreenWrapper from '../components/ScreenWrapper'

export default function AddExpenseScreen({ navigation }) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [location, setLocation] = useState('');
    const { addExpense } = useContext(ExpenseContext);

    const handleAddExpense = () => {
        const newExpense = {
            id: Date.now(),
            description,
            amount: parseFloat(amount),
            location,
            date: new Date().toLocaleDateString(), // Adiciona a data no formato "dd/mm/yyyy"
        };

        addExpense(newExpense);
        navigation.goBack();
    };

    return (
        <ScreenWrapper>
            <TextInput placeholder="Descrição" value={description} onChangeText={setDescription} style={styles.input} />
            <TextInput placeholder="Valor" value={amount} onChangeText={setAmount} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Local (Opcional)" value={location} onChangeText={setLocation} style={styles.input} />
            <Button title="Adicionar Gasto" onPress={handleAddExpense} />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        marginBottom: 10,
    }
})