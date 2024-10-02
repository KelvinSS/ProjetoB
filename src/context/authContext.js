import React, { createContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { AppState, TouchableWithoutFeedback } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const timeoutRef = useRef(null);
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const checkLogin = async () => {
            const savedUsername = await AsyncStorage.getItem('username');
            const savedPassword = await AsyncStorage.getItem('password');
            const savedLoginStatus = await AsyncStorage.getItem('isLoggedIn');

            if (savedUsername && savedPassword && savedLoginStatus === 'true') {
                setUsername(savedUsername);
                setPassword(savedPassword);
                setIsLoggedIn(true);
                startInactivityTimer();
            }
        };
        checkLogin();
    }, []);

    const startInactivityTimer = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            logout();
        }, 1800000);
    };

    const resetInactivityTimer = () => {
        if (isLoggedIn) {
            startInactivityTimer();
        }
    };

    const login = async (inputUsername, inputPassword) => {
        const storedUsername = await AsyncStorage.getItem('registeredUsername');
        const storedPassword = await AsyncStorage.getItem('registeredPassword');

        if (!storedUsername && !storedPassword) {
            if (inputUsername === 'Admin' && inputPassword === 'Admin') {
                await AsyncStorage.setItem('registeredUsername', 'Admin');
                await AsyncStorage.setItem('registeredPassword', 'Admin');
                await AsyncStorage.setItem('username', inputUsername);
                await AsyncStorage.setItem('password', inputPassword);
                await AsyncStorage.setItem('isLoggedIn', 'true');
                setIsLoggedIn(true);
                startInactivityTimer();
            } else {
                throw new Error('Credenciais inválidas');
            }
        } else {
            if (inputUsername === storedUsername && inputPassword === storedPassword) {
                await AsyncStorage.setItem('username', inputUsername);
                await AsyncStorage.setItem('password', inputPassword);
                await AsyncStorage.setItem('isLoggedIn', 'true');
                setUsername(inputUsername);
                setPassword(inputPassword);
                setIsLoggedIn(true);
                startInactivityTimer();
            } else {
                throw new Error('Credenciais inválidas');
            }
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('password');
        await AsyncStorage.setItem('isLoggedIn', 'false');
        setUsername(null);
        setPassword(null);
        setIsLoggedIn(false);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const enableBiometricAuth = async () => {
        try {
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (!isEnrolled) {
                throw new Error('Nenhuma biometria registrada encontrada');
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Faça login usando biometria',
                fallbackLabel: 'Use a senha',
            });

            if (result.success) {
                // Recupera o username armazenado
                const storedUsername = await AsyncStorage.getItem('username');
                await AsyncStorage.setItem('isLoggedIn', 'true');
                setUsername(storedUsername); // Define o username no estado
                setIsLoggedIn(true);
                startInactivityTimer();
                return { success: true };
            } else {
                return { success: false, message: 'Falha na autenticação' };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    };


    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                resetInactivityTimer();
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, username, login, logout, enableBiometricAuth }}>
            <TouchableWithoutFeedback onPress={resetInactivityTimer}>
                {children}
            </TouchableWithoutFeedback>
        </AuthContext.Provider>
    );
};
