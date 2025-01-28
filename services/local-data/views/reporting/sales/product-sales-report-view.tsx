import ProductModel from "@/services/local-data/models/product-model";
import ProductVariantModel from "@/services/local-data/models/product-variant-model";
import _ from "lodash";
import {AggregatedSaleLine} from "@/services/local-data/models/sale-line-model";

export interface ProductGroupedAggregatedSaleLineModel {
    product: ProductModel,
    variant: ProductVariantModel,
    aggregatedSales: AggregatedSaleLine[]
}

export const groupAggregatedSalesByProduct = async  (
    aggregatedSales: AggregatedSaleLine[]
): Promise<ProductGroupedAggregatedSaleLineModel[]> => {

    const groupedSales = _.groupBy(aggregatedSales, line =>
        `${line.product.id}|${line.variant?.id || ""}`
    );

    const aggregatedData = Object.values(groupedSales).map(group => {
        const { product, variant} = group[0];
        return {
            product: product,
            variant: variant,
            aggregatedSales: group
        } as ProductGroupedAggregatedSaleLineModel;
    });

    return _.orderBy(aggregatedData, ['locationName']);
};