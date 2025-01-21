import {Database, Model, Q} from "@nozbe/watermelondb";
import {field} from "@nozbe/watermelondb/decorators";
import {Associations} from "@nozbe/watermelondb/Model";
import {InputFieldTypes} from "@/models/constants";
import SaleModel from "@/services/local-data/models/sale-model";
import LocationModel from "@/services/local-data/models/location-model";
import ProductModel from "@/services/local-data/models/product-model";
import _ from 'lodash';

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
    ): Promise<SaleLine[]> {
            try {
                // 1. Get all sales for the date range
                let sales = await database.collections.get('sales')
                    .query(
                        Q.and(
                            Q.where('saleDate', Q.between(startTimestamp, endTimestamp))
                        )

                    )
                    .fetch() as SaleModel[];
                sales = sales.filter(sale => sale.location_id);
                console.log('sales', sales);
                // 2. Get all unique location IDs from sales and fetch locations in one query
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

                // 3. Get all sale lines for these sales in one query
                const saleIds = sales
                    .map(sale => sale.id)
                    .filter((id): id is string => id !== null && id !== undefined);
                const saleLines = await database.collections.get('saleLines')
                    .query(
                        Q.where('sale_id', Q.oneOf(saleIds))
                    )
                    .fetch() as SaleLineModel[];

                // 4. Get all products for these sale lines in one query
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

                // 5. Create lookup maps for faster access
                const locationMap = new Map(locations.map(loc => [loc.id, loc]));
                const productMap = new Map(products.map(prod => [prod.id, prod]));
                const saleMap = new Map(sales.map(sale => [sale.id, sale]));

                // 6. Build final report data
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

                    return {
                        saleDate: sale.saleDate,
                        locationName: location.name,
                        location_id: location.id,
                        productName: product.name,
                        product_id: product.id,
                        qty: line.qty,
                        subtotal: line.subtotal,
                        countyParishTaxAmount: line.countyParishTaxAmount,
                        stateTaxAmount: line.stateTaxAmount,
                        total: line.total
                    } as SaleLine;
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
            // Get detailed sale lines
            const saleLines = await this.saleLinesByDateRange(database, startTimestamp, endTimestamp);

            // Group by location and product
            const groupedSales = _.groupBy(saleLines, line =>
                `${line.location_id}|${line.product_id}`
            );

            // Aggregate the groups
            const aggregatedData = Object.values(groupedSales).map(group => {
                const { locationName, productName} = group[0];

                return {
                    locationName,
                    productName,
                    totalQty: _.sumBy(group, 'qty'),
                    totalSubtotal: _.sumBy(group, 'subtotal'),
                    totalCountyParishTax: _.sumBy(group, 'countyParishTaxAmount'),
                    totalStateTax: _.sumBy(group, 'stateTaxAmount'),
                    totalAmount: _.sumBy(group, 'total')
                } as AggregatedSaleLine;
            });

            // Sort by location name and then product name
            return _.orderBy(aggregatedData, ['locationName', 'productName']);

        } catch (error) {
            console.error('Error generating aggregated sales report:', error);
            throw error;
        }
    };
}

interface SaleLine {
    saleDate: number;
    locationName: string;
    location_id: string;
    productName: string;
    product_id: string;
    qty: number;
    subtotal: number;
    countyParishTaxAmount: number;
    stateTaxAmount: number;
    total: number;
}

interface AggregatedSaleLine {
    locationName: string;
    productName: string;
    totalQty: number;
    totalSubtotal: number;
    totalCountyParishTax: number;
    totalStateTax: number;
    totalAmount: number;
}