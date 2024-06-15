import { Models } from 'react-native-appwrite';
import { create } from 'zustand';

interface BearState {
    document: Models.Document | null;
    session: Models.Session | null;
    setSession: (session: Models.Session) => void;
    getSession: () => Models.Session | null;
    setDocument: (session: Models.Document) => void;
    getDocument: () => Models.Document | null;
}

const useUserSessionStore = create<BearState>((set, get) => ({
    session: null,
    document: null,
    setSession: (session: Models.Session) => set({ session }),
    getSession: () => get().session,
    setDocument: (document: Models.Document) => set({ document }),
    getDocument: () => get().document,
}));

export default useUserSessionStore;
