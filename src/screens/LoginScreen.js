import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { AuthContext } from '../context/authContext';
import ClearStorageButton from '../components/ClearStorageButton';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            {!isLoggedIn ? (
                <>
                    <Text style={{
                        justifyContent: 'center',
                        position: 'absolute',
                        alignSelf: 'center',
                        fontWeight: 'bold',
                        top: '20%',
                        fontSize: 40,
                        marginBottom: 0,
                    }}>
                        Zenith
                    </Text>

                    <View style={{ width: '100%' }}>
                        <TextInput
                            placeholder="Nome de usuário"
                            value={inputUsername}
                            onChangeText={setInputUsername}
                            style={{ borderWidth: 1, marginBottom: 20, padding: 10 }}
                        />

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput
                                placeholder="Senha"
                                value={inputPassword}
                                onChangeText={setInputPassword}
                                secureTextEntry={viewOn}
                                style={{
                                    flex: 1,
                                    padding: 10,
                                    borderWidth: 1,
                                    marginBottom: 0,
                                }}
                            />

                            <TouchableOpacity
                                onPress={handleViewPassword}
                                style={{
                                    backgroundColor: '#ccc',
                                    width: 50,
                                    height: 40,
                                    alignItems: "center",
                                    justifyContent: 'center',
                                    borderRadius: 5,
                                    marginLeft: 5,
                                }}
                            >
                                <Text>Ver</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginTop: 20 }}>
                            <Button title="Login" onPress={handleLogin} />
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Button title="Login com biometria" onPress={handleBiometricAuth} />
                        </View>
                    </View>

                </>
            ) : null}
        </View>
    );
};

export default LoginScreen;
