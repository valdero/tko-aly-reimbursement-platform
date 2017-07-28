export function hoursToMilliseconds(hours: number): number {
    return hours * 60 * 60 * 1000;
}

export function daysToMilliseconds(days: number): number {
    return days * 24 * 60 * 60 * 1000;
}

export function getWindow(): Window | undefined {
    return typeof window !== 'undefined'
        ? window
        : undefined;
}

export function getDocument(): Document | undefined {
    return typeof document !== 'undefined'
        ? document
        : undefined;
}
