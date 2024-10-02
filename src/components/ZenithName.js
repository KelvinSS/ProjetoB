import { View, StyleSheet } from "react-native";
import { COLOR, FONTE } from "../theme/Theme";
import RText from './RText';

export default function ZenithName({ showVersion = false }) {
    return (
        <View>
            <RText style={styles.textContainer}>
                <RText style={styles.highlight}>Z</RText>enith
                {showVersion && <RText style={styles.versionText}> V0.1</RText>}
            </RText>
        </View>
    );
};

const styles = StyleSheet.create({
    textContainer: {
        fontSize: 40,
        marginBottom: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        fontFamily: FONTE.Bold,
    },
    highlight: {
        color: COLOR.Jade,
        fontSize: 40,
    },
    versionText: {
        color: COLOR.Jade,
        fontSize: 20,
    },
});
