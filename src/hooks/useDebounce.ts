import { useEffect, useMemo, useRef } from "react";
import { debounce } from "../components/Utility/AnimationUtility";

/**
 * Hook that returns a debounced version of the provided callback function
 * @param callback - The function to debounce
 * @param delay - The debounce delay in milliseconds
 * @returns A debounced version of the callback that persists across re-renders
 */
export function useDebounce<T extends (...args: any[]) => void>(
    callback: T,
    delay: number,
): (...args: Parameters<T>) => void {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    return useMemo(() => {
        const debouncedFn = debounce(
            ((...args: Parameters<T>) => callbackRef.current(...args)) as (...args: any[]) => void,
            delay,
        );
        return debouncedFn as unknown as (...args: Parameters<T>) => void;
    }, [delay]);
}

export default useDebounce;
