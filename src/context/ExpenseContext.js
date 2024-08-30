import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);

    // Carrega os gastos salvos no AsyncStorage
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

    // Salva os gastos no AsyncStorage sempre que eles mudarem
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

    return (
        <ExpenseContext.Provider value={{ expenses, addExpense, deleteExpense }}>
            {children}
        </ExpenseContext.Provider>
    );
};
