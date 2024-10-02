import React, { useContext, useState } from 'react';
import { View, Button, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/authContext';
import { COLOR } from '../theme/Theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ClearStorageButton = () => {
    const { logout } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const clearAsyncStorage = async () => {
        Alert.alert(
            'Apagar tudo',
            ` Deseja realmente apagar tudo?\n essa ação é permanente!\n Se sim, será necessario reiniciar o Zenith`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Apagar',
                    onPress: async () => {
                        setIsLoading(true);
                        try {
                            await AsyncStorage.clear();
                            await logout();
                            navigation.replace('Login');
                        } catch (error) {
                            console.error('Erro ao limpar AsyncStorage:', error);
                            Alert.alert('Erro', 'Não foi possível apagar os dados.');
                        } finally {
                            setIsLoading(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={{ marginTop: 10 }}>
            {isLoading ? (
                <ActivityIndicator size="large" color={COLOR.Red} />
            ) : (
                <Button
                    title="Apagar TODOS os dados"
                    onPress={clearAsyncStorage}
                    color={COLOR.Red}
                />
            )}
        </View>
    );
};

export default ClearStorageButton;
