import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    ReactNode,
    memo,
} from "react";
const TriggerContext = createContext<
    { trigger: boolean; toggleTrigger: () => void } | undefined
>(undefined);

const TriggerProvider = memo(({ children }: { children: ReactNode }) => {
    const [trigger, setTrigger] = useState(false);

    const toggleTrigger = useCallback(() => {
        setTrigger((prev) => !prev);
    }, []);

    const value = useMemo(
        () => ({ trigger, toggleTrigger }),
        [trigger, toggleTrigger],
    );

    return (
        <TriggerContext.Provider value={value}>
            {children}
        </TriggerContext.Provider>
    );
});

const useTrigger = () => {
    const context = useContext(TriggerContext);
    if (!context) {
        throw new Error("useTrigger must be used within a TriggerProvider");
    }
    return context;
};

TriggerProvider.displayName = "TriggerProvider";

export { useTrigger, TriggerProvider };
