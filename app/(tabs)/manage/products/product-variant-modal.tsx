import React, {useEffect, useState} from 'react';
import {View, Modal, Text, StyleSheet, Alert} from 'react-native';
import ProductVariantModel from "@/services/local-data/models/product-variant-model";
import {useDatabase} from "@nozbe/watermelondb/hooks";
import InputField from "@/components/ui/inputs/input-field";
import DeleteButton from "@/components/ui/buttons/delete-button";
import SaveButton from "@/components/ui/buttons/save-button";
import CancelButton from "@/components/ui/buttons/cancel-button";
import {themeColors} from "@/constants/theme-colors";
import ProductModel from "@/services/local-data/models/product-model";

interface CreateProductVariantModalProps {
    productId: string; // The ID of the product
    variantId?: string | null; // Optional ID of the variant
    visible: boolean; // Whether the modal is visible
    onClose: () => void; // Function to call when the modal is closed
}
const CreateProductVariantModal:
    React.FC<CreateProductVariantModalProps> =
    ({productId, variantId, visible, onClose,}) => {

    const database = useDatabase();

    const [variantIdState, setVariantIdState] = useState(variantId);
    // State for form inputs
    const [variant, setVariant] =
        useState<ProductVariantModel>({
            size: '',
            color: '',
            material: '',
            price: 0.0,
            image: '',
            product_id: productId,
            upc: '',
            isActive: true,
        } as ProductVariantModel);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] =
        useState<{ [key: string]: string }>({
            size: '',
            color: '',
            material: '',
            price: '',
            image: '',
            upc: '',
            isActive: '',
        });

    const mapVariantForState = (fetchedProduct: ProductVariantModel) => {
        return {
            size: fetchedProduct.size,
            color: fetchedProduct.color,
            material: fetchedProduct.material,
            price: fetchedProduct.price,
            image: fetchedProduct.image,
            upc: fetchedProduct.upc,
            product_id: productId,
            isActive: fetchedProduct.isActive,
        } as ProductVariantModel;
    }

    useEffect(() => {
        const loadProductVariant = async () => {
            if (variantIdState) {
                try {
                    const fetchedProductVariant = await ProductVariantModel.loadById(database, variantIdState);

                    if (fetchedProductVariant) {
                        setVariant(mapVariantForState(fetchedProductVariant));
                    }
                } catch (error) {
                    console.error('Error loading product:', error);
                    Alert.alert('Error', 'Unable to load product.');
                }
            }
            setLoading(false);
        };

        loadProductVariant();
    }, [variantIdState, database]);

    const handleSave = async () => {
        await saveRecord(false);
    }
    const saveRecord = async (disableAlert = false) => {
        const validationErrors = ProductVariantModel.validate(variant);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);
        try {
            console.log("variantIdState", variantIdState)
            if (variantIdState) {
                await ProductVariantModel.update(database, variantIdState, variant);
                onClose();
            } else {
                console.log("variant", variant)

                const newVariant = await ProductVariantModel.create(database, variant);
                setVariantIdState(prevState => {
                    return newVariant.id;
                })

                setVariant(mapVariantForState(newVariant));
                onClose();
            }
            if(!disableAlert)
                Alert.alert('Success', `Variant ${variantIdState ? 'updated' : 'created'} successfully.`);
            //navigation.goBack();
        } catch (error) {
            if(!disableAlert)
                Alert.alert('Error', `Failed to ${variantIdState ? 'update' : 'create'} product.`);
        } finally {
            setLoading(false);
        }
    };
    const handleChange = (field: string, value: string | boolean | number) => {
        const typing = ProductVariantModel.GetColumnType(field);
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

        setVariant((prev) => ({
            ...prev,
            [field]: parsedValue,
        } as ProductVariantModel));
    };
    const handleDelete = () => {
        if (!variantIdState) return;

        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this product variant? This action cannot be undone.',
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
                            await ProductVariantModel.deleteById(database, variantIdState);
                            Alert.alert('Success', 'Product variant deleted successfully.');
                            onClose()
                        } catch (error) {
                            console.error('Error deleting product:', error);
                            Alert.alert('Error', 'Failed to delete product variant.');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };
        const fieldDisplayNames: Record<string, string> = {
            upc: "UPC",
            size: "Size",
            color: "Color",
            material: "Material",
            price: "Price",
            image: "Image Url",
            isActive: "Variant Active",
        };
    return (

        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <Text style={styles.title}>{variantIdState ? "Update" : "Create"} Product Variant</Text>

                {['upc', 'size', 'color', 'material', 'price', 'image', 'isActive'].map((field) => {
                    return <InputField key={field}
                                       title={fieldDisplayNames[field]}
                                       fieldType={ProductVariantModel.GetColumnType(field)}
                                       inputType={ProductVariantModel.GetInputType(field)}
                                       fieldName={field}
                                       value={variant[field as keyof ProductVariantModel]}
                                       handleChange={handleChange}
                                       error={errors[field]}
                            />
                })}

                {variantIdState ? <DeleteButton handle={handleDelete}/> : null}
                <SaveButton handle={handleSave} text={variantIdState ? "Update" : "Create"}/>
                <CancelButton handle={onClose}/>
            </View>
        </Modal>
    );

};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: themeColors.backgroundThree,
        padding: 20,
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: themeColors.text,
    },
});

export default CreateProductVariantModal;
