import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RText from '../components/RText';
import InputStyle from '../components/FormInput';
import JadeButton from '../components/JadeButton';
import ScreenWrapper from '../components/ScreenWrapper';
import ClearStorageButton from '../components/ClearStorageButton';
import RestoreBackupButton from '../components/RestoreBackupButton';
import { COLOR } from '../theme/Theme';

export default function ConfigScreen({ navigation }) {
    const { username, login } = useContext(AuthContext);

    const [newUsername, setNewUsername] = useState(username || '');
    const [newPassword, setNewPassword] = useState('');
    const [estouVendo, setEstouVendo] = useState(false);
    const [showBackupOptions, setShowBackupOptions] = useState(false);

    const handleUpdateCredentials = async () => {
        if (newUsername && newPassword) {
            try {
                await AsyncStorage.setItem('registeredUsername', newUsername);
                await AsyncStorage.setItem('registeredPassword', newPassword);
                await AsyncStorage.setItem('adminDisabled', 'true'); // Desativa o login com Admin
                Alert.alert('Sucesso', 'Usuário e senha atualizados com sucesso');
                login(newUsername, newPassword);
            } catch (error) {
                console.error('Erro ao atualizar credenciais:', error);
            }
        } else {
            Alert.alert('Erro', 'Por favor, preencha ambos os campos de usuário e senha.');
        }
    };

    const handleVisao = () => {
        setEstouVendo(!estouVendo);
    };

    const toggleBackupOptions = () => {
        setShowBackupOptions(!showBackupOptions);
    };

    return (
        <ScreenWrapper>
            <View>
                <RText style={styles.title}>Mudar Nome de Usuário</RText>
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

                <JadeButton onPress={handleUpdateCredentials} title="Atualizar Usuário" />
            </View>


            <View style={styles.footer}>
                <View>
                    <TouchableOpacity onPress={toggleBackupOptions} style={styles.accordionHeader}>
                        <RText style={styles.accordionText}>BACKUP E RESTAURAÇÃO</RText>
                    </TouchableOpacity>
                    {showBackupOptions && (
                        <View style={styles.backupSection}>
                            <RestoreBackupButton />
                        </View>
                    )}
                </View>

                <JadeButton
                    style={{ marginBottom: 10, marginTop: 10, backgroundColor: COLOR.White, borderWidth: 1 }}
                    onPress={() => navigation.navigate('AboutScreen')}
                    title={'Sobre o Zenith'}
                    textStyle={{ color: COLOR.Jade }}
                />

                <JadeButton
                    style={{ backgroundColor: COLOR.Red }}
                    onPress={handleVisao}
                    title={'Apagar tudo'}
                />
                {estouVendo && <ClearStorageButton />}
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
    accordionHeader: {
        backgroundColor: COLOR.White,
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        borderWidth: 1,
    },
    accordionText: {
        color: COLOR.Jade,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    backupSection: {
        padding: 10,
        backgroundColor: COLOR.Grey,
        borderRadius: 5,
        marginTop: 10,
    },
    footer: {
        marginTop: 10,
    },
});
