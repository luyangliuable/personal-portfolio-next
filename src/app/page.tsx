'use client';
import React, { useState, useEffect } from 'react';
import "./globals.css";
import LandingPage from '../pages/LandingPage/LandingPage';

interface IAppStateInterface {
    scrollY?: number,
    scrolling?: boolean,
    deltaScrollCalculation?: {
        lastRecordedScrollY: number,
        deltaScrolled: number,
    }
}

function App() {
    const [appState, setAppState] = useState<IAppStateInterface>({
    });

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

        window.addEventListener("scroll", handleScroll);

        const deltaScrollCalculationInterval: NodeJS.Timeout = setInterval(() => {
            setAppState(prevState => ({
                ...prevState,
                deltaScrollCalculation: {
                    ...prevState.deltaScrollCalculation,
                    lastRecordedScrollY: window.scrollY,
                    deltaScrolled: window.scrollY - Math.max(0, prevState.deltaScrollCalculation?.lastRecordedScrollY ?? 0)
                }
            }));
        }, 10);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.clearTimeout(scrollTimeout);
            window.clearInterval(deltaScrollCalculationInterval);
        };
    }, []);

    const deltaScrolled = appState.deltaScrollCalculation?.deltaScrolled;

    return (
        <div className="App">
            <LandingPage scrolled={0} scrolling={false} />
        </div>
    );
}

export default App;
