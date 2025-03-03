import { appSchema, tableSchema } from '@nozbe/watermelondb'
import SaleLineModel from "@/services/local-data/models/sale-line-model";
import SaleModel from "@/services/local-data/models/sale-model";
import ProductModel from "@/services/local-data/models/product-model";
import LocationModel from "@/services/local-data/models/location-model";
import ProductVariantModel from "@/services/local-data/models/product-variant-model";
import database from './context';
import CustomerModel from "@/services/local-data/models/customer-model"; // Import your db config

// A utility function to generate schema from models
function generateSchemaFromModels(models: any[]) {
    return models.map((model: any) => {
        if (!model.table || !model.columns) {
            throw new Error(`Model ${model.name} is missing static table or columns property`);
        }

        return tableSchema({
            name: model.table,
            columns: model.columns,
        });
    });
}

// Pass the models to generate tables dynamically
const tables = generateSchemaFromModels([
    LocationModel,
    ProductModel,
    ProductVariantModel,
    SaleModel,
    SaleLineModel,
    CustomerModel
]);

// model/schema.js
export const mySchema = appSchema({
    version: 10,
    tables: tables
})
