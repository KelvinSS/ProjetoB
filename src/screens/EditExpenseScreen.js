import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { ExpenseContext } from '../context/ExpenseContext';
import ScreenWrapper from '../components/ScreenWrapper';
import { Picker } from '@react-native-picker/picker';

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
    const [newPayment, setNewPayment] = useState('Débito');

    const handleSave = () => {
        if (!newDescription || !newAmount) {
            alert('Descrição e valor são obrigatórios');
            return;
        }

        updateExpense({
            id,
            description: newDescription,
            amount: parseFloat(newAmount),
            location: newLocation,
            payment: newPayment,
            date: newEditDate,
        });
        navigation.goBack();
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
            <Text style={styles.label}>Data:</Text>
            <TextInput
                style={styles.input}
                value={newEditDate}
                onChangeText={setNewEditDate}
            />
            <Text style={styles.label}>Descrição:</Text>
            <TextInput
                style={styles.input}
                value={newDescription}
                onChangeText={setNewDescription}
            />
            <Text style={styles.label}>Valor:</Text>
            <TextInput
                style={styles.input}
                value={newAmount}
                onChangeText={text => setNewAmount(text)}
                keyboardType="numeric"
            />
            <Text style={styles.label}>Local (Opcional):</Text>
            <TextInput
                style={styles.input}
                value={newLocation}
                onChangeText={setNewLocation}
            />
            <Picker
                selectedValue={newPayment}
                onValueChange={(itemValue) => setNewPayment(itemValue)}
                mode='dropdown'
                borderColor='red'
                style={{ backgroundColor: '#ccc', marginBottom: 15 }}
                borderWidth='2'
            >
                <Picker.Item label='Débito' value={'Débito'} />
                <Picker.Item label='Pix' value={'Pix'} />
                <Picker.Item label='Crédito' value={'Crédito'} />
            </Picker>
            <View style={{ height: 90, justifyContent: 'space-between' }}>
                <Button title="Salvar" onPress={handleSave} />
                <Button title="Deletar" onPress={handleDelete} color={'red'} />
            </View>
        </ScreenWrapper>
    );
};

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
    buttonArea: {
        marginBottom: 20,
        paddingBottom: 20
    }
});

export default EditExpenseScreen;
