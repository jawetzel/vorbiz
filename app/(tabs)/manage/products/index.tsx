import {
    StyleSheet,
    FlatList,
    View,
    Text,
    ListRenderItemInfo,
    TouchableOpacity
} from 'react-native';
import React, { useState} from 'react';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {faPlusSquare, faListAlt} from '@fortawesome/free-regular-svg-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {RootStackParamList} from "@/models/ProjectRouteParams";
import ProductModel from "@/services/local-data/models/product-model";
import {themeColors} from "@/components/ui/theme-colors";

type ListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetail'>;



export default function ProductsScreen() {
    const database = useDatabase();
    const navigation = useNavigation<ListScreenNavigationProp>();
    const [products, setProducts] = useState<ProductModel[]>([]);
    useFocusEffect(
        React.useCallback(() => {
            const loadProducts = async () => {
                const data = await ProductModel.load(database);
                setProducts(data);
            };
            loadProducts();
        }, [database])
    );
    return (
        <FlatList style={{ flex: 1, backgroundColor: themeColors.background }}
            ListHeaderComponent={
                <View style={styles.titleContainer}>
                    <FontAwesomeIcon icon={faListAlt} size={36} color={themeColors.backgroundThree}/>
                    <Text style={styles.headerText}>Products</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ProductDetail', {id: null})}
                    >
                        <FontAwesomeIcon icon={faPlusSquare} size={36} color={themeColors.backgroundThree}/>
                    </TouchableOpacity>
                </View>
            }
            data={products}
            renderItem={({item}: ListRenderItemInfo<ProductModel>) => (
                <TouchableOpacity style={styles.itemContainer}
                                  onPress={() => navigation.navigate('ProductDetail', {id: item.id})}
                >
                    <View style={styles.itemContent}>
                        <View>
                            <Text style={styles.itemTitle}>{item.name}</Text>
                            <Text style={styles.itemSubtitle}>
                                {item.description}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
        />
    );
}

const styles = StyleSheet.create({
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
});