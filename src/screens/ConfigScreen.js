import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenWrapper from '../components/ScreenWrapper';
import ButtonK from '../components/ButtonK';
import InputStyle from '../components/InputStyle';
import ClearStorageButton from '../components/ClearStorageButton';

export default function ConfigScreen({ navigation }) {
    const { username, login } = useContext(AuthContext);

    const [newUsername, setNewUsername] = useState(username || '');
    const [newPassword, setNewPassword] = useState('');

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
                <ButtonK onPress={handleUpdateCredentials} title="Atualizar Usuário" />
                <ClearStorageButton />
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
