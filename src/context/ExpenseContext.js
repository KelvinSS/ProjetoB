import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    const [walletBalance, setWalletBalance] = useState(0); // Estado para o saldo da carteira

    useEffect(() => {
        const loadExpensesAndBalance = async () => {
            try {
                const savedExpenses = await AsyncStorage.getItem('expenses');
                const savedBalance = await AsyncStorage.getItem('walletBalance');
                if (savedExpenses !== null) {
                    setExpenses(JSON.parse(savedExpenses));
                }
                if (savedBalance !== null) {
                    setWalletBalance(parseFloat(savedBalance));
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
            } catch (error) {
                console.error('Erro ao salvar dados:', error);
            }
        };

        saveExpensesAndBalance();
    }, [expenses, walletBalance]);

    const addExpense = (expense) => {
        setExpenses([...expenses, expense]);
        setWalletBalance(prevBalance => prevBalance - expense.amount);
    };

    const deleteExpense = (id) => {
        const expenseToDelete = expenses.find(expense => expense.id === id);
        if (deleteExpense) {
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

    return (
        <ExpenseContext.Provider value={{ expenses, walletBalance, addExpense, deleteExpense, updateExpense, updateWalletBalance }}>
            {children}
        </ExpenseContext.Provider>
    );
};
