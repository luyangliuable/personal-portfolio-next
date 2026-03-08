export function throttle<T extends (...args: any[]) => void>(
    func: T,
    limit: number,
): (...args: Parameters<T>) => void {
    let lastFunc: ReturnType<typeof setTimeout> | undefined;
    let lastRan: number;

    return (...args: Parameters<T>) => {
        if (lastRan === undefined) {
            func(...args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = globalThis.setTimeout(
                () => {
                    if (Date.now() - lastRan >= limit) {
                        func(...args);
                        lastRan = Date.now();
                    }
                },
                limit - (Date.now() - lastRan),
            );
        }
    };
}

export function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number,
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    return function (...args: Parameters<T>) {
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, wait);
    };
}
