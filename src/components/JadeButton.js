import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLOR } from '../theme/Theme';

const JadeButton  = ({ onPress, title, style, textStyle }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderWidth: 0,
        backgroundColor: COLOR.Jade,
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',

    },
    buttonText: {
        color: COLOR.White,
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
});

export default JadeButton ;
