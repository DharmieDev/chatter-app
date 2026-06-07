import { createStore } from "zustand/vanilla";
import { Session, User } from "@supabase/supabase-js";


export type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

export type AuthAction = {
  setAuth: (session: Session | null, user: User | null) => void
  setLoading: (isLoading: boolean) => void
}

export type AuthStore = AuthState & AuthAction

export const defaultAuthState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
}

export const createAuthStore = (initialState: AuthState = defaultAuthState) =>{
  return createStore<AuthStore>()((set) => ({
    ...initialState,
    setAuth: (session, user) => set({ session, user, isLoading: false }),
    setLoading: (isLoading) => set({isLoading})
  }))
}

