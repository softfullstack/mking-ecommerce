import { create } from 'zustand';

interface UIState {
    currentProductName: string | null;
    setProductName: (name: string | null) => void;
}

const useUIStore = create<UIState>((set) => ({
    currentProductName: null,
    setProductName: (name) => set({ currentProductName: name }),
}));

export default useUIStore;
