import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import React, { useState, useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

export default function ConfigScreen({ navigation }) {
    const { walletBalance, updateWalletBalance } = useContext(ExpenseContext);
    const [saldo, setSaldo] = useState('');

    const handleBalanceUpdate = () => {
        const parsedSaldo = parseFloat(saldo); // Converte saldo para número

        if (!isNaN(parsedSaldo)) {
            updateWalletBalance(walletBalance + parsedSaldo); // Adiciona o saldo ao valor existente
            navigation.goBack();
        } else {
            alert('Por favor, insira um valor numérico válido.');
        }
    };

    return (
        <ScreenWrapper>
            <Text>Adicionar Saldo (use "-" para remover)</Text>
            <TextInput
                value={saldo}
                onChangeText={setSaldo}
                style={styles.input}
                keyboardType="decimal-pad"
            />
            <Button onPress={handleBalanceUpdate} title="Salvar" />
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