import {StyleSheet} from "react-native";
import {themeColors} from "@/constants/theme-colors";

export const CommonInputStyles = StyleSheet.create({
    fieldContainer: {
        margin: 4,
        marginVertical: 6
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 4,
        marginTop: 4
    },
    textInputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: themeColors.borders,
        borderRadius: 5,
        height: 40,
        minHeight: 40,
    },
});