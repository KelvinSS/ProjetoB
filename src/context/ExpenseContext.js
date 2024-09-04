import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    const [walletBalance, setWalletBalance] = useState(0);
    const [paymentDay, setPaymentDay] = useState(1); // Novo estado para o dia de vencimento da fatura

    useEffect(() => {
        const loadExpensesAndBalance = async () => {
            try {
                const savedExpenses = await AsyncStorage.getItem('expenses');
                const savedBalance = await AsyncStorage.getItem('walletBalance');
                const savedPaymentDay = await AsyncStorage.getItem('paymentDay'); // Carregar dia de vencimento

                if (savedExpenses !== null) {
                    setExpenses(JSON.parse(savedExpenses));
                }
                if (savedBalance !== null) {
                    setWalletBalance(parseFloat(savedBalance));
                }
                if (savedPaymentDay !== null) {
                    setPaymentDay(parseInt(savedPaymentDay, 10)); // Carregar dia de vencimento
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        };

        loadExpensesAndBalance();
    }, []);

    useEffect(() => {
        const saveExpensesAndBalance = async () => {
            try {
                await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
                await AsyncStorage.setItem('walletBalance', walletBalance.toString());
                await AsyncStorage.setItem('paymentDay', paymentDay.toString()); // Salvar dia de vencimento
            } catch (error) {
                console.error('Erro ao salvar dados:', error);
            }
        };

        saveExpensesAndBalance();
    }, [expenses, walletBalance, paymentDay]); // Incluir paymentDay na lista de dependências

    const addExpense = (expense) => {
        setExpenses([...expenses, expense]);
        setWalletBalance(prevBalance => prevBalance - expense.amount);
    };

    const deleteExpense = (id) => {
        const expenseToDelete = expenses.find(expense => expense.id === id);
        if (expenseToDelete) {
            setExpenses(expenses.filter(expense => expense.id !== id));
            setWalletBalance(prevBalance => prevBalance + expenseToDelete.amount);
        }
    };

    const updateExpense = (updatedExpense) => {
        setExpenses(expenses.map(expense => (expense.id === updatedExpense.id ? updatedExpense : expense)));
    };

    const updateWalletBalance = (newBalance) => {
        setWalletBalance(newBalance);
    };

    const updatePaymentDay = (newDay) => {
        setPaymentDay(newDay);
    };

    return (
        <ExpenseContext.Provider value={{
            expenses,
            walletBalance,
            addExpense,
            deleteExpense,
            updateExpense,
            updateWalletBalance,
            paymentDay,
            updatePaymentDay // Adicionar função de atualização
        }}>
            {children}
        </ExpenseContext.Provider>
    );
};
