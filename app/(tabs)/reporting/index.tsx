import React from 'react';
import {
    View,
    StyleSheet, Button,
} from 'react-native';
import {themeColors} from "@/constants/theme-colors";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/models/ProjectRouteParams";

type ListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ReportingScreen = () => {
    const navigation = useNavigation<ListScreenNavigationProp>();


    return (
        <View style={styles.container}>
            <View style={styles.listContainer}>
                <Button
                    title="Day Report"
                    color={themeColors.primary} // Apply primary color to buttons
                    onPress={() => navigation.navigate('OneDayReport')}
                />
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themeColors.background, // Use theme background color
    },
    listContainer: {
        padding: 16,
    },
});


export default ReportingScreen;