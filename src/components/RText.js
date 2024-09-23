import React from 'react';
import { Text, Dimensions, StyleSheet } from 'react-native';
import { COLOR } from '../theme/Theme';

const { width } = Dimensions.get('window'); // Pega a largura da tela

const RText = ({ children, style, ...props }) => {
    const fontSize = width * 0.05; // usa 5% da largura da tela como tamanho base da fonte

    return (
        <Text style={[styles.text, { fontSize }, style]} {...props}>
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        color: COLOR.Black,
    },
});

export default RText;
