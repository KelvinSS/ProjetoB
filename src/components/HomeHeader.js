import React, { useContext } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLOR } from '../theme/Theme';
import { AuthContext } from '../context/authContext';

export default function HomeHeader({ navigation }) {
    const { logout } = useContext(AuthContext);

    const handleLogout = async () => {
        Alert.alert(
            'Sair',
            'Deseja realmente sair?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair',
                    onPress: async () => {
                        await logout();
                        navigation.replace('Login');
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
                <Icon
                    name={'exit-outline'}
                    size={24}
                    color={COLOR.Jade}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Config')} style={styles.headerButton}>
                <Icon
                    name={'construct-outline'}
                    size={24}
                    color={COLOR.Jade}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = {
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerButton: {
        alignSelf: 'center',
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLOR.Black,
    },
};