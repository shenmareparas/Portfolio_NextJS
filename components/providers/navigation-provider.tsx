"use client";

import { createContext, useContext, useState, useMemo } from "react";
import { usePathname } from "next/navigation";

const NavigationContext = createContext<{ previousPath: string | null }>({
    previousPath: null,
});

export function NavigationProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [previousPath, setPreviousPath] = useState<string | null>(null);
    const [currentPath, setCurrentPath] = useState(pathname);

    if (currentPath !== pathname) {
        setPreviousPath(currentPath);
        setCurrentPath(pathname);
    }

    const contextValue = useMemo(() => ({ previousPath }), [previousPath]);

    return (
        <NavigationContext.Provider value={contextValue}>
            {children}
        </NavigationContext.Provider>
    );
}

export const useNavigation = () => useContext(NavigationContext);
