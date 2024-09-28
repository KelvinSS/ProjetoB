import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { COLOR } from '../theme/Theme';
import Icon from 'react-native-vector-icons/Ionicons';
import RText from './RText';

const JadeButton = ({ onPress, title, style, textStyle, icon }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            <View style={{ flexDirection: 'row' }}>
                {icon && (
                    <Icon
                        name='add-circle-outline'
                        size={20}
                        color={COLOR.White}
                        style={{ marginRight: 5 }}
                    />
                )}
                <RText style={[styles.buttonText, textStyle]}>
                    {title}
                </RText>
            </View>
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
        textTransform: 'uppercase',
    },
});

export default JadeButton;
