import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { themeColors } from "@/constants/theme-colors";
import SaleLineModel, {
    groupAggregatedSalesByLocation,
    groupAggregatedSalesByProduct,
    LocationGroupedAggregatedSaleLineModel,
    ProductGroupedAggregatedSaleLineModel,
    SaleAggregationTotals, totalAggregatedSales,
} from "@/services/local-data/models/sale-line-model";
import database from "@/services/local-data/context";
import SalesReport from "@/app/(tabs)/reporting/sales-report";
import {getEndOfDay, getStartOfDay} from "@/utils/date-utils";
import DatePicker from "@/components/ui/inputs/input-types/date-picker-input";

const OneDayReport = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [reportDate, setReportDate] = useState<Date | null>(null);
    const [showReport, setShowReport] = useState(false);
    const [salesGroupedByLocation, setSalesGroupedByLocation] =
        useState<LocationGroupedAggregatedSaleLineModel[]>([]);
    const [salesGroupedByProduct, setSalesGroupedByProduct] =
        useState<ProductGroupedAggregatedSaleLineModel[]>([]);
    const [salesTotals, setSalesTotals] =
        useState<SaleAggregationTotals>({} as SaleAggregationTotals);


    const EndOfDayReport = async () => {
        const dayStart = getStartOfDay(startDate);
        var dayEnd = getEndOfDay(startDate);
        const reportData = await SaleLineModel.aggregatedSalesByDateRange(database, dayStart, dayEnd);

        setReportDate(startDate);
        setShowReport(true);
        setSalesGroupedByLocation(await groupAggregatedSalesByLocation(reportData));
        setSalesGroupedByProduct(await groupAggregatedSalesByProduct(reportData));
        setSalesTotals(await totalAggregatedSales(reportData));
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Single Day Report</Text>
                <Text style={styles.headerSubtitle}>View sales data for a specific date</Text>
            </View>

            <View style={styles.dateSection}>
                <DatePicker
                    selectedDate={startDate}
                    onDateChange={setStartDate}
                />

                <TouchableOpacity
                    onPress={EndOfDayReport}
                    style={styles.runReportButton}
                >
                    <Text style={styles.runReportButtonText}>Generate Report</Text>
                </TouchableOpacity>
            </View>

            {showReport && (
                <View style={styles.reportContainer}>
                    <SalesReport
                        locationGroupedData={salesGroupedByLocation}
                        productGroupedData={salesGroupedByProduct}
                        totals={salesTotals}
                        title={`${reportDate?.toLocaleDateString()} Report`}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.background,
    },
    headerContainer: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: themeColors.backgroundThree,
        borderBottomWidth: 1,
        borderBottomColor: themeColors.borders,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: themeColors.text,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: themeColors.textLight,
    },
    dateSection: {
        padding: 12,
        gap: 8,
    },
    runReportButton: {
        backgroundColor: themeColors.primaryTwo,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    runReportButtonText: {
        color: themeColors.headerTitle,
        fontSize: 16,
        fontWeight: '600',
    },
    reportContainer: {
        flex: 1,
        paddingHorizontal: 12,
        backgroundColor: themeColors.backgroundThree,
    },
});

export default OneDayReport;