import React, { useState, useContext, useEffect } from 'react';
import { View, Alert, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/authContext';
import InputStyle from '../components/FormInput';
import JadeButton from '../components/JadeButton';
import ZenithName from '../components/ZenithName';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLOR } from '../theme/Theme';

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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <ZenithName />
            </View>
            <View style={styles.formContainer}>
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
                <JadeButton title={'Login'} onPress={handleLogin} style={styles.button} />

                <View style={styles.biometricButtonContainer}>
                    <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricAuth}>
                        <View>
                            <Icon name="fingerprint" size={40} color={COLOR.White} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 10,
    },
    formContainer: {
        // 
    },
    button: {
        marginBottom: 10,
    },
    biometricButtonContainer: {
        alignItems: 'center',
    },
    biometricButton: {
        padding: 10,
        borderRadius: 50,
        backgroundColor: COLOR.Jade,
        alignItems: 'center',
        justifyContent: 'c1enter',
        width: 70,
    },
});

export default LoginScreen;
