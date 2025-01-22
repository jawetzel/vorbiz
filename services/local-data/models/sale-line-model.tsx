import {Database, Model, Q} from "@nozbe/watermelondb";
import {field} from "@nozbe/watermelondb/decorators";
import {Associations} from "@nozbe/watermelondb/Model";
import {InputFieldTypes} from "@/models/constants";
import SaleModel from "@/services/local-data/models/sale-model";
import LocationModel from "@/services/local-data/models/location-model";
import ProductModel from "@/services/local-data/models/product-model";
import _ from 'lodash';
import ProductVariantModal from "@/app/(tabs)/manage/products/product-variant-modal";
import ProductVariantModel from "@/services/local-data/models/product-variant-model";
import productVariantModal from "@/app/(tabs)/manage/products/product-variant-modal";

type modelT = SaleLineModel;

export default class SaleLineModel extends Model {
    static table = 'saleLines';
    static columns = [
        { name: 'sale_id',              type: 'string',     isIndexed: true }, // Relation to `sales`
        { name: 'product_id',           type: 'string',     isIndexed: true }, // Relation to `products`
        { name: 'productVariant_id',    type: 'string',     isIndexed: true }, // Relation to `products`
        { name: 'qty',                  type: 'number',     inputType: InputFieldTypes.numeric },
        { name: 'subtotal',             type: 'number',     inputType: InputFieldTypes.money },
        { name: 'countyParishTaxAmount',type: 'number',     inputType: InputFieldTypes.money },
        { name: 'stateTaxAmount',       type: 'number',     inputType: InputFieldTypes.money },
        { name: 'discount',             type: 'number',     inputType: InputFieldTypes.money },
        { name: 'total',                type: 'number',     inputType: InputFieldTypes.money },
        { name: 'price',                type: 'number',     inputType: InputFieldTypes.money },
        { name: 'refundAmount',         type: 'number',     inputType: InputFieldTypes.money },
        { name: 'qtyRefunded',          type: 'number',     inputType: InputFieldTypes.numeric },
    ];
    static associations: Associations  = {
        sales: { type: 'belongs_to', key: 'sale_id' },
        products: { type: 'belongs_to', key: 'product_id' },
        productVariants: { type: 'belongs_to', key: 'productVariant_id' },
    }
    static GetColumnType(column: string){
        const columnDef = SaleLineModel.columns.find((col) => col.name === column);
        return columnDef?.type;
    }
    static GetInputType(column: string){
        const columnDef = SaleLineModel.columns.find((col) => col.name === column);
        return columnDef?.inputType ?? null;
    }
    @field('sale_id') sale_id!: string | null;
    @field('product_id') product_id!: string | null;
    @field('productVariant_id') productVariant_id!: string | null;

    @field('qty') qty!: number;
    @field('subtotal') subtotal!: number;
    @field('countyParishTaxAmount') countyParishTaxAmount!: number;
    @field('stateTaxAmount') stateTaxAmount!: number;
    @field('discount') discount!: number;
    @field('total') total!: number;
    @field('price') price!: number;
    @field('refundAmount') refundAmount!: number;
    @field('qtyRefunded') qtyRefunded!: number;



    static async createTrans(
        database: Database, // Use only the database instance
        data: Partial<modelT>
    ): Promise<modelT> {
        try {
            const responseData = await database.collections.get(this.table).create((record: Model) => {
                Object.assign(record, data);
            }) as modelT;

            return responseData;
        } catch (error) {
            console.error('Error during create operation:', error);
            throw error;
        }
    }

    static async saleLinesByDateRange (
        database: Database,
        startTimestamp: number,
        endTimestamp: number
    ): Promise<SaleLineViewModel[]> {
            try {

                let sales = await database.collections.get('sales')
                    .query(
                        Q.and(
                            Q.where('saleDate', Q.between(startTimestamp, endTimestamp))
                        )

                    )
                    .fetch() as SaleModel[];
                sales = sales.filter(sale => sale.location_id);
                const saleIds = sales
                    .map(sale => sale.id)
                    .filter((id): id is string => id !== null && id !== undefined);
                const saleMap = new Map(sales
                    .map(sale => [sale.id, sale]));


                const locationIds = [...new Set(
                    sales
                        .map(sale => sale.location_id)
                        .filter((id): id is string => id !== null && id !== undefined)
                )];
                const locations = await database.collections.get('locations')
                    .query(
                        Q.where('id', Q.oneOf(locationIds))
                    )
                    .fetch() as LocationModel[];
                const locationMap = new Map(locations
                    .map(loc => [loc.id, loc]));


                const saleLines = await database.collections.get('saleLines')
                    .query(
                        Q.where('sale_id', Q.oneOf(saleIds))
                    )
                    .fetch() as SaleLineModel[];


                const productIds = [...new Set(
                    saleLines
                        .map(line => line.product_id)
                        .filter((id): id is string => id !== null && id !== undefined)
                )];
                const products = await database.collections.get('products')
                    .query(
                        Q.where('id', Q.oneOf(productIds))
                    )
                    .fetch() as ProductModel[];
                const productMap = new Map(products
                    .map(prod => [prod.id, prod]));

                // 5. Get all products for these sale lines in one query
                const productVariantIds = [...new Set(
                    saleLines
                        .map(line => line.productVariant_id)
                        .filter((id): id is string => id !== null && id !== undefined)
                )];
                const productVariants = await database.collections.get('productVariants')
                    .query(
                        Q.where('id', Q.oneOf(productVariantIds))
                    )
                    .fetch() as ProductVariantModel[];
                const productVariantMap = new Map(productVariants
                    .map(prod => [prod.id, prod]));



                const reportData = saleLines.map(line => {
                    // Check that we have a valid sale_id before lookup
                    if (!line.sale_id) {
                        throw new Error(`Sale line ${line.id} has no sale_id`);
                    }
                    const sale = saleMap.get(line.sale_id);
                    if (!sale) {
                        throw new Error(`Could not find sale for id ${line.sale_id}`);
                    }

                    // Check for valid location_id
                    if (!sale.location_id) {
                        throw new Error(`Sale ${sale.id} has no location_id`);
                    }
                    const location = locationMap.get(sale.location_id);
                    if (!location) {
                        throw new Error(`Could not find location for id ${sale.location_id}`);
                    }

                    // Check for valid product_id
                    if (!line.product_id) {
                        throw new Error(`Sale line ${line.id} has no product_id`);
                    }
                    const product = productMap.get(line.product_id);
                    if (!product) {
                        throw new Error(`Could not find product for id ${line.product_id}`);
                    }

                    let productVariant = null;
                    if (line.productVariant_id) {
                        productVariant = productVariantMap.get(line.productVariant_id);
                        if(!productVariant) {
                            throw new Error(`Could not find product variant for id ${line.productVariant_id}`);
                        }
                    }

                    return {
                        sale: sale,
                        location: location,
                        product: product,
                        line: line,
                        variant: productVariant
                    } as SaleLineViewModel;
                });
                return reportData;

            } catch (error) {
                console.error('Error fetching sale line report:', error);
                throw error;
            }
    };



