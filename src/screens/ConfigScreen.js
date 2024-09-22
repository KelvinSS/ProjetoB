import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/authContext';
import InputStyle from '../components/FormInput';
import JadeButton from '../components/JadeButton';
import ScreenWrapper from '../components/ScreenWrapper';
import ClearStorageButton from '../components/ClearStorageButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConfigScreen({ navigation }) {
    const { username, login } = useContext(AuthContext);

    const [newUsername, setNewUsername] = useState(username || '');
    const [newPassword, setNewPassword] = useState('');
    const [estouVendo, setEstouVendo] = useState('');

    const handleUpdateCredentials = async () => {
        if (newUsername && newPassword) {
            try {
                await AsyncStorage.setItem('registeredUsername', newUsername);
                await AsyncStorage.setItem('registeredPassword', newPassword);
                Alert.alert('Sucesso', 'Usuário e senha atualizados com sucesso');
                login(newUsername, newPassword);
            } catch (error) {
                console.error('Erro ao atualizar credenciais:', error);
            }
        } else {
            Alert.alert('Erro', 'Por favor, preencha ambos os campos de usuário e senha.');
        }
    };

    const handleVisao = async () => {
        setEstouVendo(true);
    };

    return (
        <ScreenWrapper>
            <View>
                <Text style={styles.title}>Mudar Nome de Usuário</Text>
                <InputStyle
                    value={newUsername}
                    onChangeText={setNewUsername}
                    placeholder={username}
                    title="Nome de Usuário"
                />
                <InputStyle
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="*****"
                    secureTextEntry={true}
                    title="Senha de Usuário"
                />
            </View>

            <View>
                <JadeButton onPress={handleUpdateCredentials} title="Atualizar Usuário" />
                <JadeButton
                    style={{ marginTop: 20 }}
                    onPress={handleVisao}
                    title={'Open the oblívio'}
                />
                {estouVendo && (
                    <ClearStorageButton />
                )}
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    title: {
        padding: 10,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
