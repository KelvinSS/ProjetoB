import React from 'react';
import { View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ClearStorageButton = () => {
    const clearAsyncStorage = async () => {
        try {
            await AsyncStorage.clear();
            Alert.alert('AsyncStorage limpo com sucesso!');
        } catch (error) {
            Alert.alert('Erro ao limpar o AsyncStorage:', error.message);
        }
    };

    return (
        <View>
            <Button title="Limpar AsyncStorage" onPress={clearAsyncStorage} />
        </View>
    );
};

export default ClearStorageButton;
