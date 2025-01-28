import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { themeColors } from "@/constants/theme-colors";
import SaleLineModel from "@/services/local-data/models/sale-line-model";
import database from "@/services/local-data/context";
import SalesReport from "@/app/(tabs)/reporting/sales-report";
import {GetDaysAgo, getEndOfDay, getStartOfDay} from "@/utils/date-utils";
import DatePicker from "@/components/ui/inputs/input-types/date-picker-input";
import {
    groupAggregatedSalesByProduct,
    ProductGroupedAggregatedSaleLineModel
} from "@/services/local-data/views/reporting/sales/product-sales-report-view";
import {
    groupAggregatedSalesByLocation,
    LocationGroupedAggregatedSaleLineModel
} from "@/services/local-data/views/reporting/sales/location-sales-report-view";
import {
    SaleAggregationTotals,
    totalAggregatedSales
} from "@/services/local-data/views/reporting/sales/total-sales-report-view";

const DateRangeReport = () => {
    const [startDate, setStartDate] = useState(GetDaysAgo(30));
    const [endDate, setEndDate] = useState(new Date());

    const [reportStartDate, setReportStartDate] = useState<Date | null>(null);
    const [reportEndDate, setReportEndDate] = useState<Date | null>(null);

    const [showReport, setShowReport] = useState(false);
    const [salesGroupedByLocation, setSalesGroupedByLocation] =
        useState<LocationGroupedAggregatedSaleLineModel[]>([]);
    const [salesGroupedByProduct, setSalesGroupedByProduct] =
        useState<ProductGroupedAggregatedSaleLineModel[]>([]);
    const [salesTotals, setSalesTotals] =
        useState<SaleAggregationTotals>({} as SaleAggregationTotals);

    const RunReport = async () => {
        const dayStart = getStartOfDay(startDate);
        var dayEnd = getEndOfDay(endDate);
        const reportData = await SaleLineModel.aggregatedSalesByDateRange(database, dayStart, dayEnd);

        setReportStartDate(startDate);
        setReportEndDate(endDate)
        setShowReport(true);
        setSalesGroupedByLocation(await groupAggregatedSalesByLocation(reportData));
        setSalesGroupedByProduct(await groupAggregatedSalesByProduct(reportData));
        setSalesTotals(await totalAggregatedSales(reportData));
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Date Range Report</Text>
            </View>
            <View style={styles.quickButtonSection}>
                <TouchableOpacity
                    onPress={() => {
                        setStartDate(GetDaysAgo(7))
                        setEndDate(new Date())
                    }}
                    style={styles.quickButton}
                >
                    <Text style={styles.quickButtonText}>Week</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        setStartDate(GetDaysAgo(30))
                        setEndDate(new Date())
                    }}
                    style={styles.quickButton}
                >
                    <Text style={styles.quickButtonText}>30 Days</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        setStartDate(GetDaysAgo(90))
                        setEndDate(new Date())
                    }}
                    style={styles.quickButton}
                >
                    <Text style={styles.quickButtonText}>90 Days</Text>
                </TouchableOpacity>
            </View>


            <View style={styles.dateSection}>
                <View style={styles.dateRangeContainer}>
                    <View style={styles.dateRangeInputContainer}>
                        <DatePicker
                            selectedDate={startDate}
                            onDateChange={setStartDate}
                            label={"Start Date"}
                        />
                    </View>
                    <View style={styles.dateRangeInputContainer}>
                        <DatePicker
                            selectedDate={endDate}
                            onDateChange={setEndDate}
                            label={"End Date"}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    onPress={RunReport}
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
                        title={`${reportStartDate?.toLocaleDateString()} - ${reportEndDate?.toLocaleDateString()} Report`}
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
    quickButtonSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingTop: 8,
        gap: 8,
    },
    quickButton: {
        flex: 1,
        backgroundColor: themeColors.secondary,
        borderRadius: 12,
        padding: 8,
        alignItems: 'center',
    },
    quickButtonText: {
        color: themeColors.headerTitle,
        fontSize: 14,
        fontWeight: '600',
    },
    dateSection: {
        padding: 12,
        gap: 8,
    },
    runReportButton: {
        backgroundColor: themeColors.primaryTwo,
        borderRadius: 12,
        padding: 8,
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
    dateRangeContainer: {
        flexDirection: 'row',
    },
    dateRangeInputContainer: {
        width: '49%'
    }
});

export default DateRangeReport;