"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
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
    const currentPathRef = useRef(pathname);

    // Update previousPath if pathname changes
    if (currentPathRef.current !== pathname) {
        setPreviousPath(currentPathRef.current);
        currentPathRef.current = pathname;
    }

    return (
        <NavigationContext.Provider value={{ previousPath }}>
            {children}
        </NavigationContext.Provider>
    );
}

export const useNavigation = () => useContext(NavigationContext);
