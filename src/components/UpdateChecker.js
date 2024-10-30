import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import * as Updates from 'expo-updates';

//Componente pausado!
//Componente pausado!
//Componente pausado!

const UpdateChecker = () => {
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const checkForUpdates = async () => {
            try {
                const update = await Updates.checkForUpdateAsync();
                if (update.isAvailable) {
                    setUpdateAvailable(true);
                }
            } catch (error) {
                console.error('Erro ao verificar atualizações:', error);
            }
        };

        // Verifica ao montar o componente
        checkForUpdates();

        // Verificação periódica de atualizações a cada 30 minutos (1800000 ms)
        const interval = setInterval(() => {
            checkForUpdates();
        }, 1800000);

        return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
    }, []);

    const handleUpdate = async () => {
        setIsUpdating(true);
        try {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
        } catch (error) {
            console.error('Erro ao realizar a atualização:', error);
            Alert.alert('Erro', 'Não foi possível atualizar o aplicativo.');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        updateAvailable && (
            <View style={styles.container}>
                <Text style={styles.updateText}>Uma nova versão está disponível!</Text>
                <Button
                    title={isUpdating ? 'Atualizando...' : 'Atualizar Agora'}
                    onPress={handleUpdate}
                    disabled={isUpdating}
                />
            </View>
        )
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    updateText: {
        color: 'green',
        marginBottom: 10,
        fontWeight: 'bold',
    },
});

export default UpdateChecker;
