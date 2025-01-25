import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { themeColors } from "@/constants/theme-colors";
import {faCalendar, faChevronDown} from '@fortawesome/free-solid-svg-icons'; // Import the icons you want to use
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

interface DatePickerProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    label?: string;  // optional prop for customizing the label
}

const DatePicker: React.FC<DatePickerProps> = ({
                                                   selectedDate,
                                                   onDateChange,
                                                   label = "Selected Date",  // default value
                                               }) => {
    const [show, setShow] = useState(false);

    const formatDisplayDate = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        };
        return date.toLocaleDateString('en-US', options);
    };

    const onChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || new Date();
        setShow(Platform.OS === 'ios');
        onDateChange(currentDate);
    };

    const showDatepicker = () => {
        setShow(true);
    };


    return (
        <View>
            <TouchableOpacity
                onPress={showDatepicker}
                style={styles.dateButton}
            >
                <View style={styles.dateButtonContent}>
                    <Text style={styles.iconContainer}>
                        <FontAwesomeIcon icon={faCalendar} size={24} color={themeColors.secondary} />
                    </Text>
                    <View style={styles.dateTextContainer}>
                        <Text style={styles.dateLabel}>{label}</Text>
                        <Text style={styles.dateValue}>{formatDisplayDate(selectedDate)}</Text>
                    </View>
                    <Text style={styles.iconContainer}>
                        <FontAwesomeIcon icon={faChevronDown} size={24} color={themeColors.secondary} />
                    </Text>
                </View>
            </TouchableOpacity>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={onChange}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({

    dateButton: {
        backgroundColor: themeColors.backgroundThree,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: themeColors.borders,
        padding: 6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    dateButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconContainer: {
        width: 24,
        height: 24,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    dateTextContainer: {
        flex: 1,
        marginHorizontal: 12,
    },
    dateLabel: {
        fontSize: 14,
        color: themeColors.textLight,
        marginBottom: 2,
    },
    dateValue: {
        fontSize: 16,
        fontWeight: '600',
        color: themeColors.text,
    },

});

export default DatePicker;