import React, { useEffect, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { ExpenseContext } from '../context/ExpenseContext';
import { format } from 'date-fns';
import { AuthContext } from '../context/authContext';

const getBackupDirectoryPath = () => `${RNFS.ExternalDirectoryPath}/Zenith`;

const getBackupFileName = () => {
    const dateString = format(new Date(), 'yyyy-MM-dd');
    return `backup_${dateString}.json`;
};

const removeOldBackups = async (backupDirectoryPath) => {
    try {
        const files = await RNFS.readDir(backupDirectoryPath);

        const backupFiles = files.filter(file => file.name.startsWith('backup_')).sort((a, b) => {
            return a.mtime - b.mtime;
        });

        if (backupFiles.length > 7) {
            const filesToRemove = backupFiles.slice(0, backupFiles.length - 7);
            for (const file of filesToRemove) {
                await RNFS.unlink(file.path);
                console.log(`Backup removido: ${file.name}`);
            }
        }
    } catch (error) {
        console.error('Erro ao remover backups antigos:', error);
    }
};

const BackupManager = () => {
    const { expenses, walletBalance, paymentDay, advancePaymentDay } = useContext(ExpenseContext);
    const { isLoggedIn } = useContext(AuthContext);
    const [backupScheduled, setBackupScheduled] = useState(false);

    useEffect(() => {
        if (!isLoggedIn || backupScheduled) return;

        setBackupScheduled(true);

        const createBackup = async () => {
            try {
                const backupDirectoryPath = getBackupDirectoryPath();
                const backupFilePath = `${backupDirectoryPath}/${getBackupFileName()}`;

                const directoryExists = await RNFS.exists(backupDirectoryPath);
                if (!directoryExists) {
                    await RNFS.mkdir(backupDirectoryPath);
                }

                const backupExists = await RNFS.exists(backupFilePath);
                if (backupExists) {
                    console.log(`Backup de hoje já existe: ${backupFilePath}`);
                    return;
                }

                const backupData = {
                    expenses,
                    walletBalance,
                    paymentDay,
                    advancePaymentDay,
                    timestamp: new Date().toISOString(),
                };

                await RNFS.writeFile(backupFilePath, JSON.stringify(backupData), 'utf8');
                console.log(`Backup criado em: ${backupFilePath}`);

                await removeOldBackups(backupDirectoryPath);
            } catch (error) {
                console.error('Erro ao criar backup:', error);
            }
        };

        const backupTimeout = setTimeout(() => {
            createBackup();
        }, 5000);

        return () => clearTimeout(backupTimeout);

    }, [isLoggedIn, expenses, walletBalance, paymentDay, advancePaymentDay]);

    return null;
};

export const restoreFromBackup = async (backupPath) => {
    try {
        const backupContent = await RNFS.readFile(backupPath);

        const parsedData = JSON.parse(backupContent);

        if (parsedData.expenses) {
            await AsyncStorage.setItem('expenses', JSON.stringify(parsedData.expenses));
        }

        if (parsedData.walletBalance) {
            await AsyncStorage.setItem('walletBalance', parsedData.walletBalance.toString());
        }

        if (parsedData.paymentDay) {
            await AsyncStorage.setItem('paymentDay', parsedData.paymentDay.toString());
        }

        if (parsedData.advancePaymentDay) {
            await AsyncStorage.setItem('advancePaymentDay', parsedData.advancePaymentDay.toString());
        }

        return true;
    } catch (error) {
        console.error('Erro ao restaurar o backup:', error);
        return false;
    }
};

export const getAvailableBackups = async () => {
    try {
        const backupDir = getBackupDirectoryPath();
        const backupFiles = await RNFS.readDir(backupDir);

        const backupFilesList = backupFiles
            .filter(file => file.name.startsWith('backup_'))
            .sort((a, b) => b.mtime - a.mtime);

        return backupFilesList;
    } catch (error) {
        console.error('Erro ao obter backups disponíveis:', error);
        return [];
    }
};

export default BackupManager;
