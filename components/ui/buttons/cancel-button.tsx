import {Button, StyleSheet, View} from "react-native";
import React from "react";
import {themeColors} from "@/constants/theme-colors";


type CancelButtonProps = {
    handle: () => void
};
const CancelButton: React.FC<CancelButtonProps> = ({handle}) => {
    return <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={handle} color={themeColors.info} />
    </View>

}

const styles = StyleSheet.create({
    buttonContainer: {
        marginVertical: 4
    },
});

export default CancelButton;