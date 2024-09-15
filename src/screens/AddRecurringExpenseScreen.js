import React, { useState, useContext } from 'react';
import { StyleSheet, TextInput, Text, Alert } from 'react-native';

import { PlanningContext } from '../context/PlanningContext';

import ScreenWrapper from '../components/ScreenWrapper';
import ButtonK from '../components/ButtonK';
import { Picker } from '@react-native-picker/picker';
import { COLOR } from '../theme/Theme';
import InputReal from '../components/InputReal';

export default function AddRecurringExpenseScreen({ navigation }) {
    const [editDate, setEditDate] = useState(new Date().toLocaleDateString());
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    const [paymentDay, setPaymentDay] = useState('Aguardando');
    const { addPlanning } = useContext(PlanningContext);

    const handleAddExpense = () => {
        const numericValue = parseFloat(amount.replace(/[^\d,]/g, '').replace(',', '.'));

        if (!description || !amount) {
            Alert.alert('Atenção!', 'Descrição e valor são obrigatórios');
            return;
        }

        const newPlanning = {
            id: Date.now().toString(),
            date: editDate,
            description: description,
            amount: parseFloat(numericValue),
            status: paymentDay,
        };

        addPlanning(newPlanning);

        Alert.alert('Sucesso!', 'Gasto recorrente adicionado.');
        navigation.goBack();
    };

    return (
        <ScreenWrapper>
            <Text style={styles.label}>Dia de vencimento<Text style={styles.attention}>*</Text></Text>
            <TextInput value={editDate} onChangeText={setEditDate} style={styles.input} keyboardType='numeric' />

            <Text style={styles.label}>Descrição<Text style={styles.attention}>*</Text></Text>
            <TextInput value={description} onChangeText={setDescription} style={styles.input} />

            <Text style={styles.label}>Valor<Text style={styles.attention}>*</Text></Text>
            <InputReal value={amount} onChangeText={setAmount} />

            <Text style={styles.label}>Status</Text>

            <Picker
                selectedValue={paymentDay}
                onValueChange={setPaymentDay}
                style={{ backgroundColor: COLOR.Jade, color: COLOR.White }}
            >
                <Picker.Item label='Aguardando' value='Aguardando' />
                <Picker.Item label='Pago' value='Pago' />
            </Picker>

            <ButtonK title={'Adicionar Gasto'} onPress={handleAddExpense} style={{ marginTop: 10 }} />
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
    attention: {
        color: 'red',
    },
});