    static async  aggregatedSalesByDateRange(
        database: Database,
        startTimestamp: number,
        endTimestamp: number
    ): Promise<AggregatedSaleLine[]> {
        try {
            const saleLines = await this.saleLinesByDateRange(database, startTimestamp, endTimestamp);

            const groupedSales = _.groupBy(saleLines, line =>
                `${line.location.id}|${line.product.id}|${line.variant?.id || ""}`
            );

            const aggregatedData = Object.values(groupedSales).map(group => {
                const { location, product, variant} = group[0];

                return {
                    locationName: location.name,
                    location: location,
                    productName: product.name,
                    product: product,
                    variant: variant,
                    totalQty: _.sumBy(group, 'line.qty'),
                    totalSubtotal: _.sumBy(group, 'line.subtotal'),
                    totalCountyParishTax: _.sumBy(group, 'line.countyParishTaxAmount'),
                    totalStateTax: _.sumBy(group, 'line.stateTaxAmount'),
                    totalAmount: _.sumBy(group, 'line.total')
                } as AggregatedSaleLine;
            });
            console.log(aggregatedData);
            return _.orderBy(aggregatedData, ['locationName', 'productName']);

        } catch (error) {
            console.error('Error generating aggregated sales report:', error);
            throw error;
        }
    };

}

export const groupAggregatedSalesByLocation = async  (
    aggregatedSales: AggregatedSaleLine[]
): Promise<LocationGroupedAggregatedSaleLineModel[]> => {
    const groupedSales = _.groupBy(aggregatedSales, line =>
        line.location.id
    );

    const aggregatedData = Object.values(groupedSales).map(group => {
        const { location} = group[0];
        return {
            locationName: location.name,
            location: location,
            aggregatedSales: group
        } as LocationGroupedAggregatedSaleLineModel;
    });

    return _.orderBy(aggregatedData, ['locationName']);
};
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

export const totalAggregatedSales = async  (
    aggregatedSales: AggregatedSaleLine[]
): Promise<SaleAggregationTotals> => {

    const totals = aggregatedSales.reduce((acc, curr) => {
        return {
            totalSubtotal: acc.totalSubtotal + curr.totalSubtotal,
            totalTax: acc.totalTax + curr.totalCountyParishTax + curr.totalStateTax,
            totalAmount: acc.totalAmount + curr.totalAmount,
            totalQty: acc.totalQty + curr.totalQty
        };
    }, { totalSubtotal: 0, totalTax: 0, totalAmount: 0, totalQty: 0 } as SaleAggregationTotals);

    return totals;
};

export interface LocationGroupedAggregatedSaleLineModel {
    locationName: string,
    location: LocationModel,
    aggregatedSales: AggregatedSaleLine[]
}
export interface ProductGroupedAggregatedSaleLineModel {
    product: ProductModel,
    variant: ProductVariantModel,
    aggregatedSales: AggregatedSaleLine[]
}

export interface SaleLineViewModel {
    sale: SaleModel,
    location: LocationModel,
    product: ProductModel,
    variant?: ProductVariantModel,
    line: SaleLineModel,

}
export interface SaleAggregationTotals {
    totalQty: number;
    totalSubtotal: number;
    totalTax: number;
    totalAmount: number;
}

export interface AggregatedSaleLine {
    locationName: string;
    location: LocationModel;
    productName: string;
    product: ProductModel;
    variant: ProductVariantModel;
    totalQty: number;
    totalSubtotal: number;
    totalCountyParishTax: number;
    totalStateTax: number;
    totalAmount: number;
}