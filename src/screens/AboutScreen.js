import React, { useState } from "react";
import * as Animatable from 'react-native-animatable';
import { ScrollView, View, StyleSheet, TouchableOpacity } from "react-native";
import RText from "../components/RText";
import ZenithName from "../components/ZenithName";
import ScreenWrapper from "../components/ScreenWrapper";
import { COLOR, FONTE } from "../theme/Theme";

export default function AboutScreen() {
    const [showText, setShowText] = useState(false);

    const toggleText = () => {
        setShowText(!showText);
    };

    return (
        <ScreenWrapper>
            <ZenithName showVersion/>
            <ScrollView>
                <View style={styles.contentContainer}>
                    <RText style={styles.headerText}>Sobre o Zenith</RText>
                    <RText style={styles.bodyText}>
                        O <RText style={styles.highlight}>Zenith</RText> é um aplicativo inovador que transforma o jeito de cuidar das suas finanças pessoais!
                        Com uma interface intuitiva e recursos poderosos, ele permite que você registre seus gastos diários, mensais e anuais,
                        proporcionando uma visão clara e detalhada das suas despesas.
                    </RText>
                    <RText style={styles.bodyText}>
                        <RText style={styles.highlight}>Funcionalidades Principais:</RText>
                    </RText>
                    <RText style={styles.listItem}>
                        • <RText style={styles.highlight}>Registro de Gastos:</RText> Adicione suas despesas diárias de forma rápida e fácil, incluindo descrição, valor e local.
                        Organize tudo com praticidade, com a lista separada por dia, mês e ano.
                    </RText>
                    <RText style={styles.listItem}>
                        • <RText style={styles.highlight}>Gastos Recorrentes:</RText> Esqueça as surpresas! Configure despesas recorrentes e deixe o Zenith cuidar do resto.
                    </RText>
                    <RText style={styles.listItem}>
                        • <RText style={styles.highlight}>Controle de Saldo:</RText> Mantenha o controle do seu saldo em tempo real. O Zenith ajusta automaticamente o saldo da sua carteira.
                    </RText>
                    <RText style={styles.bodyText}>
                        Este app foi criado para ser uma ferramenta pessoal, pensada para atender às suas necessidades financeiras.
                        Embora eu o tenha desenvolvido para uso próprio, espero que ele seja útil para você também!
                        O Zenith está sempre em evolução, com muitas atualizações a caminho. Fico animado em receber seu feedback!
                    </RText>
                    <RText style={styles.bodyText}>
                        Com o <RText style={styles.highlight}>Zenith</RText>, você tem um aliado na palma da sua mão para gerenciar suas finanças com eficiência e um toque de diversão!
                    </RText>
                </View>

                <View style={styles.heartContainer}>
                    {showText &&
                        <View>
                            <RText style={styles.bodyText}>
                                Ponha o coração em tudo o que faz, e verá a vida florescer em cada detalhe.
                            </RText>
                            <RText style={styles.bodyText}>
                                <RText style={styles.bodyText}>Agradeço aos amigos:</RText>
                                {'\n'}Leonardo Pires
                                {'\n'}Luana Silva
                                {'\n'}Eloise Silvino

                                {'\n'}{'\n'}Por me ajudarem a testar o Zenith.
                            </RText>
                        </View>
                    }
                    <TouchableOpacity onPress={toggleText}>
                        <Animatable.Text
                            animation="pulse"
                            iterationCount="infinite"
                            style={styles.heart}
                        >
                            ❤️
                        </Animatable.Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        fontFamily: FONTE.Bold,
        fontSize: 24,
        marginBottom: 20,
        color: COLOR.Jade,
        textAlign: 'center',
    },
    bodyText: {
        fontFamily: FONTE.Regular,
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'justify',
        marginBottom: 20,
        color: COLOR.Black,
    },
    highlight: {
        fontFamily: FONTE.Bold,
        color: COLOR.Jade,
    },
    listItem: {
        fontFamily: FONTE.Regular,
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 10,
        color: COLOR.Black,
        textAlign: 'left',
    },
    heartContainer: {
        alignItems: 'center',
        marginTop: 30,
    },
    heart: {
        fontSize: 20,
        color: COLOR.Red,
        marginTop: 0,
    },
});
