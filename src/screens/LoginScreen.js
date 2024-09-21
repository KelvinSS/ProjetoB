import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { AuthContext } from '../context/authContext';

import ButtonK from '../components/ButtonK';
import InputStyle from '../components/InputStyle';
import ScreenWrapper from '../components/ScreenWrapper';

import { COLOR, FONTE } from '../theme/Theme';

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

            <Text style={{
                fontSize: 40,
                marginBottom: 20,
                paddingTop: "20%",
                alignSelf: 'center',
                justifyContent: 'center',
                fontFamily: FONTE.Bold
            }}>
                <Text style={{ color: COLOR.Jade }}>Z</Text>enith
            </Text>

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
                <ButtonK title={'Login'} onPress={handleLogin} style={{ marginBottom: 10 }} />
                <ButtonK title={'Login com biometria'} onPress={handleBiometricAuth} />
            </View>

            <View></View>
        </ScreenWrapper>
    );
};

export default LoginScreen;