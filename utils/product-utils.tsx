import ProductModel from "@/services/local-data/models/product-model";
import ProductVariantModel from "@/services/local-data/models/product-variant-model";

export const GetPriceFromItem = (
    product?: ProductModel | null,
    variant?: ProductVariantModel | null,
    localTaxRate: number = 0,
    stateTaxRate: number = 0
): number => {
    let price = variant?.price || product?.price || 0;

    if(
        (variant && variant.isTaxIncludedPrice) ||
        (product && product.isTaxIncludedPrice)
    ){
        price = price / (1 + (localTaxRate / 100) + (stateTaxRate / 100));
    }
    return Math.round(price * 100) / 100;
}