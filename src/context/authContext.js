import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    useEffect(() => {
        const checkLogin = async () => {
            const savedUsername = await AsyncStorage.getItem('username');
            const savedPassword = await AsyncStorage.getItem('password');
            const savedLoginStatus = await AsyncStorage.getItem('isLoggedIn');

            // Verifica se já tem login salvo
            if (savedUsername && savedPassword && savedLoginStatus === 'true') {
                setUsername(savedUsername);
                setPassword(savedPassword);
                setIsLoggedIn(true);
            }
        };
        checkLogin();
    }, []);

    const login = async (inputUsername, inputPassword) => {
        const storedUsername = await AsyncStorage.getItem('registeredUsername');
        const storedPassword = await AsyncStorage.getItem('registeredPassword');

        if (!storedUsername && !storedPassword) {
            if (inputUsername === 'Admin' && inputPassword === 'Admin') {
                await AsyncStorage.setItem('registeredUsername', 'Admin');
                await AsyncStorage.setItem('registeredPassword', 'Admin');
                await AsyncStorage.setItem('username', inputUsername);
                await AsyncStorage.setItem('password', inputPassword);
                await AsyncStorage.setItem('isLoggedIn', 'true'); // Adiciona persistência de login
                setIsLoggedIn(true);
            } else {
                throw new Error('Credenciais inválidas');
            }
        } else {
            if (inputUsername === storedUsername && inputPassword === storedPassword) {
                await AsyncStorage.setItem('username', inputUsername);
                await AsyncStorage.setItem('password', inputPassword);
                await AsyncStorage.setItem('isLoggedIn', 'true'); // Adiciona persistência de login
                setUsername(inputUsername);
                setPassword(inputPassword);
                setIsLoggedIn(true);
            } else {
                throw new Error('Credenciais inválidas');
            }
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('password');
        await AsyncStorage.setItem('isLoggedIn', 'false'); // Remove o status de login
        setUsername(null);
        setPassword(null);
        setIsLoggedIn(false);
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
                await AsyncStorage.setItem('isLoggedIn', 'true'); // Marca o login bem-sucedido
                setIsLoggedIn(true);
                return { success: true };
            } else {
                return { success: false, message: 'Falha na autenticação' };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, username, login, logout, enableBiometricAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
