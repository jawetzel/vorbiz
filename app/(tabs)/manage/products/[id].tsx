import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert, TouchableOpacity,
} from 'react-native';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import ProductModel from "@/services/local-data/models/product-model";
import {ProjectRouteParams, RootStackParamList} from "@/models/ProjectRouteParams";
import {faCaretSquareUp, faCaretSquareDown} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import ProductVariantModal from "@/app/(tabs)/manage/products/product-variant-modal";
import ProductVariantModel from "@/services/local-data/models/product-variant-model";
import InputField from "@/components/ui/input-field";
import Loader from "@/components/ui/loader";
import DeleteButton from "@/components/ui/buttons/delete-button";
import SaveButton from "@/components/ui/buttons/save-button";
import {themeColors} from "@/components/ui/theme-colors";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

type ProductDetailScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'ProductDetail'
>;
type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

export default function ProductDetailScreen() {
    const database = useDatabase();
    const navigation = useNavigation<ProductDetailScreenNavigationProp>();
    const route = useRoute<ProductDetailScreenRouteProp>();

    const { id } = route.params || {};
    const [loading, setLoading] = useState(true);
    const [variantModalVisible, setVariantModalVisible] = useState(false);
    const [variantModalId, setVariantModalId] = useState<string | null>(null);
    const [variants, setVariants] = useState<ProductVariantModel[]>([]);
    const [collapsedSections, setCollapsedSections] =
        useState<Record<string, boolean>>({
            'Product Identification': true,
            'Product Dimensions': true,
            'Personalization Options': true,
            'SEO': true,
        });
    const [product, setProduct] =
        useState<ProductModel>({
            name: '',       description: '',
            category: '',   price: 0.0,
            sku: '',        brand: '',
            image: '',      tags: '',
            seoTerms: '',   seoDescription: '',
            canPersonalizeCustomText: false,    canPersonalizeCustomImage: false,
            canPersonalizeSize: false,          canPersonalizeCustomMessage: false,
            canPersonalizeGiftwrap: false,
            upc: '',        asin: '',
            certifications: '',
            dimensionH: 0.0,            dimensionW: 0.0,            dimensionD: 0.0,
            shippingDimensionH: 0.0,    shippingDimensionW: 0.0,    shippingDimensionD: 0.0,
            dimensionUnitOfMeasurement: 'LBS',
            weightLbs: 0.0,             shippingWeightLbs: 0.0,
            isActive: true,             quickButton: false
        } as ProductModel);

    const [errors, setErrors] =
        useState<{ [key: string]: string }>({
            name: '',
            price: '',
        });

    useEffect(() => {
        const loadProduct = async () => {
            if (id) {
                try {
                    const fetchedProduct = await ProductModel.loadById(database, id);

                    if (fetchedProduct) {
                        setProduct(mapProductForState(fetchedProduct));
                    }
                    const fetchedVariants = await ProductVariantModel.loadByProductId(database, id);
                    if(fetchedVariants && fetchedVariants.length > 0){
                        setVariants(fetchedVariants);
                    }

                    setLoading(false);
                } catch (error) {
                    console.error('Error loading product:', error);
                    Alert.alert('Error', 'Unable to load product.');
                }
            } else {
                await saveRecord(true);
            }
            setLoading(false);
        };

        loadProduct();
    }, [id, database]);

    const toggleSection = (section: string) => {
        setCollapsedSections(prevState => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };

    const mapProductForState = (fetchedProduct: ProductModel) => {
        return {
            name: fetchedProduct.name ?? '', // Default to empty string if not available
            description: fetchedProduct.description ?? '',
            category: fetchedProduct.category ?? '',
            price: fetchedProduct.price ?? 0.0, // Default to 0 if not available
            sku: fetchedProduct.sku ?? '',
            brand: fetchedProduct.brand ?? '',
            image: fetchedProduct.image ?? '',
            tags: fetchedProduct.tags ?? '',
            seoTerms: fetchedProduct.seoTerms ?? '',
            seoDescription: fetchedProduct.seoDescription ?? '',
            canPersonalizeCustomText: fetchedProduct.canPersonalizeCustomText ?? false,
            canPersonalizeCustomImage: fetchedProduct.canPersonalizeCustomImage ?? false,
            canPersonalizeSize: fetchedProduct.canPersonalizeSize ?? false,
            canPersonalizeCustomMessage: fetchedProduct.canPersonalizeCustomMessage ?? false,
            canPersonalizeGiftwrap: fetchedProduct.canPersonalizeGiftwrap ?? false,
            upc: fetchedProduct.upc ?? '',
            asin: fetchedProduct.asin ?? '',
            certifications: fetchedProduct.certifications ?? '',
            dimensionH: fetchedProduct.dimensionH ?? '',
            dimensionW: fetchedProduct.dimensionW ?? '',
            dimensionD: fetchedProduct.dimensionD ?? '',
            shippingDimensionH: fetchedProduct.shippingDimensionH ?? '',
            shippingDimensionW: fetchedProduct.shippingDimensionW ?? '',
            shippingDimensionD: fetchedProduct.shippingDimensionD ?? '',
            dimensionUnitOfMeasurement: fetchedProduct.dimensionUnitOfMeasurement ?? '',
            weightLbs: fetchedProduct.weightLbs ?? '',
            shippingWeightLbs: fetchedProduct.shippingWeightLbs ?? '',
            isActive: fetchedProduct.isActive ?? '',
            quickButton: fetchedProduct.quickButton ?? '',
        } as ProductModel;
    }
    const handleSave = async () => {
        await saveRecord(false);
    }
    const saveRecord = async (disableAlert = false) => {
        const validationErrors = ProductModel.validate(product);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);
        try {
            if (id) {
                await ProductModel.update(database, id, product);
            } else {
                const newProduct = await ProductModel.create(database, product);
                setProduct(mapProductForState(newProduct));
                navigation.setParams({ id: newProduct.id });
            }
            if(!disableAlert)
                Alert.alert('Success', `Product ${id ? 'updated' : 'created'} successfully.`);
            //navigation.goBack();
        } catch (error) {
            //console.error('Error saving product:', error);
            if(!disableAlert)
                Alert.alert('Error', `Failed to ${id ? 'update' : 'create'} product.`);
        } finally {
            setLoading(false);
        }
    };
    const handleChange = (field: string, value: string | boolean | number) => {
        const typing = ProductModel.GetColumnType(field);
        let parsedValue = null;
        if(typeof value === 'boolean'){
            parsedValue = value;
        } else if(typeof value === 'number'){
            parsedValue = value;
        } else {
            if (typing === 'number') {
                if (/^(\d+(\.\d*)?|\.\d*)?$/.test(value)) {
                    parsedValue = value;
                }
            } else if (typing === 'boolean') {
                parsedValue = Boolean(value);
            } else {
                parsedValue = value;
            }
        }

        setProduct((prev) => ({
            ...prev,
            [field]: parsedValue,
        } as ProductModel));
    };
    const handleDelete = () => {
        if (!id) return;

        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this product? This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Delete canceled'),
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            await ProductModel.deleteById(database, id);
                            Alert.alert('Success', 'Product deleted successfully.');
                            navigation.goBack();
                        } catch (error) {
                            console.error('Error deleting product:', error);
                            Alert.alert('Error', 'Failed to delete product.');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    if (loading) {
        return (
           <Loader/>
        );
    }

    const productInfoGroup =  {
            category: 'Product Info',
            fields: ['quickButton', 'name', 'description', 'price', 'category', 'brand', 'image', 'certifications', 'upc', 'isActive']
        }
    const fieldGroups = [
        {
            category: 'Product Identification',
            fields: ['sku', 'asin', 'category', 'brand']
        },
        {
            category: 'Product Dimensions',
            fields: [
                'dimensionH', 'dimensionW', 'dimensionD',
                'shippingDimensionH', 'shippingDimensionW', 'shippingDimensionD',
                'dimensionUnitOfMeasurement',
                'weightLbs', 'shippingWeightLbs'
            ]
        },
        {
            category: 'Personalization Options',
            fields: ['canPersonalizeCustomText', 'canPersonalizeCustomImage', 'canPersonalizeSize', 'canPersonalizeCustomMessage', 'canPersonalizeGiftwrap'],
        },
        {
            category: 'SEO',
            fields: ['tags', 'seoTerms', 'seoDescription'],
        },
    ];
    const fieldDisplayNames: Record<string, string> = {
        quickButton: 'Sales Quick Button',
        name: "Name",
        description: "Description",
        category: "Category",
        price: "Price",
        sku: "SKU",
        brand: "Brand",
        image: "Image",
        tags: "Tags",
        seoTerms: "SEO Terms",
        seoDescription: "SEO Description",
        canPersonalizeCustomText: "Can Personalize Custom Text",
        canPersonalizeCustomImage: "Can Personalize Custom Image",
        canPersonalizeSize: "Can Personalize Size",
        canPersonalizeCustomMessage: "Can Personalize Custom Message",
        canPersonalizeGiftwrap: "Can Personalize Gift Wrap",
        upc: "UPC",
        asin: "ASIN",
        certifications: "Certifications",
        dimensionH: "Height",
        dimensionW: "Width",
        dimensionD: "Length",
        shippingDimensionH: "Shipping Height",
        shippingDimensionW: "Shipping Width",
        shippingDimensionD: "Shipping Length",
        dimensionUnitOfMeasurement: "Size Unit Of Measurement",
        weightLbs: "Weight (LBS)",
        shippingWeightLbs: "Shipping Weight (LBS)",
        isActive: "Product Active",
    };

    const openModal = (variantId: string | null) => {
        setVariantModalId(variantId);
        setVariantModalVisible(true);
    };

    const closeModal = () => {
        setVariantModalVisible(false);
        setVariantModalId(null);
        if(id){
            setLoading(true);
            ProductVariantModel.loadByProductId(database, id).then(fetchedVariants => {
                if(fetchedVariants && fetchedVariants.length > 0){
                    setVariants(fetchedVariants);
                }
                setLoading(false);
            }).catch((err) => {
                setLoading(false);
                throw err;
            })

        }
    };

    const renderGroupSection = (category: string, fields: string[]) => {
        return (
            <View key={'product_' + category} style={styles.group}>
                <TouchableOpacity
                    onPress={() => toggleSection(category)}
                    style={styles.sectionHeader}
                >
                    <Text style={styles.groupTitle}>{category}</Text>
                    {category !== 'Product Info' &&
                    <>
                        {collapsedSections[category] ? (
                            <FontAwesomeIcon icon={faCaretSquareUp} size={20} color={themeColors.text} />
                        ) : (
                            <FontAwesomeIcon icon={faCaretSquareDown} size={20} color={themeColors.text} />
                        )}
                    </>
                    }

                </TouchableOpacity>
                {!collapsedSections[category] && (
                    <View style={styles.sectionContent}>
                        {fields.map((field) => (
                            <InputField
                                key={'product_' + category + field}
                                title={fieldDisplayNames[field]}
                                fieldType={ProductModel.GetColumnType(field)}
                                fieldName={field}
                                value={product[field as keyof ProductModel]}
                                handleChange={handleChange}
                                error={errors[field]}
                            />
                        ))}
                    </View>
                )}
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Modal Component */}
            {variantModalVisible && id &&
                <ProductVariantModal
                    visible={variantModalVisible}
                    onClose={closeModal}
                    productId={id} // Pass productId to the modal
                    variantId={variantModalId}
                />
            }

            {renderGroupSection(productInfoGroup.category, productInfoGroup.fields)}

            {/* Variant Buttons Section */}
            <View style={styles.variantsContainer}>

                <View style={styles.titleBar}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.groupTitle}>Product Variations</Text>
                    </View>
                    <TouchableOpacity style={styles.createButton} onPress={e => openModal(null)}>
                        <Text style={styles.createButtonText}>+ New</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal contentContainerStyle={styles.variantsList}>
                    {variants.map((variant) => (
                        <TouchableOpacity
                            key={variant.id}
                            style={styles.variantPill}
                            onPress={() => openModal(variant.id)}
                        >
                            <Text style={styles.variantText}>
                                {variant.size ? (variant.size + " ") : ""}
                                {variant.color ? (variant.color + " ") : ""}
                                {variant.material ? (variant.material + " ") : ""}

                                {!variant.size && !variant.color && !variant.material ? 'Unnamed Variant' : ''}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Non-Primary Sections */}
            {fieldGroups.map((group) => (
                renderGroupSection(group.category, group.fields)
            ))}

            {/* Buttons */}
            <DeleteButton handle={handleDelete}/>
            <View style={styles.buttonSpacing} />
            <SaveButton handle={handleSave} text={"Save"}/>
        </ScrollView>
    );

}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: themeColors.background,
    },
    buttonSpacing: {
        height: 16,
    },
    group: {
        marginBottom: 24,
        borderWidth: 1,
        borderColor: themeColors.borders,
        borderRadius: 4,
        overflow: 'hidden',
    },
    groupTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: themeColors.text,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: themeColors.backgroundTwo,
    },
    sectionContent: {
        padding: 12,
        backgroundColor: themeColors.backgroundThree,
    },
    variantsContainer: {
        marginBottom: 24,
        padding: 4,
        borderWidth: 1,
        borderColor: themeColors.borders,
        borderRadius: 4,
        backgroundColor: themeColors.backgroundTwo,
    },
    variantsList: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    variantPill: {
        backgroundColor: themeColors.highlight,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 4,
        marginBottom: 8,
        marginLeft: 8,
    },
    variantText: {
        fontSize: 16,
        color: themeColors.backgroundThree,
        fontWeight: '500',
    },
    titleBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 8,
        borderBottomWidth: 1,
        marginBottom: 12,
        borderBottomColor: themeColors.borders,
        backgroundColor: themeColors.backgroundTwo,
    },
    createButton: {
        backgroundColor: themeColors.primary,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    createButtonText: {
        color: themeColors.backgroundThree,
        fontSize: 14,
        fontWeight: '600',
    },
});