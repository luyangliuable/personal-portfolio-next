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
    const handleScroll = () => {
      clearTimeout(scrollTimeout); // Clear the timeout to reset the end-of-scroll detection
      setAppState((prevState) => ({
        ...prevState,
        scrollY: window.scrollY,
        scrolling: true,
      }));
      scrollTimeout = setTimeout(() => {
        setAppState((prevState) => ({
          ...prevState,
          scrolling: false,
        }));
      }, timeToCheckScrollingHasStoppedMiliseconds);
    };

    const throttledHandleScroll = throttle(
      handleScroll,
      overrideThrottleInterval ?? 10,
    );
    window.addEventListener("scroll", throttledHandleScroll);

    const deltaScrollCalculationInterval: NodeJS.Timeout = setInterval(() => {
      setAppState((prevState) => {
        const deltaScrolled =
          window.scrollY -
          Math.max(
            0,
            prevState.deltaScrollCalculation?.lastRecordedScrollY ?? 0,
          );
        if (prevState.deltaScrollCalculation?.deltaScrolled === deltaScrolled)
          return prevState;
        return {
          ...prevState,
          deltaScrollCalculation: {
            ...prevState.deltaScrollCalculation,
            lastRecordedScrollY: window.scrollY,
            deltaScrolled: deltaScrolled,
          },
        };
      });
    }, 400);

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
      window.clearTimeout(scrollTimeout);
      window.clearInterval(deltaScrollCalculationInterval);
    };
  }, []);

  return appState;
};

export default useScrollPosition;
