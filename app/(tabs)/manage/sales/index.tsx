import {
    Alert, FlatList,
    StyleSheet, TouchableOpacity,
    View, Text
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import {useFocusEffect, useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";

import QRScanner from "@/app/(tabs)/manage/sales/qr-scanner";

import ProductModel from "@/services/local-data/models/product-model";
import ProductVariantModel from "@/services/local-data/models/product-variant-model";
import SaleModel from "@/services/local-data/models/sale-model";
import SaleLineModel from "@/services/local-data/models/sale-line-model";

import {themeColors} from "@/components/ui/theme-colors";

import {RootStackParamList} from "@/models/ProjectRouteParams";
import LocationPickerModal from "@/app/(tabs)/manage/sales/pick-location";
import LocationModel from "@/services/local-data/models/location-model";
import {
    CookieStorageGetData,
    CookieStorageKeyDefs,
    CookieStorageStoreData
} from "@/services/local-storage/cookie-storage";

type LineItem = {
    product: ProductModel;
    variant?: ProductVariantModel;
    quantity: number;
    linePrice: number;
};

type ScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'SaleHome'
>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'SaleHome'>;

export default function SaleScreen() {
    const database = useDatabase();
    const navigation = useNavigation<ScreenNavigationProp>();
    const route = useRoute<ScreenRouteProp>();

    const [location, setLocation] = useState<LocationModel | null>(null);
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [quickProducts, setQuickProducts] = useState<ProductModel[]>([]);
    const [variants, setVariants] = useState<ProductVariantModel[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariantModel | null>(null);
    const [lineItems, setLineItems] = useState<Array<LineItem>>([]);
    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);
    const [countyParishTaxRate, setCountyParishTaxRate] = useState(0);
    const [stateTaxRate, setStateTaxRate] = useState(0);

    useEffect(() => {
        if (!route.params) {
            navigation.setParams({ toggleQRScanner: false, showLocationModal: false });
        }
    }, [route.params]);

    useFocusEffect(useCallback(() => {
        ProductModel.load(database).then((loadedProducts) => {
            setProducts(loadedProducts);
            setQuickProducts(loadedProducts.filter((p) => p.quickButton));
        });
        LoadLocation();
    }, []));

    const LoadLocation = async () => {
        const locationString = await CookieStorageGetData(CookieStorageKeyDefs.SalesLocation);
        if(locationString){
            const data = await LocationModel.loadById(database, locationString);
            if(data){
                setStateTaxRate(data.stateTaxRate ?? 0);
                setCountyParishTaxRate(data.countyParishTaxRate ?? 0);
                setLocation(data);
                UpdateTotalsSection();
            }
        }
    }

    const UpdateTotalsSection = () => {
        const newSubtotal = lineItems.reduce((sum, item) => sum + item.linePrice, 0);
        const newTax = newSubtotal * ((countyParishTaxRate + stateTaxRate) / 100);
        setSubtotal(newSubtotal);
        setTax(newTax);
        setTotal(newSubtotal + newTax);
    }

    useFocusEffect(useCallback(() => {
        UpdateTotalsSection();
    }, [lineItems]));

    const handleQuickProductSelect = (product: ProductModel) => {
        setSelectedProduct(product);
        console.log(product.id);
        ProductVariantModel.loadByProductId(database, product.id).then(setVariants);
        if(variants && variants.length === 1){
            setSelectedVariant(variants[0]);
        } else {
            setSelectedVariant(null);
        }
    };

    const handleAddLineItem = () => {
        if (!selectedProduct) {
            Alert.alert('Error', 'Please select a product.');
            return;
        }

        const price = selectedVariant?.price || selectedProduct.price;

        setLineItems((prev) => {
            const existingIndex = prev.findIndex(
                (item) =>
                    item.product.id === selectedProduct.id &&
                    item.variant?.id === selectedVariant?.id
            );

            if (existingIndex !== -1) {
                return prev.map((item, index) =>
                    index === existingIndex
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                            linePrice: (item.quantity + 1) * (item.variant?.price || item.product.price || 0),
                        }
                        : item
                );
            }

            return [
                ...prev,
                {
                    product: selectedProduct,
                    variant: selectedVariant || undefined,
                    quantity: 1,
                    linePrice: price,
                } as LineItem,
            ];
        });
    };

    const handleQuantityChange = (index: number, increment: boolean) => {
        setLineItems((prev) => {
            return prev.reduce((acc, item, idx) => {
                if (idx !== index) {
                    acc.push(item);
                } else {
                    const newQuantity = increment ? item.quantity + 1 : item.quantity - 1;
                    if (newQuantity > 0) {
                        acc.push({
                            ...item,
                            quantity: newQuantity,
                            linePrice: newQuantity * (item.variant?.price || item.product.price || 0),
                        });
                    }
                }
                return acc;
            }, [] as typeof prev);
        });
    };

    const handleSubmit = async () => {
        const saleDate = new Date();

        try {
            await database.write(async () => {
                const newSale = await SaleModel.createTrans(database, {
                    location_id: null,
                    stateTaxRate: stateTaxRate,
                    countyParishTaxRate: countyParishTaxRate,
                    saleDate: saleDate.getTime(),
                } as SaleModel);

                if (!newSale) {
                    throw new Error('Failed to create sale');
                }

                for (const lineItem of lineItems) {
                    const subtotal = lineItem.linePrice;
                    const countyParishTaxAmount = subtotal * countyParishTaxRate;
                    const stateTaxAmount = subtotal * stateTaxRate;
                    const discount = 0;
                    const total = subtotal + countyParishTaxAmount + stateTaxAmount - discount;

                    const newLine = await SaleLineModel.createTrans(database, {
                        sale_id: newSale.id,
                        product_id: lineItem.product.id,
                        productVariant_id: lineItem.variant?.id,
                        qty: lineItem.quantity,
                        subtotal,
                        countyParishTaxAmount,
                        stateTaxAmount,
                        discount,
                        total,
                    });

                    if (!newLine) {
                        throw new Error('Failed to create sale line');
                    }
                }
            });

            Alert.alert('Sale Recorded', 'The sale has been recorded successfully.');

            setLineItems([]);
            setSubtotal(0);
            setTax(0);
            setTotal(0);
        } catch (e) {
            Alert.alert('Sale Failed', 'Something went wrong recording the sale.');
        }
    };

    const onQrRead = (qrtext: string | null | undefined) => {
        const scannedProduct = products.find((product) => product.upc === qrtext);
        if(scannedProduct) {
            setSelectedProduct(scannedProduct);
            ProductVariantModel.loadByProductId(database, scannedProduct.id).then(setVariants);
            if(variants && variants.length === 1){
                setSelectedVariant(variants[0]);
            } else {
                setSelectedVariant(null);
            }
            navigation.setParams({ toggleQRScanner: false });
        }
    };

    const setLocationId = async (selectedLocation: LocationModel) => {
        console.log(selectedLocation);
        setLocation(selectedLocation);
        setStateTaxRate(selectedLocation.stateTaxRate ?? 0);
        setCountyParishTaxRate(selectedLocation.countyParishTaxRate ?? 0);
        UpdateTotalsSection();
        navigation.setParams({
            toggleQRScanner: route.params?.toggleQRScanner,
            showLocationModal: false
        });
        await CookieStorageStoreData(CookieStorageKeyDefs.SalesLocation, selectedLocation.id);
    }

    return (
        <View style={[styles.container]}>

            {/*Header*/}
            <View style={styles.headerSection}>
                {location &&
                    <View>
                        <Text>Location: {location.name}</Text>
                    </View>
                }
                {route.params?.toggleQRScanner && <QRScanner onRead={onQrRead} />}
                {route.params?.showLocationModal &&
                    <LocationPickerModal
                        showModal={route.params.showLocationModal}
                        setLocationId={setLocationId}
                        onClose={() => {
                            navigation.setParams({
                                toggleQRScanner: route.params?.toggleQRScanner,
                                showLocationModal: false
                            });
                        }}
                    />}
                {/* Quick Buttons */}
                {quickProducts.length > 0 && (
                    <FlatList
                        data={quickProducts}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    quickButtonsStyles.quickButton,
                                    selectedProduct?.id === item.id && quickButtonsStyles.quickButtonSelected
                                ]}
                                onPress={() => handleQuickProductSelect(item)}
                            >
                                <Text style={[
                                    quickButtonsStyles.quickButtonText,
                                    selectedProduct?.id === item.id && quickButtonsStyles.quickButtonTextSelected
                                ]}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={quickButtonsStyles.quickButtonContainer}
                    />
                )}
                {/* Product Selection */}
                <View  style={[styles.dropdownContainer, styles.border]}>
                    <Picker
                        selectedValue={selectedProduct?.id}
                        onValueChange={(itemValue) => {
                            const product = products.find((p) => p.id === itemValue);
                            setSelectedProduct(product || null);
                            if (product) {
                                ProductVariantModel.loadByProductId(database, product.id).then(setVariants);
                                if(variants && variants.length === 1){
                                    setSelectedVariant(variants[0]);
                                } else {
                                    setSelectedVariant(null);
                                }
                            } else {
                                setVariants([]);
                            }
                        }}
                    >
                        <Picker.Item label="Select Product" value={null} />
                        {products.map((product) => (
                            <Picker.Item key={product.id} label={product.name || "Unnamed Product"} value={product.id} />
                        ))}
                    </Picker>
                </View>


                {/* Variant Selection */}
                {variants.length > 0 && (
                    <View  style={[styles.dropdownContainer, styles.border]}>
                        <Picker
                            selectedValue={selectedVariant?.id}
                            onValueChange={(itemValue) => {
                                const variant = variants.find((v) => v.id === itemValue);
                                setSelectedVariant(variant || null);
                            }}
                        >
                            <Picker.Item label="Select Variant" value={null} />
                            {variants.map((variant) => {
                                const variantLabel = [variant.size, variant.color]
                                    .filter(Boolean)
                                    .join(' ') || 'Default';
                                return (
                                    <Picker.Item
                                        key={variant.id}
                                        label={variantLabel}
                                        value={variant.id}
                                    />
                                );
                            })}
                        </Picker>
                    </View>
                )}
                <TouchableOpacity style={styles.addButton} onPress={handleAddLineItem}>
                    <Text style={styles.addButtonText}>Add to Sale</Text>
                </TouchableOpacity>
            </View>

            {/* Body Section */}
            <View style={cartItemStyles.cartSection}>
                <Text style={cartItemStyles.cartTitle}>Cart Items</Text>
                <FlatList
                    data={lineItems}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item, index }) => (
                        <View style={cartItemStyles.lineItem}>
                            <View style={cartItemStyles.itemDetails}>
                                <Text style={cartItemStyles.lineItemText}>
                                    {item.product.name}
                                </Text>
                                {(item.variant?.size || item.variant?.color) && (
                                    <Text style={cartItemStyles.variantText}>
                                        {item.variant?.size} {item.variant?.color}
                                    </Text>
                                )}
                            </View>
                            <View style={cartItemStyles.quantityPriceContainer}>
                                <TouchableOpacity
                                    onPress={() => handleQuantityChange(index, false)}
                                    style={cartItemStyles.quantityButton}
                                >
                                    <FontAwesomeIcon
                                        icon={faMinus}
                                        size={12}
                                        color={themeColors.text}
                                    />
                                </TouchableOpacity>
                                <Text style={cartItemStyles.quantityText}>{item.quantity}</Text>
                                <TouchableOpacity
                                    onPress={() => handleQuantityChange(index, true)}
                                    style={cartItemStyles.quantityButton}
                                >
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        size={12}
                                        color={themeColors.text}
                                    />
                                </TouchableOpacity>
                                <Text style={cartItemStyles.priceText}>
                                    ${item.linePrice.toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    )}
                />
            </View>
            {/* Totals Section */}
            <View style={footerStyles.totalsContainer}>
                {/* Left Side - Aligned Totals */}
                <View style={footerStyles.leftSection}>
                    <View style={footerStyles.totalRow}>
                        <Text style={footerStyles.subtotalLabel}>Subtotal:</Text>
                        <Text style={footerStyles.subtotalValue}>${subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={footerStyles.totalRow}>
                        <Text style={footerStyles.taxLabel}>
                            <Text>Tax </Text>
                            <Text style={{fontSize: 10}}>
                                ({(stateTaxRate + countyParishTaxRate).toFixed(2)}%)
                            </Text>
                            <Text>: </Text>
                        </Text>
                        <Text style={footerStyles.taxValue}>${tax.toFixed(2)}</Text>
                    </View>
                    <View style={footerStyles.divider} />
                    <View style={footerStyles.totalRow}>
                        <Text style={footerStyles.totalLabel}>Total:</Text>
                        <Text style={footerStyles.totalValue}>${total.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Right Side - Submit Button */}
                <View style={footerStyles.rightSection}>
                    <TouchableOpacity
                        style={[
                            footerStyles.submitButton,
                            (!lineItems?.length) && footerStyles.submitButtonDisabled
                        ]}
                        disabled={!lineItems?.length}
                        onPress={handleSubmit}
                    >
                        <Text style={footerStyles.submitButtonText}>Submit Sale</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
}

