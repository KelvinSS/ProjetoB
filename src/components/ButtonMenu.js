import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLOR } from '../theme/Theme';

const ButtonMenu = ({ onPress, title, style, textStyle }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLOR.White,
        width: 150,
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: COLOR.Jade,
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});

export default ButtonMenu;
