import { DateTime } from 'luxon';

// Converts spaces to dashes, removes special characters and lowercases the string
export const textNerfer = (input) => {
    return input.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
}

export function constructResourceURL(path) {
    return `url(http://localhost:4000/${path}`.replace(/%([^ ]+)/g, (match, group) => `%25${group}`);;
}

export function FormatDateTime(InputDateTime, FormatString = 'DD h:mma') {
    return DateTime
        .fromISO(InputDateTime)
        .toFormat(FormatString);
}

export function databaseDateTimeToISO(databaseDateTime) {
    return DateTime
        .fromISO(databaseDateTime)
        .toFormat('yyyy-MM-dd\'T\'HH:mm');
}

export function timeAgo(inputDateTime) {
    // Parse the input string to a DateTime object
    const inputTime = DateTime.fromISO(inputDateTime);

    // Get the current time
    const currentTime = DateTime.now();

    // Calculate the difference
    const diff = currentTime.diff(inputTime, ['years', 'months', 'days', 'hours', 'minutes', 'seconds']).toObject();

    // Determine the smallest time unit
    if (diff.years >= 1) {
        return `${Math.round(diff.years)} year${diff.years > 1 ? 's' : ''}`;
    } else if (diff.months >= 1) {
        return `${Math.round(diff.months)} month${diff.months > 1 ? 's' : ''}`;
    } else if (diff.days >= 1) {
        return `${Math.round(diff.days)} day${diff.days > 1 ? 's' : ''}`;
    } else if (diff.hours >= 1) {
        return `${Math.round(diff.hours)} hour${diff.hours > 1 ? 's' : ''}`;
    } else if (diff.minutes >= 1) {
        return `${Math.round(diff.minutes)} minute${diff.minutes > 1 ? 's' : ''}`;
    } else {
        return `${Math.round(diff.seconds)} second${diff.seconds > 1 ? 's' : ''}`;
    }
}