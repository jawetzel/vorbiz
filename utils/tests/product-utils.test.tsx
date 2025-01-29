import { describe, expect, test } from '@jest/globals';
import { GetPriceFromItem } from "@/utils/product-utils";
import ProductModel from "@/services/local-data/models/product-model";
import ProductVariantModel from "@/services/local-data/models/product-variant-model";

describe('GetPriceFromItem', () => {
    test('returns 0 when no product or variant is provided', () => {
        expect(GetPriceFromItem(null, null)).toBe(0);
    });

    test('returns product price when no variant is provided', () => {
        const product = {
            price: 10.99,
            isTaxIncludedPrice: false
        } as ProductModel;
        expect(GetPriceFromItem(product, null)).toBe(10.99);
    });

    test('prefers variant price over product price', () => {
        const product = {
            price: 10.99,
            isTaxIncludedPrice: false
        } as ProductModel;

        const variant = {
            price: 9.99,
            isTaxIncludedPrice: false
        } as ProductVariantModel;

        expect(GetPriceFromItem(product, variant)).toBe(9.99);
    });

    // Test tax-included scenarios
    describe('tax-included prices', () => {
        const taxTests = [
            { price: 8.25, localTax: 10, stateTax: 5, expected: 7.17 },
            { price: 10.99, localTax: 8, stateTax: 4, expected: 9.81 },
            { price: 1.00, localTax: 20, stateTax: 0, expected: 0.83 }
        ];

        taxTests.forEach(({ price, localTax, stateTax, expected }) => {
            test(`correctly removes ${localTax}% local and ${stateTax}% state tax from ${price}`, () => {
                const product = {
                    price,
                    isTaxIncludedPrice: true
                } as ProductModel;

                const result = GetPriceFromItem(product, null, localTax, stateTax);
                expect(result).toBe(expected);

                // Verify that adding tax back results in original price (within rounding)
                const taxMultiplier = 1 + (localTax / 100) + (stateTax / 100);
                const backWithTax = Math.round(result * taxMultiplier * 100) / 100;
                expect(backWithTax).toBe(price);
            });
        });

        test('variant tax-included status overrides product', () => {
            const product = {
                price: 10.00,
                isTaxIncludedPrice: false
            } as ProductModel;

            const variant = {
                price: 10.00,
                isTaxIncludedPrice: true
            } as ProductVariantModel;

            const result = GetPriceFromItem(product, variant, 10, 5);
            expect(result).toBe(8.70);
        });
    });

    describe('edge cases', () => {
        test('handles zero tax rates correctly', () => {
            const product = {
                price: 10.00,
                isTaxIncludedPrice: true
            } as ProductModel;
            expect(GetPriceFromItem(product, null, 0, 0)).toBe(10.00);
        });

        test('handles very small tax rates correctly', () => {
            const product = {
                price: 10.00,
                isTaxIncludedPrice: true
            } as ProductModel;
            expect(GetPriceFromItem(product, null, 0.5, 0)).toBe(9.95);
        });

        test('handles high tax rates correctly', () => {
            const product = {
                price: 10.00,
                isTaxIncludedPrice: true
            } as ProductModel;

            const result = GetPriceFromItem(product, null, 25, 25);
            const taxMultiplier = 1 + (25 / 100) + (25 / 100);
            expect(result * taxMultiplier).toBeCloseTo(10.00, 2);
        });

        test('handles null product price correctly', () => {
            const product = {
                price: null,
                isTaxIncludedPrice: true
            } as ProductModel;
            expect(GetPriceFromItem(product, null, 10, 5)).toBe(0);
        });
    });

    describe('precision and rounding', () => {
        test('maintains precision for recurring decimals', () => {
            const product = {
                price: 10.00,
                isTaxIncludedPrice: true
            } as ProductModel;
            const result = GetPriceFromItem(product, null, 3, 3);
            expect(result * 1.06).toBeCloseTo(10.00, 2);
        });

        test('handles fractional cents correctly', () => {
            const product = {
                price: 0.02,
                isTaxIncludedPrice: true
            } as ProductModel;
            const result = GetPriceFromItem(product, null, 10, 5);
            expect(result * 1.15).toBeCloseTo(0.02, 2);
        });
    });
});