import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

const TriggerContext = createContext<{ trigger: boolean; toggleTrigger: () => void } | undefined>(undefined);

export const TriggerProvider = ({ children }: { children: ReactNode }) => {
    const [trigger, setTrigger] = useState(false);

    const toggleTrigger = useCallback(() => {
        setTrigger(prev => !prev);
    }, []);

    return (
        <TriggerContext.Provider value={{ trigger, toggleTrigger }}>
            {children}
        </TriggerContext.Provider>
    );
};

export const useTrigger = () => {
    const context = useContext(TriggerContext);
    if (!context) {
        throw new Error('useTrigger must be used within a TriggerProvider');
    }
    return context;
};
