import React from 'react';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { COLOR } from '../theme/Theme';
import RText from './RText';

const { width: screenWidth } = Dimensions.get('window');

const ButtonMenu = ({ onPress, title, style, textStyle, disabled = false }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.button, style, disabled && styles.disabledButton]}
            disabled={disabled}
        >
            <RText style={[styles.buttonText, textStyle, disabled && styles.disabledButtonText]}>
                {title}
            </RText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLOR.White,
        width: screenWidth * 0.9,
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
        textAlign: 'center',
    },
    disabledButton: {
        borderColor: COLOR.Black,
    },
    disabledButtonText: {
        color: COLOR.Grey,
    },
});

export default ButtonMenu;
