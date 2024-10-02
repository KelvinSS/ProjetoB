import React, { useState, useEffect } from 'react';
import { View, Alert, ActivityIndicator, FlatList } from 'react-native';
import { restoreFromBackup, getAvailableBackups } from '../utils/BackupManager';
import JadeButton from './JadeButton';

const RestoreBackupButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [backups, setBackups] = useState([]);

    useEffect(() => {
        const fetchBackups = async () => {
            const availableBackups = await getAvailableBackups();
            setBackups(availableBackups);
        };

        fetchBackups();
    }, []);

    const handleRestore = async (backupPath) => {
        Alert.alert(
            'Restaurar Backup',
            'Deseja realmente restaurar os dados a partir deste backup? Todos os dados atuais serão sobrescritos!',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Restaurar',
                    onPress: async () => {
                        setIsLoading(true);
                        const success = await restoreFromBackup(backupPath);
                        setIsLoading(false);

                        if (success) {
                            Alert.alert('Sucesso', 'Backup restaurado reinicie o app para as mudanças serem efetivas.');
                        } else {
                            Alert.alert('Erro', 'Não foi possível restaurar o backup.');
                        }
                    },
                },
            ],
        );
    };

    return (
        <View style={{ marginTop: 10 }}>
            {isLoading ? (
                <ActivityIndicator size="large" color="blue" />
            ) : (
                <FlatList
                    data={backups}
                    keyExtractor={(item) => item.path}
                    renderItem={({ item }) => (
                        <JadeButton title={`Restaurar ${item.name}`} onPress={() => handleRestore(item.path)} style={{ marginTop: 5 }} />
                    )}
                />
            )}
        </View>
    );
};

export default RestoreBackupButton;
