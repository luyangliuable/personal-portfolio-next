import { useState } from "react";

const useScrollAnimation = () => {
    const [appState, setAppState] = useState<{}>({});

    return appState;
};

export default useScrollAnimation;
