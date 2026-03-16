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

    // Update ref when callback changes
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // Memoize the debounced function
    return useMemo(() => {
        const debouncedFn = debounce(
            (...args: any[]) => callbackRef.current(...(args as Parameters<T>)),
            delay,
        ) as (...args: Parameters<T>) => void;
        return debouncedFn;
    }, [delay]);
}

export default useDebounce;
