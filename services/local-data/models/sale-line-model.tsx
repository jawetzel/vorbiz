import {Database, Model} from "@nozbe/watermelondb";
import {field} from "@nozbe/watermelondb/decorators";
import {Associations} from "@nozbe/watermelondb/Model";
import {InputFieldTypes} from "@/models/constants";

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
}