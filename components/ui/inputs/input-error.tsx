import {StyleSheet, Text} from "react-native";
import React from "react";
import {themeColors} from "@/components/ui/theme-colors";


const InputError = ({error}: {error:  string | undefined}) => {
    return <> {error ? <Text style={styles.error}>{error}</Text> : null} </>
}
const styles = StyleSheet.create({
    error: {
        color: themeColors.dangerActive,
        marginTop: 4,
        fontSize: 12,
    },
});

export default InputError;