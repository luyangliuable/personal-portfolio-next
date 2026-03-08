import { useEffect, useState } from "react";
import { throttle } from "../components/Utility/AnimationUtility";

interface IAppStateInterface {
    scrollY?: number;
    scrolling?: boolean;
    deltaScrollCalculation?: {
        lastRecordedScrollY: number;
        deltaScrolled: number;
    };
}

const useScrollPosition = (overrideThrottleInterval?: number) => {
    const [appState, setAppState] = useState<IAppStateInterface>({});

    useEffect(() => {
        let scrollTimeout: NodeJS.Timeout;
        const timeToCheckScrollingHasStoppedMiliseconds = 50;

        const updateScrollingState = (scrolling: boolean) => {
            setAppState((prevState) => ({
                ...prevState,
                scrolling,
            }));
        };

        const handleScroll = () => {
            clearTimeout(scrollTimeout);
            setAppState((prevState) => ({
                ...prevState,
                scrollY: globalThis.scrollY,
                scrolling: true,
            }));
            scrollTimeout = setTimeout(
                () => updateScrollingState(false),
                timeToCheckScrollingHasStoppedMiliseconds,
            );
        };

        const throttledHandleScroll = throttle(
            handleScroll,
            overrideThrottleInterval ?? 10,
        );
        globalThis.addEventListener("scroll", throttledHandleScroll);

        const deltaScrollCalculationInterval: NodeJS.Timeout = setInterval(
            () => {
                setAppState((prevState) => {
                    const deltaScrolled =
                        globalThis.scrollY -
                        Math.max(
                            0,
                            prevState.deltaScrollCalculation
                                ?.lastRecordedScrollY ?? 0,
                        );
                    if (
                        prevState.deltaScrollCalculation?.deltaScrolled ===
                        deltaScrolled
                    )
                        return prevState;
                    return {
                        ...prevState,
                        deltaScrollCalculation: {
                            ...prevState.deltaScrollCalculation,
                            lastRecordedScrollY: globalThis.scrollY,
                            deltaScrolled: deltaScrolled,
                        },
                    };
                });
            },
            400,
        );

        return () => {
            globalThis.removeEventListener("scroll", throttledHandleScroll);
            clearTimeout(scrollTimeout);
            clearInterval(deltaScrollCalculationInterval);
        };
    }, []);

    return appState;
};

export default useScrollPosition;
