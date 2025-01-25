
export const GetDaysAgo = (days: number) => {
    const oneDayMs = 1000 * 60 * 60 * 24;
    return new Date(new Date().getTime() - (oneDayMs * days));
}

export interface MonthYearViewModel {
    year: number;
    month: number;
}

export const GetLastMonthOneIndexed = () : MonthYearViewModel => {
    const today = new Date(2025, 0, 1); // January 1, 2025
    const currentMonth = today.getMonth() + 1; // Convert 0-based to 1-based
    const currentYear = today.getFullYear();

    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    return {
        month: lastMonth,
        year: lastMonthYear,
    }
}

export const GetRecentMonthYearOptions = (): MonthYearViewModel[] => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const options: MonthYearViewModel[] = [];

    let month = currentMonth;
    let year = currentYear;

    for (let i = 0; i < 25; i++) {
        options.push({ year, month });

        month--;
        if (month === 0) {
            month = 12;
            year--;
        }
    }

    return options;
};

export const GetDateRangeForMonth = (monthYear: MonthYearViewModel): {
    firstDay: Date,
    lastDay: Date
} => {
    const firstDay = new Date(monthYear.year, monthYear.month - 1, 1);
    const lastDay = new Date(monthYear.year, monthYear.month, 0);

    return {
        firstDay,
        lastDay
    };
};

export const getStartOfDay = (date: Date): number => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start.getTime();
};

export const getEndOfDay = (date: Date): number => {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end.getTime();
}

export const getTimestampRange = (date: Date): { startTimestamp: number, endTimestamp: number } => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return {
        startTimestamp: start.getTime(),
        endTimestamp: end.getTime()
    };
}