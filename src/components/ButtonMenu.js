import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLOR } from '../theme/Theme';

const ButtonMenu = ({ onPress, title, style, textStyle, disabled = false }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.button, style, disabled && styles.disabledButton]}
            disabled={disabled}
        >
            <Text style={[styles.buttonText, textStyle, disabled && styles.disabledButtonText]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLOR.White,
        flex: 1,
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 0,
        marginLeft: 0,
    },
    buttonText: {
        color: COLOR.Jade,
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    disabledButton: {
        borderColor: COLOR.Black,
    },
    disabledButtonText: {
        color: COLOR.Grey,
    },
});

export default ButtonMenu;
