import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { AuthContext } from '../context/authContext';

import ButtonK from '../components/ButtonK';
import InputStyle from '../components/InputStyle';
import ButtonMenu from '../components/ButtonMenu';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLOR } from '../theme/Theme';

const LoginScreen = ({ navigation }) => {
    const [inputUsername, setInputUsername] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [viewOn, setViewOn] = useState(true);
    const { login, enableBiometricAuth, isLoggedIn } = useContext(AuthContext);

    useEffect(() => {
        if (isLoggedIn) {
            navigation.navigate('Home');
        }
    }, [isLoggedIn, navigation]);

    const handleLogin = async () => {
        try {
            await login(inputUsername, inputPassword);
            Alert.alert('Sucesso', 'Bem-vindo ' + inputUsername);
        } catch (error) {
            Alert.alert('', error.message);
        }
    };

    const handleBiometricAuth = async () => {
        const result = await enableBiometricAuth();
        if (result.success) {
            Alert.alert('Sucesso', 'Bem-vindo ' + inputUsername);
        } else {
            Alert.alert('Erro', result.message || 'Autenticação biométrica falhou');
        }
    };

    const handleViewPassword = () => {
        setViewOn(!viewOn);
    };

    return (
        <ScreenWrapper>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {!isLoggedIn ? (
                    <>
                        <Text style={{
                            justifyContent: 'center',
                            alignSelf: 'center',
                            fontWeight: 'bold',
                            fontSize: 40,
                            marginBottom: 50,
                        }}>
                            Zenith
                        </Text>

                        <View style={{ width: '100%' }}>
                            <InputStyle
                                value={inputUsername}
                                onChangeText={setInputUsername}
                                placeholder={'Nome de usuário'}
                            />

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <InputStyle
                                    value={inputPassword}
                                    onChangeText={setInputPassword}
                                    placeholder={'Senha'}
                                    secureTextEntry={viewOn}
                                    style={{ flex: 1 }}
                                />
                                <View style={{ position: 'absolute', right: 0, top: 4 }}>
                                    <ButtonMenu
                                        onPress={handleViewPassword}
                                        title={'Ver'}
                                        style={{ width: 65 }}
                                        textStyle={{ fontSize: 12 }}
                                    />
                                </View>
                            </View>

                            <View style={{ marginTop: 20 }}>
                                <ButtonK title={'Login'} onPress={handleLogin} />
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <ButtonK title={'Login com biometria'} onPress={handleBiometricAuth} />
                            </View>
                        </View>
                    </>
                ) : null}
            </View>
        </ScreenWrapper>
    );
};

export default LoginScreen;