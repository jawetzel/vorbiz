import {AggregatedSaleLine} from "@/services/local-data/models/sale-line-model";

export interface SaleAggregationTotals {
    totalQty: number;
    totalSubtotal: number;
    totalTax: number;
    totalAmount: number;
}

export const totalAggregatedSales = async  (
    aggregatedSales: AggregatedSaleLine[]
): Promise<SaleAggregationTotals> => {

    const totals = aggregatedSales.reduce((acc, curr) => {
        return {
            totalSubtotal: acc.totalSubtotal + curr.totalSubtotal,
            totalTax: acc.totalTax + curr.totalLocalTax + curr.totalStateTax,
            totalAmount: acc.totalAmount + curr.totalAmount,
            totalQty: acc.totalQty + curr.totalQty
        };
    }, { totalSubtotal: 0, exemptSales501c3: 0, totalTax: 0, totalAmount: 0, totalQty: 0 } as SaleAggregationTotals);

    return totals;
};