import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { COLOR } from '../theme/Theme';
import RText from './RText';

const JadeButton  = ({ onPress, title, style, textStyle }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            <RText style={[styles.buttonText, textStyle]}>{title}</RText>
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
