"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
} from "react";

const LoadingStateContext = createContext<number>(0);
const LoadingActionsContext = createContext<
    | {
          incrementLoading: (count?: number) => void;
          decrementLoading: (count?: number) => void;
      }
    | undefined
>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [loadingCount, setLoadingCount] = useState(0);

    const incrementLoading = useCallback((count = 1) => {
        setLoadingCount((prev) => prev + count);
    }, []);

    const decrementLoading = useCallback((count = 1) => {
        setLoadingCount((prev) => Math.max(0, prev - count));
    }, []);

    const actions = useMemo(
        () => ({
            incrementLoading,
            decrementLoading,
        }),
        [incrementLoading, decrementLoading]
    );

    return (
        <LoadingStateContext.Provider value={loadingCount}>
            <LoadingActionsContext.Provider value={actions}>
                {children}
            </LoadingActionsContext.Provider>
        </LoadingStateContext.Provider>
    );
}

export function useLoadingValue() {
    return useContext(LoadingStateContext);
}

export function useLoadingActions() {
    const context = useContext(LoadingActionsContext);
    if (context === undefined) {
        throw new Error(
            "useLoadingActions must be used within a LoadingProvider"
        );
    }
    return context;
}
