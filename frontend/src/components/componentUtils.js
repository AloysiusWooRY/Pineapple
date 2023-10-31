import { DateTime } from 'luxon';

// Converts spaces to dashes, removes special characters and lowercases the string
export const textNerfer = (input) => {
    return input.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
}

export function FormatDateTime(InputDateTime, FormatString = 'DD h:mma') {
    return DateTime
        .fromISO(InputDateTime)
        .toFormat(FormatString);
}
