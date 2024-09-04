import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { ExpenseContext } from '../context/ExpenseContext';
import { Picker } from '@react-native-picker/picker';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConfigScreen({ navigation }) {
    const { walletBalance, updateWalletBalance, updatePaymentDay } = useContext(ExpenseContext);
    const [saldo, setSaldo] = useState('');
    const [selectedPaymentDay, setSelectedPaymentDay] = useState(1);

    useEffect(() => {
        const loadPaymentDay = async () => {
            try {
                const savedPaymentDay = await AsyncStorage.getItem('paymentDay');
                if (savedPaymentDay !== null) {
                    setSelectedPaymentDay(parseInt(savedPaymentDay, 10));
                }
            } catch (error) {
                console.error('Erro ao carregar o dia de pagamento:', error);
            }
        };

        loadPaymentDay();
    }, []);

    const handleBalanceUpdate = () => {
        const parsedSaldo = parseFloat(saldo);

        if (!isNaN(parsedSaldo)) {
            updateWalletBalance(walletBalance + parsedSaldo);
            navigation.goBack();
        } else {
            alert('Por favor, insira um valor numérico válido.');
        }
    };

    const handleUpdatePaymentDay = async () => {
        try {
            await AsyncStorage.setItem('paymentDay', selectedPaymentDay.toString());
            updatePaymentDay(selectedPaymentDay);
            await scheduleNotification(); // Agendar notificação após atualizar o dia de pagamento
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao salvar o dia de pagamento:', error);
        }
    };

    const scheduleNotification = async () => {
        try {
            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Lembrete de Pagamento",
                    body: `Lembre-se de pagar sua fatura hoje!`,
                    data: { screen: 'CreditExpenses' },
                },
                trigger: {
                    hour: 9, // Hora para notificação, por exemplo, 9h
                    minute: 0,
                    repeats: false,
                },
            });

            console.log('Notification scheduled with ID:', notificationId);
        } catch (error) {
            console.error('Erro ao agendar a notificação:', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Adicionar Saldo (use "-" para remover)</Text>
            <TextInput
                value={saldo}
                onChangeText={setSaldo}
                style={styles.input}
                keyboardType="decimal-pad"
            />
            <Button onPress={handleBalanceUpdate} title="Atualizar Saldo" />

            <View style={styles.pickerContainer}>
                <Text>Cartão de crédito</Text>
                <Text>Selecionar vencimento da Fatura</Text>
                <Picker
                    selectedValue={selectedPaymentDay}
                    onValueChange={(itemValue) => setSelectedPaymentDay(itemValue)}
                    style={styles.picker}
                >
                    {Array.from({ length: 31 }, (_, i) => (
                        <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
                    ))}
                </Picker>
            </View>

            <Button onPress={handleUpdatePaymentDay} title="Salvar" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
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
    pickerContainer: {
        marginBottom: 20,
    },
    picker: {
        height: 50,
    },
});
