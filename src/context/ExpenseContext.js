import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        const loadExpenses = async () => {
            try {
                const savedExpenses = await AsyncStorage.getItem('expenses');
                if (savedExpenses !== null) {
                    setExpenses(JSON.parse(savedExpenses));
                }
            } catch (error) {
                console.error('Erro ao carregar gastos:', error);
            }
        };

        loadExpenses();
    }, []);

    useEffect(() => {
        const saveExpenses = async () => {
            try {
                await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
            } catch (error) {
                console.error('Erro ao salvar gastos:', error);
            }
        };

        saveExpenses();
    }, [expenses]);

    const addExpense = (expense) => {
        setExpenses([...expenses, expense]);
    };

    const deleteExpense = (id) => {
        setExpenses(expenses.filter(expense => expense.id !== id));
    };

    const updateExpense = (updatedExpense) => {
        setExpenses(expenses.map(expense => (expense.id === updatedExpense.id ? updatedExpense : expense)));
    };

    return (
        <ExpenseContext.Provider value={{ expenses, addExpense, deleteExpense, updateExpense }}>
            {children}
        </ExpenseContext.Provider>
    );
};
