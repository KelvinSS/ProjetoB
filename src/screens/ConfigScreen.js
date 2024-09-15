import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { ExpenseContext } from '../context/ExpenseContext';
import { AuthContext } from '../context/authContext';
import { Picker } from '@react-native-picker/picker';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaskInput, { Masks } from 'react-native-mask-input';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ScreenWrapper from '../components/ScreenWrapper';
import ClearStorageButton from '../components/ClearStorageButton';
import { COLOR } from '../theme/Theme';
import ButtonK from '../components/ButtonK';
import InputStyle from '../components/InputStyle';
import ButtonMenu from '../components/ButtonMenu';
import InputReal from '../components/InputReal';

export default function ConfigScreen({ navigation }) {
    const { walletBalance, updateWalletBalance, updatePaymentDay } = useContext(ExpenseContext);
    const { username, password, login } = useContext(AuthContext);

    const [saldo, setSaldo] = useState('');
    const [soma, setSoma] = useState('add');
    const [selectedPaymentDay, setSelectedPaymentDay] = useState(1);

    const [newUsername, setNewUsername] = useState(username || '');
    const [newPassword, setNewPassword] = useState('');
    const [viewOn, setViewOn] = useState(true);

    useEffect(() => {
        const loadPaymentDay = async () => {
            try {
                const savedPaymentDay = await AsyncStorage.getItem('paymentDay');
                if (savedPaymentDay !== null) {
                    setSelectedPaymentDay(parseInt(savedPaymentDay, 10));
                };
            } catch (error) {
                cnsole.error('Erro ao carregar o dia de pagamento:', error);
            };
        };

        loadPaymentDay();
    }, []);

    const handleBalanceUpdate = async () => {
        const numericValue = parseFloat(saldo.replace(/[^\d,]/g, '').replace(',', '.'));

        if (soma === 'add') {
            if (!isNaN(numericValue)) {
                updateWalletBalance(walletBalance + numericValue);
                navigation.goBack();
                alert('Foi adicionado em sua carteira: ' + numericValue.toFixed(2));
            } else {
                updateWalletBalance(walletBalance + 0);
                navigation.goBack();
            };
        } else {
            if (!isNaN(numericValue)) {
                updateWalletBalance(walletBalance - numericValue);
                navigation.goBack();
                alert('Foi removido em sua carteira: ' + numericValue.toFixed(2));
            } else {
                updateWalletBalance(walletBalance - 0);
                navigation.goBack();
            };
        };
    };

    const handleUpdatePaymentDay = async () => {
        try {
            await AsyncStorage.setItem('paymentDay', selectedPaymentDay.toString());
            updatePaymentDay(selectedPaymentDay);
            await scheduleNotification(); // Agendar notificação após atualizar o dia de pagamento
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao salvar o dia de pagamento:', error);
        };
    };

    const getSecondsUntilDate = ({ day, month, hour, minute }) => {
        const now = new Date();
        let date = new Date(now.getFullYear(), month - 1, day, hour, minute, 0);
        let diff = date.getTime() - now.getTime();
        //console.log("seconds untill", diff / 1000);
        if (diff > 0) {
            return Math.floor(diff / 1000);
        } else {
            date = new Date(now.getFullYear() + 1, month, day, hour, minute);
            diff = date.getTime() - now.getTime();
            return Math.floor(diff / 1000);
        };
    };

    const scheduleNotification = async () => {
        try {
            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Lembrete de Pagamento",
                    body: `Lembre-se de pagar sua fatura hoje!`,
                    data: { screen: 'CreditExpenses' },
                },
                trigger: {
                    seconds: getSecondsUntilDate({
                        day: 6,
                        month: 9,
                        hour: 18,
                        minute: 50,
                    }),
                    repeats: false,
                },
            });

            console.log('Notification scheduled with ID:', notificationId);
        } catch (error) {
            console.error('Erro ao agendar a notificação:', error.message);
        };
    };

    const handleUpdateCredentials = async () => {
        if (newUsername && newPassword) {
            try {
                await AsyncStorage.setItem('registeredUsername', newUsername);
                await AsyncStorage.setItem('registeredPassword', newPassword);
                Alert.alert('Sucesso', 'Usuário e senha atualizados com sucesso');
                login(newUsername, newPassword); // Atualiza o login automaticamente
            } catch (error) {
                console.error('Erro ao atualizar credenciais:', error);
            }
        } else {
            Alert.alert('Erro', 'Por favor, preencha ambos os campos de usuário e senha.');
        }
    };

    const handleViewPassword = () => {
        setViewOn(!viewOn);
    };

    return (
        <ScreenWrapper>
            <Text>Saldo da carteira</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Picker
                    selectedValue={soma}
                    onValueChange={setSoma}
                    style={{
                        backgroundColor: COLOR.Jade,
                        color: COLOR.White,
                        flex: 1,
                        height: 40
                    }}>
                    <Picker.Item label={'Adicionar Saldo'} value={'add'} />
                    <Picker.Item label={'Remover Saldo'} value={'remove'} />
                </Picker>
                <InputReal
                    value={saldo}
                    onChangeText={setSaldo}
                    style={{
                        width: '55%',
                        marginLeft: 10,
                        height: 50,
                    }}
                />
                {/* <MaskInput
                    value={saldo}
                    onChangeText={setSaldo}
                    keyboardType='decimal-pad'
                    placeholder='R$ 0.00'
                    style={{
                        width: '55%',
                        marginLeft: 10,
                        height: 53,
                        borderColor: '#ccc',
                        borderWidth: 1,
                        borderRadius: 5,
                        paddingHorizontal: 10,
                        fontSize: 16,
                        marginBottom: 10,
                    }}
                    mask={Masks.BRL_CURRENCY}
                /> */}
            </View>
            <ButtonK onPress={handleBalanceUpdate} title="Atualizar Saldo" />

            <View style={styles.pickerContainer}>
                <Text>Cartão de crédito</Text>
                <Text>Selecionar vencimento da Fatura</Text>
                <Picker
                    selectedValue={selectedPaymentDay}
                    onValueChange={(itemValue) => setSelectedPaymentDay(itemValue)}
                    style={styles.picker}
                >
                    {Array.from({ length: 31 }, (_, i) => (
                        <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
                    ))}
                </Picker>
            </View>

            <ButtonK onPress={handleUpdatePaymentDay} title="Salvar" />

            <View style={styles.inputContainer}>
                <Text>Mudar Nome de Usuário</Text>
                <InputStyle
                    value={newUsername}
                    onChangeText={setNewUsername}
                    placeholder={username}
                />

                <Text>Mudar Senha</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <InputStyle
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder={password}
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

                <View style={{ paddingTop: 20 }}>
                    <ButtonK onPress={handleUpdateCredentials} title="Atualizar Usuário" />
                </View>
            </View>
            <View style={{ bottom: -90 }}>
                <ClearStorageButton />
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        marginBottom: 10,
    },
    inputPassword: {
        flex: 1,
        padding: 10,
        marginBottom: 0,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    pickerContainer: {
        marginBottom: 20,
    },
    picker: {
        height: 50,
        backgroundColor: COLOR.Jade,
        color: COLOR.White
    },
    inputContainer: {
        marginTop: 20,
    }
});
