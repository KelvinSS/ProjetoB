import { View } from "react-native";
import { COLOR, FONTE } from "../theme/Theme";
import RText from './RText';

export default function ZenithName() {
    return (
        <View>
            <RText style={styles.textContainer}>
                <RText style={styles.textColor}>Z</RText>enith
            </RText>
        </View>
    );
};

const styles = {
    textContainer: {
        fontSize: 40,
        marginBottom: 20,
        paddingTop: "20%",
        alignSelf: 'center',
        justifyContent: 'center',
        fontFamily: FONTE.Bold,
    },
    textColor: {
        color: COLOR.Jade,
        fontSize: 40,
        marginBottom: 20,
        paddingTop: "20%",
        alignSelf: 'center',
        justifyContent: 'center',
        fontFamily: FONTE.Bold,
    },
};