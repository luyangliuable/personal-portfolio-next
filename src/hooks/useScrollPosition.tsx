import { useEffect, useState } from 'react';
import { throttle } from '../components/Utility/AnimationUtility';

interface IAppStateInterface {
    scrollY?: number,
    scrolling?: boolean,
    deltaScrollCalculation?: {
        lastRecordedScrollY: number,
        deltaScrolled: number,
    }
}

const useScrollPosition = () => {
    const [appState, setAppState] = useState<IAppStateInterface>({});

    useEffect(() => {
        let scrollTimeout: NodeJS.Timeout;
        const timeToCheckScrollingHasStoppedMiliseconds = 50;

        const handleScroll = () => {
            clearTimeout(scrollTimeout); // Clear the timeout to reset the end-of-scroll detection

            setAppState(prevState => ({
                ...prevState,
                scrollY: window.scrollY,
                scrolling: true
            }));

            // Check if the user has stopped scrolling after a certain time
            scrollTimeout = setTimeout(() => {
                setAppState(prevState => ({
                    ...prevState,
                    scrolling: false
                }));
            }, timeToCheckScrollingHasStoppedMiliseconds);
        };

        // Add the event listener
        window.addEventListener("scroll", throttle(handleScroll, 20));

        // Interval for calculating the delta scroll every timeIntervalCheckMiliseconds.
        const deltaScrollCalculationInterval: NodeJS.Timeout = setInterval(() => {
            setAppState(prevState => {
                const deltaScrolled = window.scrollY - Math.max(0, prevState.deltaScrollCalculation?.lastRecordedScrollY ?? 0);
                if (prevState.deltaScrollCalculation?.deltaScrolled === deltaScrolled) return prevState;
                return {
                    ...prevState,
                    deltaScrollCalculation: {
                        ...prevState.deltaScrollCalculation,
                        lastRecordedScrollY: window.scrollY,
                        deltaScrolled: deltaScrolled
                    }
                }
            });
        }, 400);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.clearTimeout(scrollTimeout);
            window.clearInterval(deltaScrollCalculationInterval);
        };
    }, []);

    return appState;
};

export default useScrollPosition;
