import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { COLOR, FONTE } from '../theme/Theme';
import { AuthContext } from '../context/authContext';
import InputStyle from '../components/FormInput';
import JadeButton from '../components/JadeButton';
import ScreenWrapper from '../components/ScreenWrapper';
import ZenithName from '../components/ZenithName';

const LoginScreen = ({ navigation }) => {
    const [inputUsername, setInputUsername] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const { login, enableBiometricAuth, isLoggedIn } = useContext(AuthContext);

    useEffect(() => {
        if (isLoggedIn) {
            navigation.navigate('Home');
        }
    }, [isLoggedIn, navigation]);

    const handleLogin = async () => {
        try {
            await login(inputUsername, inputPassword);
            /* Alert.alert('Sucesso', 'Bem-vindo ' + inputUsername); */
        } catch (error) {
            Alert.alert('Erro', error.message);
        }
    };

    const handleBiometricAuth = async () => {
        const result = await enableBiometricAuth();
        if (result.success) {
            /* Alert.alert('Sucesso', 'Bem-vindo ' + inputUsername); */
        } else {
            Alert.alert('Erro', result.message || 'Autenticação biométrica falhou');
        }
    };

    return (
        <ScreenWrapper>

            <View></View>

            <ZenithName />

            <View>
                <InputStyle
                    value={inputUsername}
                    onChangeText={setInputUsername}
                    placeholder={'Nome de usuário'}
                />
                <InputStyle
                    value={inputPassword}
                    onChangeText={setInputPassword}
                    placeholder={'Senha'}
                    secureTextEntry={true}
                />
                <JadeButton title={'Login'} onPress={handleLogin} style={{ marginBottom: 10 }} />
                <JadeButton title={'Login com biometria'} onPress={handleBiometricAuth} />
            </View>

            <View></View>
        </ScreenWrapper>
    );
};

export default LoginScreen;