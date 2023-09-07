import { createContext, useState } from "react";

export interface SidebarContextProps {
    sidebarActive: boolean;
    toggleSidebar: (active?: boolean) => void;
}

export const SidebarContext = createContext<SidebarContextProps>({
    sidebarActive: false,
    toggleSidebar: (active) => null
});

export function useSidebarContext() {
    const [sidebarActive, setSidebar] = useState(false);

    const toggleSidebar = (value?: boolean) => setSidebar(value || !sidebarActive);

    return { sidebarActive, toggleSidebar };
}