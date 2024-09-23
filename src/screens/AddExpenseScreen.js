import React, { useState, useContext } from 'react';
import { StyleSheet, Alert, View } from 'react-native';
import { ExpenseContext } from '../context/ExpenseContext';
import { COLOR } from '../theme/Theme';
import RText from '../components/RText';
import Dropdown from '../components/Dropdown';
import InputReal from '../components/MoneyInput';
import InputStyle from '../components/FormInput';
import JadeButton from '../components/JadeButton';
import ScreenWrapper from '../components/ScreenWrapper';

import { format, parse, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AddExpenseScreen({ navigation }) {
    const [editDate, setEditDate] = useState(new Date().toLocaleDateString());
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [location, setLocation] = useState('');
    const [payment, setPayment] = useState('Débito');
    const [status, setStatus] = useState('Aguardando');
    const [isRecurring, setIsRecurring] = useState(false);
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

        const newExpense = {
            id: Date.now(),
            description,
            amount: parseFloat(numericValue),
            date: editDate,
            location: isRecurring ? undefined : location,
            payment: isRecurring ? undefined : payment,
            isRecurring,
            recurrenceInterval: isRecurring ? recurrenceInterval : undefined,
            status: isRecurring ? status : undefined,
            category: formattedMonthName + newYear,
        };

        addExpense(newExpense);
        navigation.goBack();
    };

    return (
        <ScreenWrapper>
            <View>
                <Dropdown
                    selectedValue={isRecurring}
                    onValueChange={setIsRecurring}
                    title={'Tipo de gasto'}
                    type={'recurrent'}
                />

                {isRecurring ? (
                    <>
                        {/* Recorrente */}
                        <Dropdown
                            selectedValue={recurrenceInterval}
                            onValueChange={setRecurrenceInterval}
                            title={'Intervalo de Recorrência'}
                            type={'recurrenceInterval'}
                        />

                        <View>
                            <InputStyle
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
                ) : (
                    <>
                        {/* Diario */}
                        <View>
                            <InputStyle
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
                )}
            </View>

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