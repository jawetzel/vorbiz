import {Button, StyleSheet, View} from "react-native";
import React from "react";
import {themeColors} from "@/components/ui/theme-colors";


type SaveButtonProps = {
    handle: () => void,
    text: string
};
const SaveButton: React.FC<SaveButtonProps> = ({handle, text= "Save"}) => {
    return <View style={styles.buttonContainer}>
        <Button title={text} onPress={handle} color={themeColors.success} />
    </View>

}

const styles = StyleSheet.create({
    buttonContainer: {
        marginVertical: 4
    },
});

export default SaveButton;