import {Button, View, Text, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/models/ProjectRouteParams";
import {themeColors} from "@/constants/theme-colors";  // Import the navigation hook


type ListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
// ManageScreen component with navigation options to LocationScreen
function ManageScreen() {
    const navigation = useNavigation<ListScreenNavigationProp>();

    return (
        <View style={styles.container}>

            <View style={styles.listContainer}>
                <Button
                    title="View Locations"
                    color={themeColors.primary} // Apply primary color to buttons
                    onPress={() => navigation.navigate('Locations')}
                />
            </View>
            <View style={styles.listContainer}>
                <Button
                    title="View Products"
                    color={themeColors.primary} // Apply primary color to buttons
                    onPress={() => navigation.navigate('Products')}
                />
            </View>
        </View>
    );
}



export default ManageScreen;

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
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Space between title and button
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: themeColors.primary, // Use primary theme color
        borderBottomWidth: 1,
        borderBottomColor: themeColors.borders, // Use theme border color
    },
});