"use client";

import {
    createContext,
    useContext,
    useCallback,
    useMemo,
} from "react";

const LoadingActionsContext = createContext<
    | {
          incrementLoading: () => void;
          decrementLoading: () => void;
      }
    | undefined
>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const incrementLoading = useCallback(() => {}, []);
    const decrementLoading = useCallback(() => {}, []);

    const actions = useMemo(
        () => ({
            incrementLoading,
            decrementLoading,
        }),
        [incrementLoading, decrementLoading]
    );

    return (
        <LoadingActionsContext.Provider value={actions}>
            {children}
        </LoadingActionsContext.Provider>
    );
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
