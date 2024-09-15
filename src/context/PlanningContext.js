import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PlanningContext = createContext();

export const PlanningProvider = ({ children }) => {
    const [planningExpenses, setPlanningExpense] = useState([]);

    useEffect(() => {
        const savePlanning = async () => {
            try {
                if (Array.isArray(planningExpenses)) {
                    await AsyncStorage.setItem('planningExpenses', JSON.stringify(planningExpenses));
                }
            } catch (error) {
                console.error('Erro ao salvar dados:', error);
            }
        };

        savePlanning();
    }, [planningExpenses]);

    useEffect(() => {
        const loadPlanning = async () => {
            try {
                const savedPlanning = await AsyncStorage.getItem('planningExpenses');
                if (savedPlanning !== null) {
                    setPlanningExpense(JSON.parse(savedPlanning));
                } else {
                    setPlanningExpense([]);
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        };

        loadPlanning();
    }, []);

    const addPlanning = (planningExpense) => {
        setPlanningExpense((prevExpenses) => [...(prevExpenses || []), planningExpense]);
    };

    const deletePlanning = (id) => {
        setPlanningExpense((prevExpenses) => prevExpenses?.filter(planningExpense => planningExpense.id !== id) || []);
    };

    const updatePlanning = (updatedPlanning) => {
        setPlanningExpense((prevExpenses) =>
            prevExpenses?.map(planningExpense => (planningExpense.id === updatedPlanning.id ? updatedPlanning : planningExpense)) || []
        );
    };

    return (
        <PlanningContext.Provider
            value={{
                planningExpenses,
                addPlanning,
                deletePlanning,
                updatePlanning
            }}>
            {children}
        </PlanningContext.Provider>
    );
};
