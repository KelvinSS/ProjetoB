import React, { useState, useContext } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Text, Alert } from 'react-native';

import { PlanningContext } from '../context/PlanningContext'; // Importa o contexto

import ScreenWrapper from '../components/ScreenWrapper';
import InputStyle from '../components/FormInput';
import JadeButton from '../components/JadeButton';
import { COLOR } from '../theme/Theme';

const EditPlanningScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const { planningExpenses, updatePlanning, deletePlanning } = useContext(PlanningContext);

    const planningToEdit = planningExpenses.find(planningExpense => planningExpense.id === id);

    if (!planningToEdit) {
        return <Text>Gasto não encontrado</Text>;
    };

    const [newDescription, setNewDescription] = useState(planningToEdit.description || '');
    const [newAmount, setNewAmount] = useState(planningToEdit.amount ? planningToEdit.amount.toString() : '');
    const [newEditDate, setNewEditDate] = useState(planningToEdit.date || '');
    const [newPaymentDay, setNewPaymentDay] = useState(planningToEdit.status || '');

    const handleSave = () => {
        const numericValue = parseFloat(newAmount.replace(/[^\d,]/g, '').replace(',', '.'));

        if (!newDescription || !newAmount) {
            Alert.alert('Descrição e valor são obrigatórios');
            return;
        };

        updatePlanning({
            id,
            date: newEditDate, // todo
            description: newDescription,
            amount: parseFloat(numericValue),
            status: newPaymentDay // todo
        });

        navigation.goBack();
    };

    const handleDelete = () => {
        Alert.alert(
            'Excluir?',
            'Deseja realmente excluir a despesa recorrente?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Excluir',
                    onPress: () => {
                        deletePlanning(id);
                        navigation.goBack();
                    },
                    style: 'destructive'
                },
            ],
        );
    };

    return (
        <ScreenWrapper>
            <Text>Editar Gasto Recorrente</Text>
            <InputStyle
                value={newEditDate}
                onChangeText={setNewEditDate}
                placeholder={'Data'}
            />
            <InputStyle
                value={newDescription}
                onChangeText={setNewDescription}
                placeholder={'Descrição'}
            />
            <InputStyle
                value={newAmount}
                onChangeText={setNewAmount}
                keyboardType="numeric"
                placeholder="Valor"
            />

            <Picker
                selectedValue={newPaymentDay}
                onValueChange={setNewPaymentDay}
                style={{ backgroundColor: COLOR.Jade, color: COLOR.White }}
            >
                <Picker.Item label='Aguardando' value='Aguardando' />
                <Picker.Item label='Pago' value='Pago' />
            </Picker>

            <JadeButton
                title="Salvar"
                onPress={handleSave}
                style={{ marginTop: 10 }}
            />

            <JadeButton
                title={'Excluir'}
                onPress={handleDelete}
                style={{ backgroundColor: COLOR.Red, marginTop: 10 }}
            />

        </ScreenWrapper>
    );
};

export default EditPlanningScreen;
