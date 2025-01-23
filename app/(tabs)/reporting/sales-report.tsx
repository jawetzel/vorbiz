import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { themeColors } from "@/constants/theme-colors";
import {
    LocationGroupedAggregatedSaleLineModel,
    ProductGroupedAggregatedSaleLineModel, SaleAggregationTotals
} from "@/services/local-data/models/sale-line-model";

interface Props {
    locationGroupedData: LocationGroupedAggregatedSaleLineModel[];
    productGroupedData: ProductGroupedAggregatedSaleLineModel[];
    totals: SaleAggregationTotals;
    title: string;
}

const SalesReport: React.FC<Props> = ({
                                          locationGroupedData,
                                          productGroupedData,
                                          totals,
                                            title
                                      }) => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.reportTitle}>{title}</Text>
            {/* Sales by Location Section */}
            <View style={styles.sectionCard}>
                <View style={styles.totalsSectionHeader}>
                    <Text style={styles.sectionHeaderText}>Sales by Location</Text>
                </View>

                {/* Location Groups */}
                {locationGroupedData.map((locationGroup, idx) => (
                    <View key={`location-${idx}`} style={styles.locationCard}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionHeaderText}>{locationGroup.locationName}</Text>
                        </View>

                        {locationGroup.aggregatedSales.map((sale, saleIdx) => (
                            <View key={`sale-${saleIdx}`} style={styles.itemRow}>
                                <View style={styles.leftColumn}>
                                    <Text style={styles.productName}>{sale.productName}</Text>
                                    {(sale.variant?.size || sale.variant?.color || sale.variant?.material) && (
                                        <Text style={styles.variantText}>
                                            {[sale.variant?.size, sale.variant?.color, sale.variant?.material]
                                                .filter(Boolean)
                                                .join(' · ')}
                                        </Text>
                                    )}
                                    {(sale.variant?.upc || sale.product.upc)
                                        && <Text style={styles.variantText}>UPC: {sale.variant?.upc ?? sale.product.upc}</Text>}
                                    {sale.product.brand && <Text style={styles.variantText}>{sale.product.brand}</Text>}
                                    {sale.product.category && <Text style={styles.variantText}>{sale.product.category}</Text>}
                                </View>
                                <View style={styles.rightColumn}>
                                    <View style={styles.valueRow}>
                                        <Text style={styles.label}>QTY:</Text>
                                        <Text style={styles.value}>{sale.totalQty}</Text>
                                    </View>
                                    <View style={styles.valueRow}>
                                        <Text style={styles.label}>Sales:</Text>
                                        <Text style={styles.value}>${sale.totalSubtotal?.toFixed(2)}</Text>
                                    </View>
                                    <View style={styles.valueRow}>
                                        <Text style={styles.label}>Tax:</Text>
                                        <Text style={styles.value}>
                                            ${(sale.totalCountyParishTax + sale.totalStateTax).toFixed(2)}
                                        </Text>
                                    </View>
                                    <View style={[styles.valueRow, styles.totalRow]}>
                                        <Text style={styles.totalLabel}>Total:</Text>
                                        <Text style={styles.totalValue}>
                                            ${sale.totalAmount?.toFixed(2)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                ))}
            </View>

            {locationGroupedData.length > 1 && (
                <View style={[styles.sectionCard, styles.majorSectionSpacing]}>
                    <View style={styles.totalsSectionHeader}>
                        <Text style={styles.sectionHeaderText}>Totals by Product</Text>
                    </View>
                    {productGroupedData.map((product, idx) => (
                        <View key={`product-${idx}`} style={styles.itemRow}>
                            <View style={styles.leftColumn}>
                                <Text style={styles.productName}>{product.product.name}</Text>
                                {(product.variant?.size || product.variant?.color || product.variant?.material) && (
                                    <Text style={styles.variantText}>
                                        {[product.variant?.size, product.variant?.color, product.variant?.material]
                                            .filter(Boolean)
                                            .join(' · ')}
                                    </Text>
                                )}
                                {(product.variant?.upc || product.product.upc)
                                    && <Text style={styles.variantText}>UPC: {product.variant?.upc ?? product.product.upc}</Text>}
                                {product.product.brand && <Text style={styles.variantText}>{product.product.brand}</Text>}
                                {product.product.category && <Text style={styles.variantText}>{product.product.category}</Text>}
                            </View>
                            <View style={styles.rightColumn}>
                                <View style={styles.valueRow}>
                                    <Text style={styles.label}>QTY:</Text>
                                    <Text style={styles.value}>
                                        {product.aggregatedSales.reduce((sum, sale) => sum + sale.totalQty, 0)}
                                    </Text>
                                </View>
                                <View style={styles.valueRow}>
                                    <Text style={styles.label}>Sales:</Text>
                                    <Text style={styles.value}>
                                        ${product.aggregatedSales.reduce((sum, sale) => sum + sale.totalSubtotal, 0).toFixed(2)}
                                    </Text>
                                </View>
                                <View style={styles.valueRow}>
                                    <Text style={styles.label}>Tax:</Text>
                                    <Text style={styles.value}>
                                        ${product.aggregatedSales.reduce((sum, sale) =>
                                        sum + sale.totalCountyParishTax + sale.totalStateTax, 0).toFixed(2)}
                                    </Text>
                                </View>
                                <View style={[styles.valueRow, styles.totalRow]}>
                                    <Text style={styles.totalLabel}>Total:</Text>
                                    <Text style={styles.totalValue}>
                                        ${product.aggregatedSales.reduce((sum, sale) => sum + sale.totalAmount, 0).toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            <View style={[styles.sectionCard, styles.majorSectionSpacing]}>
                <View style={styles.totalsSectionHeader}>
                    <Text style={styles.sectionHeaderText}>Day Totals</Text>
                </View>
                <View style={styles.dayTotalsCard}>
                    <View style={styles.totalsSummaryRow}>
                        <Text style={styles.summaryLabel}>Total Sales:</Text>
                        <Text style={styles.summaryValue}>
                            {locationGroupedData.reduce((sum, loc) => sum + loc.aggregatedSales.length, 0)}
                        </Text>
                    </View>
                    <View style={styles.totalsSummaryRow}>
                        <Text style={styles.summaryLabel}>Total Items:</Text>
                        <Text style={styles.summaryValue}>{totals.totalQty}</Text>
                    </View>
                    <View style={styles.totalsSummaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal:</Text>
                        <Text style={styles.summaryValue}>${totals.totalSubtotal?.toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalsSummaryRow}>
                        <Text style={styles.summaryLabel}>Tax:</Text>
                        <Text style={styles.summaryValue}>${totals.totalTax?.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.totalsSummaryRow, styles.finalTotal]}>
                        <Text style={styles.finalTotalLabel}>Total:</Text>
                        <Text style={styles.finalTotalValue}>${totals.totalAmount?.toFixed(2)}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.background,
        paddingTop: 12,
    },
    reportTitle: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 12
    },
    totalsSectionHeader: {
        backgroundColor: themeColors.primary,
        padding: 10,
    },
    locationCard: {
        backgroundColor: themeColors.backgroundThree,
        borderRadius: 4,
        margin: 12,
        overflow: 'hidden',
        elevation: 1,
    },
    majorSectionSpacing: {
        marginTop: 16,
    },
    sectionCard: {
        backgroundColor: themeColors.backgroundThree,
        borderRadius: 8,
        marginBottom: 12,
        overflow: 'hidden',
        elevation: 2,
    },
    sectionHeader: {
        backgroundColor: themeColors.secondary,
        padding: 10,
    },
    sectionHeaderText: {
        color: themeColors.headerTitle,
        fontSize: 16,
        fontWeight: '500',
    },
    itemRow: {
        flexDirection: 'row',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: themeColors.background,
    },
    leftColumn: {
        flex: 1,
        paddingRight: 8,
    },
    rightColumn: {
        flex: 1,
        alignItems: 'flex-end',
    },
    productName: {
        fontSize: 16,
        fontWeight: '500',
        color: themeColors.text,
        marginBottom: 4,
    },
    variantText: {
        fontSize: 14,
        color: themeColors.textLight,
    },
    quantityText: {
        fontSize: 14,
        color: themeColors.textLight,
        marginTop: 4,
    },
    valueRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
        minWidth: 150,
    },
    label: {
        fontSize: 14,
        color: themeColors.textLight,
    },
    value: {
        fontSize: 14,
        color: themeColors.text,
        fontWeight: '500',
        marginLeft: 8,
    },
    totalRow: {
        marginTop: 4,
        paddingTop: 4,
        borderTopWidth: 1,
        borderTopColor: themeColors.background,
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: themeColors.text,
    },
    totalValue: {
        fontSize: 14,
        fontWeight: '600',
        color: themeColors.primary,
        marginLeft: 8,
    },
    dayTotalsCard: {
        padding: 16,
    },
    totalsSummaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    summaryLabel: {
        fontSize: 16,
        color: themeColors.text,
    },
    summaryValue: {
        fontSize: 16,
        color: themeColors.text,
        fontWeight: '500',
    },
    finalTotal: {
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: themeColors.background,
    },
    finalTotalLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: themeColors.text,
    },
    finalTotalValue: {
        fontSize: 18,
        fontWeight: '600',
        color: themeColors.primary,
    },
});

export default SalesReport;