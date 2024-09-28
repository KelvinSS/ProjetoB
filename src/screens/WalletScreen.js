import { useState, useContext, useEffect } from "react";
import { Alert, View } from "react-native";
import { ExpenseContext } from '../context/ExpenseContext';
import { COLOR } from "../theme/Theme";
import RText from '../components/RText';
import Dropdown from "../components/Dropdown";
import InputStyle from "../components/FormInput";
import MoneyInput from "../components/MoneyInput";
import JadeButton from "../components/JadeButton";
import ScreenWrapper from "../components/ScreenWrapper";
import PushNotification from "react-native-push-notification";
import { formatCurrency } from "../utils/formatCurrency";

export default function WalletScreen({ navigation }) {
    const {
        walletBalance,
        updateWalletBalance,
        updatePaymentDay,
        updateAdvancePaymentDay,
        advancePaymentDay,
        paymentDay
    } = useContext(ExpenseContext);

    const [paymentPeriod, setPaymentPeriod] = useState('CLT');
    const [saldo, setSaldo] = useState('');
    const [operation, setOperation] = useState('add');

    const [paymentDayInput, setPaymentDayInput] = useState(paymentDay ? paymentDay.toString() : '1');
    const [advancePaymentDayInput, setAdvancePaymentDayInput] = useState(advancePaymentDay ? advancePaymentDay.toString() : '');

    const [initialWalletBalance, setInitialWalletBalance] = useState(walletBalance);
    const [initialPaymentDay, setInitialPaymentDay] = useState(paymentDay);
    const [initialAdvancePaymentDay, setInitialAdvancePaymentDay] = useState(advancePaymentDay);

    useEffect(() => {
        setInitialWalletBalance(walletBalance);
        setInitialPaymentDay(paymentDay);
        setInitialAdvancePaymentDay(advancePaymentDay);
    }, [walletBalance, paymentDay, advancePaymentDay]);

    const handleSave = () => {
        let updatedFields = [];

        // Valida se os dias de pagamento e do vale estão entre 1 e 31
        const paymentDayNumber = parseInt(paymentDayInput, 10);
        const advancePaymentDayNumber = advancePaymentDayInput ? parseInt(advancePaymentDayInput, 10) : null;

        if (paymentDayNumber < 1 || paymentDayNumber > 31) {
            Alert.alert('Erro', 'O dia de pagamento deve estar entre 1 e 31.');
            return;
        }

        if (advancePaymentDayNumber !== null && (advancePaymentDayNumber < 1 || advancePaymentDayNumber > 31)) {
            Alert.alert('Erro', 'O dia do vale deve estar entre 1 e 31.');
            return;
        }

        // Verifica e atualiza o saldo
        if (saldo) {
            const numericValue = parseFloat(saldo.replace(/[^\d,]/g, '').replace(',', '.'));

            if (isNaN(numericValue)) {
                Alert.alert('Erro', 'Insira um valor válido.');
                return;
            }

            if (operation === 'remove' && walletBalance < numericValue) {
                Alert.alert('Erro', 'Saldo insuficiente para remover esse valor.');
                return;
            }

            const updatedBalance = operation === 'add'
                ? walletBalance + numericValue
                : walletBalance - numericValue;

            if (updatedBalance !== initialWalletBalance) {
                updateWalletBalance(updatedBalance);
                updatedFields.push(`Saldo da carteira foi ${operation === 'add' ? 'adicionado' : 'removido'} ${formatCurrency(numericValue)}`);
            }
        }

        // Verifica e atualiza o dia de pagamento
        if (paymentDayNumber !== initialPaymentDay) {
            updatePaymentDay(paymentDayNumber);
            updatedFields.push('Dia do pagamento atualizado');
        }

        // Verifica e atualiza o dia do vale
        if (advancePaymentDayNumber !== null && advancePaymentDayNumber !== initialAdvancePaymentDay) {
            updateAdvancePaymentDay(advancePaymentDayNumber);
            updatedFields.push('Dia do vale atualizado');
        }

        if (!advancePaymentDayInput && initialAdvancePaymentDay !== null) {
            updateAdvancePaymentDay(null);
            updatedFields.push('Dia do vale removido');
        }

        // Mostra o alerta com as alterações
        if (updatedFields.length > 0) {
            Alert.alert('Atualizações', `As seguintes alterações foram feitas: ${'\n\n' + updatedFields.join('\n')}.`);
        } else {
            Alert.alert('Nenhuma alteração', 'Ué, tu nem mudou nada doido!');
        }

        navigation.goBack();
    };

    const schedulePaymentNotification = (paymentDay) => {
        const now = new Date()
        const currentMonth = now.getMonth();
        const year = now.getFullYear()

        let paymentDate = new Date(year, currentMonth, paymentDay)

        if (paymentDate <= now) {
            paymentDate = new Date(year, currentMonth + 1, paymentDate)
        }

        PushNotification.localNotificationSchedule({
            message: 'Recebeu hoje ne? Que tal adicionar isso ao nosso app!',
            date: paymentDate,
            allowWhileIdle: true,
        })

        Alert.alert('Notificação agendada', `Notificação para o dia ${paymentDay} foi agendada.`);
    };

    return (
        <ScreenWrapper>
            <View>
                <Dropdown
                    selectedValue={paymentPeriod}
                    onValueChange={(itemValue) => setPaymentPeriod(itemValue)}
                    type={'paymentPeriod'}
                    title={'Periodo de Pagamento'}
                />

                {paymentPeriod === 'CLT' ? (
                    <View style={styles.inputRow}>
                        <InputStyle
                            value={paymentDayInput}
                            onChangeText={setPaymentDayInput}
                            title={'Dia do Pagamento'}
                            width="48%"
                            keyboardType={'numeric'}
                        />
                        <InputStyle
                            value={advancePaymentDayInput}
                            onChangeText={setAdvancePaymentDayInput}
                            title={'Dia do Vale'}
                            width="48%"
                            keyboardType={'numeric'}
                        />
                    </View>
                ) : (
                    <InputStyle
                        value={paymentDayInput}
                        onChangeText={setPaymentDayInput}
                        title={'Dia do Pagamento'}
                    />
                )}

                <View>
                    <Dropdown
                        selectedValue={operation}
                        onValueChange={setOperation}
                        type={'walletBalance'}
                    />
                    <MoneyInput
                        value={saldo}
                        onChangeText={setSaldo}
                    />
                </View>
            </View>

            <View>
                <View style={styles.balanceContainer}>
                    <RText style={styles.text}>
                        Saldo da carteira
                    </RText>
                    <RText
                        style={[
                            styles.text,
                            { color: walletBalance >= 100 ? COLOR.Jade : walletBalance >= 1 ? COLOR.Gold1 : COLOR.Red }
                        ]}
                    >
                        {formatCurrency(walletBalance)}
                    </RText>
                </View>

                <JadeButton title={'Salvar'} onPress={handleSave} />
            </View>
        </ScreenWrapper>
    );
}

const styles = {
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    balanceContainer: {
        backgroundColor: COLOR.White,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
};
