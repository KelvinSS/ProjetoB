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
                updatedFields.push(`saldo da carteira foi ${operation === 'add' ? 'adicionado' : 'removido'} R$ ${numericValue.toFixed(2)}`);
            }
        }

        // Verifica e atualiza o dia de pagamento
        if (parseInt(paymentDayInput, 10) !== initialPaymentDay) {
            updatePaymentDay(parseInt(paymentDayInput, 10));
            updatedFields.push('Dia do pagamento atualizado');
        }

        // Verifica e atualiza o dia do vale
        if (advancePaymentDayInput && parseInt(advancePaymentDayInput, 10) !== initialAdvancePaymentDay) {
            updateAdvancePaymentDay(parseInt(advancePaymentDayInput, 10));
            updatedFields.push('Dia do vale atualizado');
        }

        if (!advancePaymentDayInput && initialAdvancePaymentDay !== null) {
            updateAdvancePaymentDay(null);
            updatedFields.push('Dia do vale removido');
        }

        // Mostra o alerta com as alterações
        if (updatedFields.length > 0) {
            Alert.alert('Atualizações', `As seguintes alterações foram feitas: ${updatedFields.join(', ')}.`);
        } else {
            Alert.alert('Nenhuma alteração', 'Ué, tu nem mudou nada doido!');
        }

        navigation.goBack();
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
                        />
                        <InputStyle
                            value={advancePaymentDayInput}
                            onChangeText={setAdvancePaymentDayInput}
                            title={'Dia do Vale'}
                            width="48%"
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
                        R$ {walletBalance.toFixed(2)}
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
