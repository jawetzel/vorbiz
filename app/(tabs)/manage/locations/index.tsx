import {
    StyleSheet,
    FlatList,
    View,
    Text,
    ListRenderItemInfo,
    TouchableOpacity, Linking
} from 'react-native';
import React, { useState} from 'react';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import LocationModel from "@/services/local-data/models/location-model";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {faPlusSquare, faMap} from '@fortawesome/free-regular-svg-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {RootStackParamList} from "@/models/ProjectRouteParams";
import {themeColors} from "@/components/ui/theme-colors";

type ListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LocationDetail'>;



export default function LocationScreen() {
    const database = useDatabase();
    const navigation = useNavigation<ListScreenNavigationProp>();
    const [locations, setLocations] = useState<LocationModel[]>([]);
    useFocusEffect(
        React.useCallback(() => {
            const loadLocations = async () => {
                const data = await LocationModel.load(database);
                setLocations(data);
            };
            loadLocations();
        }, [database])
    );

    return (
        <FlatList
            style={{ flex: 1, backgroundColor: themeColors.background }}
            ListHeaderComponent={
                <View style={styles.titleContainer}>
                    <FontAwesomeIcon icon={faMap} size={36} color={themeColors.backgroundThree} />
                    <Text style={styles.headerText}>Locations</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => navigation.navigate('LocationDetail', { id: null })}
                    >
                        <FontAwesomeIcon icon={faPlusSquare} size={36} color={themeColors.backgroundThree} />
                    </TouchableOpacity>
                </View>
            }
            data={locations}
            renderItem={({ item }: ListRenderItemInfo<LocationModel>) => (
                <TouchableOpacity
                    style={styles.itemContainer}
                    onPress={() => navigation.navigate('LocationDetail', { id: item.id })}
                >
                    <View style={styles.itemContent}>
                        {/* Left Section */}
                        <View style={styles.leftSection}>
                            <Text style={styles.itemTitle}>{item.name}</Text>
                            <Text style={styles.itemSubtitle}>{item.phone}</Text>
                        </View>


                        {item.address && item.city && item.state && (<View>
                            <TouchableOpacity
                                style={styles.mapButton}
                                onPress={() =>
                                    Linking.openURL(
                                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                            `${item.address}, ${item.city}, ${item.state} ${item.zipCode}`
                                        )}`
                                    )
                                }
                            >
                                <FontAwesomeIcon icon={faMap} size={24} color={themeColors.primary} />
                            </TouchableOpacity>
                        </View>)}
                    </View>
                </TouchableOpacity>

            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
        />
    );
}


const styles = StyleSheet.create({
    flatList: {
        flex: 1,
        backgroundColor: themeColors.background,
    },
    listContainer: {
        padding: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: themeColors.primary,
        borderBottomWidth: 1,
        borderBottomColor: themeColors.borders,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: themeColors.backgroundThree,
    },
    addButton: {
    },
    itemContainer: {
        marginTop: 6,
        backgroundColor: themeColors.backgroundThree,
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: themeColors.borders,
        borderWidth: 0.1
    },
    itemContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: themeColors.text,
    },
    itemSubtitle: {
        fontSize: 14,
        color: themeColors.textLight,
    },
    button: {
        backgroundColor: themeColors.primary,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
        marginLeft: 8,
    },
    buttonText: {
        color: themeColors.backgroundThree,
        fontWeight: 'bold',
    },
    leftSection: {
        flex: 1,
        marginRight: 10,
    },

    mapButton: {
        marginLeft: 16,
        padding: 8,
    },
});