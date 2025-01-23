

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