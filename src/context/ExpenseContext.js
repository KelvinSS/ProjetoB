import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    const [walletBalance, setWalletBalance] = useState(0);
    const [paymentDay, setPaymentDay] = useState(1);
    const [advancePaymentDay, setAdvancePaymentDay] = useState(null);

    useEffect(() => {
        const loadExpensesAndBalance = async () => {
            try {
                const savedExpenses = await AsyncStorage.getItem('expenses');
                const savedBalance = await AsyncStorage.getItem('walletBalance');
                const savedPaymentDay = await AsyncStorage.getItem('paymentDay');
                const savedAdvancePaymentDay = await AsyncStorage.getItem('advancePaymentDay');

                let parsedExpenses = savedExpenses ? JSON.parse(savedExpenses) : [];
                
                // Atualiza as categorias dos gastos antigos
                parsedExpenses = updateOldExpensesCategories(parsedExpenses);

                setExpenses(parsedExpenses);
                if (savedBalance !== null) {
                    setWalletBalance(parseFloat(savedBalance));
                }
                if (savedPaymentDay !== null) {
                    setPaymentDay(parseInt(savedPaymentDay, 10));
                }
                if (savedAdvancePaymentDay !== null) {
                    setAdvancePaymentDay(parseInt(savedAdvancePaymentDay, 10));
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
                await AsyncStorage.setItem('paymentDay', paymentDay.toString());
                if (advancePaymentDay !== null) {
                    await AsyncStorage.setItem('advancePaymentDay', advancePaymentDay.toString());
                }
            } catch (error) {
                console.error('Erro ao salvar dados:', error);
            }
        };

        saveExpensesAndBalance();
    }, [expenses, walletBalance, paymentDay, advancePaymentDay]);

    // Função para recategorizar os gastos antigos
    const updateOldExpensesCategories = (oldExpenses) => {
        return oldExpenses.map(expense => {
            // Verifica se a categoria está no formato correto
            if (!expense.category || !/^[A-Za-z]+[0-9]{4}$/.test(expense.category)) {
                const expenseDate = parse(expense.date, 'dd/MM/yyyy', new Date());
                const newMonthName = format(expenseDate, 'MMMM', { locale: ptBR });
                const formattedMonthName = newMonthName.charAt(0).toUpperCase() + newMonthName.slice(1);
                const newYear = format(expenseDate, 'yyyy');

                // Atualiza a categoria no formato 'MêsAno'
                expense.category = formattedMonthName + newYear;
            }
            return expense;
        });
    };

    const addExpense = (expense) => {
        setExpenses((prevExpenses) => {
            const updatedExpenses = [...prevExpenses, expense];

            if (expense.isRecurring === 'Diário') {
                setWalletBalance(prevBalance => prevBalance - expense.amount);
            }

            if (expense.isRecurring === 'Recorrente' && expense.status === 'Pago') {
                setWalletBalance(prevBalance => prevBalance - expense.amount);
            }

            return updatedExpenses;
        });
    };

    const deleteExpense = (id) => {
        const expenseToDelete = expenses.find(expense => expense.id === id);

        if (expenseToDelete) {
            setExpenses(expenses.filter(expense => expense.id !== id));

            if (expenseToDelete.isRecurring === 'Diário') {
                setWalletBalance(prevBalance => prevBalance + expenseToDelete.amount);
            }
        }
    };

    const updateExpense = (updatedExpense) => {
        setExpenses(currentExpenses => {
            const existingExpense = currentExpenses.find(expense => expense.id === updatedExpense.id);

            if (existingExpense && existingExpense.status !== updatedExpense.status) {
                if (updatedExpense.status === 'Pago') {
                    setWalletBalance(currentBalance => currentBalance - updatedExpense.amount);
                } else if (existingExpense.status === 'Pago') {
                    setWalletBalance(currentBalance => currentBalance + existingExpense.amount);
                }
            }

            return currentExpenses.map(expense => (expense.id === updatedExpense.id ? updatedExpense : expense));
        });
    };

    const updateWalletBalance = (newBalance) => {
        setWalletBalance(newBalance);
    };

    const updatePaymentDay = (newDay) => {
        setPaymentDay(newDay);
    };

    const updateAdvancePaymentDay = (newDay) => {
        setAdvancePaymentDay(newDay);
    };

    const getExpensesByCategory = (category) => {
        return expenses.filter(expense => expense.category === category);
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
            getExpensesByCategory,
            advancePaymentDay,
            updatePaymentDay,
            updateAdvancePaymentDay,
        }}>
            {children}
        </ExpenseContext.Provider>
    );
};