// Quick Item Pick buttons (Selection chips)
const quickButtonsStyles = StyleSheet.create({
    quickButtonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    quickButton: {
        borderWidth: 1,
        borderColor: themeColors.secondary, // Changed from primary to secondary
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 16,
        marginRight: 8,
        backgroundColor: themeColors.backgroundThree,
    },
    quickButtonSelected: {
        backgroundColor: themeColors.secondary, // Changed from primary to secondary
    },
    quickButtonText: {
        color: themeColors.secondary, // Changed from primary to secondary
        fontSize: 14,
        fontWeight: '500',
    },
    quickButtonTextSelected: {
        color: themeColors.backgroundThree,
    },
});
const cartItemStyles = StyleSheet.create({
    cartSection: {
        flex: 1,
        backgroundColor: themeColors.backgroundThree,
    },
    cartTitle: {
        fontSize: 18,
        fontWeight: '600',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: themeColors.borders,
    },
    lineItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: themeColors.borders,
        backgroundColor: themeColors.backgroundThree,
    },
    itemDetails: {
        flex: 1,
        paddingRight: 8,
    },
    lineItemText: {
        fontSize: 14,
        color: themeColors.text,
    },
    variantText: {
        fontSize: 12,
        color: themeColors.textLight,
        marginTop: 2,
    },
    quantityPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    quantityButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: themeColors.borders,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: themeColors.backgroundThree,
    },
    quantityText: {
        fontSize: 14,
        minWidth: 20,
        textAlign: 'center',
        color: themeColors.text,
    },
    priceText: {
        fontSize: 14,
        minWidth: 60,
        textAlign: 'right',
        fontWeight: '500',
        color: themeColors.text,
    },
});
const footerStyles = StyleSheet.create({
    totalsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: themeColors.backgroundThree,
        borderTopWidth: 1,
        borderTopColor: themeColors.borders,
    },
    leftSection: {
        flex: 1,
        justifyContent: 'center',
        gap: 4,
    },
    rightSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    totalRow: {
        marginVertical: 0,
        paddingVertical: 0,
        marginHorizontal: 'auto',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    subtotalLabel: {
        fontSize: 16,
        fontWeight: 500,
        color: themeColors.success,
        width: 70,  // Fixed width for labels
    },
    subtotalValue: {
        fontSize: 16,
        fontWeight: 500,
        color: themeColors.success,
        minWidth: 60,  // Minimum width for values
        textAlign: 'right',
    },
    taxLabel: {
        fontSize: 16,
        fontWeight: 500,
        color: themeColors.primaryTwo,
        width: 70,  // Fixed width for labels
    },
    taxValue: {
        fontSize: 16,
        fontWeight: 500,
        color: themeColors.primaryTwo,
        minWidth: 60,  // Minimum width for values
        textAlign: 'right',
    },
    divider: {
        height: 1,
        backgroundColor: themeColors.borders,
        marginVertical: 2,
        width: '100%',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: themeColors.danger,
        width: 70,  // Fixed width for labels
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '600',
        color: themeColors.danger,
        minWidth: 60,  // Minimum width for values
        textAlign: 'right',
    },
    submitButton: {
        backgroundColor: themeColors.primary, // Keep primary green for final submit
        paddingVertical: 8,
        width: '90%',
        height: 70,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: themeColors.borders,
    },
    submitButtonText: {
        color: themeColors.backgroundThree,
        fontSize: 22,
        fontWeight: '600',
    },
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8,
        backgroundColor: themeColors.background,
    },
    headerSection: {
        flexGrow: 0,
        marginHorizontal: 8,
    },
    bodySection: {
        flexGrow: 1,
    },

    addButton: {
        marginTop: 4,
        padding: 12,
        backgroundColor: themeColors.primaryTwo, // Changed to golden yellow for "Add to Sale"
        alignItems: 'center',
        borderRadius: 4,
        marginBottom: 8,
    },
    addButtonText: {
        color: themeColors.backgroundThree,
        fontSize: 16,
        fontWeight: 'bold',
    },

    dropdownContainer: {
        marginVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4, // Rounded corners
        backgroundColor: themeColors.backgroundThree, // Optional background for dropdown
    },
    border: {
        borderWidth: 1,
        borderColor: themeColors.borders,
    }
});