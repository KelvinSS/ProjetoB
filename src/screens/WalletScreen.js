import { useState, useContext } from "react";
import { Alert, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ExpenseContext } from '../context/ExpenseContext';
import { COLOR } from "../theme/Theme";
import JadeButton from "../components/JadeButton";
import Dropdown from "../components/Dropdown";
import InputStyle from "../components/FormInput";
import MoneyInput from "../components/MoneyInput";
import ScreenWrapper from "../components/ScreenWrapper";

export default function WalletScreen({ navigation }) {
    const { walletBalance, updateWalletBalance } = useContext(ExpenseContext);

    const [paymentPeriod, setPaymentPeriod] = useState('Mensal')
    const [paymentDay, setPaymentDay] = useState('')
    const [paymentDayVale, setPaymentDayVale] = useState('')
    const [saldo, setSaldo] = useState('');
    const [operation, setOperation] = useState('add');

    const handleUpdateWallet = () => {
        const numericValue = parseFloat(saldo.replace(/[^\d,]/g, '').replace(',', '.'));

        if (isNaN(numericValue)) {
            Alert.alert('Erro', 'Insira um valor válido.');
            return;
        }

        const updatedBalance = operation === 'add'
            ? walletBalance + numericValue
            : walletBalance - numericValue

        updateWalletBalance(updatedBalance);
        navigation.goBack();
        Alert.alert(
            'Carteira Atualizada',
            `Foi ${operation === 'add' ? 'adicionado' : 'removido'} da sua carteira R$ ${numericValue.toFixed(2)}`
        );
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

                {paymentPeriod === 'Mensal' ? (
                    <View>
                        <InputStyle
                            onChangeText={setPaymentDay}
                            value={paymentDay}
                            title={'Dia do Pagamento'}

                        />
                    </View>
                ) : (
                    <View>
                        <InputStyle
                            onChangeText={setPaymentDay}
                            value={paymentDay}
                            title={'Dia do Pagamento'}
                        />
                        <InputStyle
                            onChangeText={setPaymentDayVale}
                            value={paymentDayVale}
                            title={'Dia do Vale'}
                        />
                    </View>
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
                <View style={styles.ballanceContainer}>
                    <Text style={styles.text}>
                        Saldo da carteira
                    </Text>
                    <Text style={[styles.text, {
                        color:
                            walletBalance >= 100 ? COLOR.Jade
                                : walletBalance >= 1 ? COLOR.Gold1
                                    : COLOR.Red,
                    }]}>
                        R$ {walletBalance.toFixed(2)}
                    </Text>
                </View>

                <JadeButton title={'Salvar'} onPress={handleUpdateWallet} />
            </View>
        </ScreenWrapper>
    );
};

const styles = {
    ballanceContainer: {
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