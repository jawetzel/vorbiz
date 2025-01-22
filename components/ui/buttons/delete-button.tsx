import {Button, StyleSheet, View} from "react-native";
import React from "react";
import {themeColors} from "@/constants/theme-colors";


type DeleteButtonProps = {
    handle: () => void
};
const DeleteButton: React.FC<DeleteButtonProps> = ({handle}) => {
    return <View style={styles.buttonContainer}>
        <Button title="Delete" onPress={handle} color={themeColors.danger} />
    </View>

}

const styles = StyleSheet.create({
    buttonContainer: {
        marginVertical: 4
    },
});

export default DeleteButton;