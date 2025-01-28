import { Model, Database } from '@nozbe/watermelondb';
import { Q } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';
import {Associations} from "@nozbe/watermelondb/Model";
import {InputFieldTypes} from "@/models/constants";
import {ValidateProductVariant} from "@/utils/validation/model-validators/product-variant-validators";

export default class ProductVariantModel extends Model {
    static table = 'productVariants';

    static columns = [
        {name: 'product_id', type: 'string', isIndexed: true},
        {name: 'size', type: 'string'},
        {name: 'color', type: 'string'},
        {name: 'material', type: 'string'},
        {name: 'price', type: 'number', inputType: InputFieldTypes.money},
        {name: 'image', type: 'string'},
        {name: 'upc', type: 'string', inputType: InputFieldTypes.numeric},
        {name: 'isActive', type: 'boolean' },
        {name: 'isTaxIncludedPrice', type: 'boolean' },

    ];
    static associations: Associations = {
        products: { type: 'belongs_to', key: 'product_id' },
        saleLines: { type: 'has_many', foreignKey: 'productVariant_id' },
    }

    static GetColumnType(column: string){
        const columnDef = ProductVariantModel.columns.find((col) => col.name === column);
        return columnDef?.type;
    }
    static GetInputType(column: string){
        const columnDef = ProductVariantModel.columns.find((col) => col.name === column);
        return columnDef?.inputType ?? null;
    }

    @field('product_id') product_id!: string | null;
    @text('size') size!: string | null;
    @text('color') color!: string | null;
    @text('material') material!: string | null;
    @field('price') price!: number | null;
    @text('image') image!: string | null;
    @text('upc') upc!: string | null;
    @field('isActive') isActive!: boolean;
    @field('isTaxIncludedPrice') isTaxIncludedPrice!: boolean;


    static validate(variantData: any) {
        return ValidateProductVariant(variantData);
    }


    static async loadByProductId(
        database: Database,
        productId: string
    ): Promise<ProductVariantModel[]> {
        try {
            // Query directly on the `product_id` field
            return await database.collections
                .get<ProductVariantModel>(this.table)
                .query(Q.where('product_id', productId)) // Matches `product_id` in `productVariants`
                .fetch();
        } catch (error) {
            console.error('Error fetching product variants by product ID:', error);
            throw error;
        }
    }


    // Static method to load location by ID
    static async loadById(database: Database, id: string): Promise<ProductVariantModel> {
        return await database.collections.get(this.table).find(id) as ProductVariantModel;
    }

    // Static method to create a new location
    static async create(database: Database, data: ProductVariantModel): Promise<ProductVariantModel> {
        return await database.write(async () => {
            return database.collections.get(this.table).create((record) => {
                Object.assign(record, data);
            });
        }) as ProductVariantModel;
    }

    // Static method to update an existing location
    static async update(database: Database, id: string, data: ProductVariantModel): Promise<boolean> {
        await database.write(async () => {
            const existingLocation = await database.collections.get(this.table).find(id);
            await existingLocation.update((record) => {
                Object.assign(record, data);
            });
        });
        return true;
    }

    static async deleteById(database: any, id: string) {
        await database.write(async () => {
            const location = await database.collections.get(this.table).find(id);
            await location.destroyPermanently();
        });
    }
}
