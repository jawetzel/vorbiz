/*import { schemaMigrations, createTable, addColumns } from '@nozbe/watermelondb/Schema/migrations';
import LocationModel from "@/services/local-data/models/location-model";
import ProductModel from "@/services/local-data/models/product-model";
import SaleModel from "@/services/local-data/models/sale-model";
import SaleLineModel from "@/services/local-data/models/sale-line-model";
import ProductVariantModel from "@/services/local-data/models/product-variant-model";

const models = [
    LocationModel,
    ProductModel,
    ProductVariantModel,
    SaleModel,
    SaleLineModel
];

// Generate migrations dynamically based on the model columns
function generateDynamicMigrations(models) {
    const migrations = [];

    models.forEach(model => {
        if (!model.table || !model.columns) {
            throw new Error(`Model ${model.name} is missing static table or columns property`);
        }

        // Create a migration step for adding the columns from the model
        migrations.push({
            toVersion: 2,
            steps: [
                addColumns({
                    table: model.table,
                    columns: model.columns,  // Add columns as defined in the model
                })
            ]
        });
    });

    return migrations;
}

export default schemaMigrations({
    migrations: generateDynamicMigrations(models),
});
*/