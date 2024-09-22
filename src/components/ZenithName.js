import { Text, View } from "react-native";
import { COLOR, FONTE } from "../theme/Theme";


export default function ZenithName() {
    return (
        <View>
            <Text style={styles.textContainer}>
                <Text style={styles.textColor}>Z</Text>enith
            </Text>
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
    },
};