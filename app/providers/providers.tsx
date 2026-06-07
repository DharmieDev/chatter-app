"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AuthStore, createAuthStore } from "../store/AuthStore";
import { createClient } from "@/lib/supabase/client";
import { useStore } from "zustand"

export const AuthStoreContext = createContext<ReturnType<typeof createAuthStore> | undefined>(undefined)

export default function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createAuthStore> | undefined>(undefined)
  const [supabase] = useState(() => createClient())

  if (!storeRef.current) {
    storeRef.current = createAuthStore()
  }

  useEffect(() => {
    const store = storeRef.current!

    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      store.getState().setAuth(session, session?.user ?? null)
    }
    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        store.getState().setAuth(session, session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  },[supabase])
  
  return (
    <AuthStoreContext.Provider value={storeRef.current}>
      {children}
    </AuthStoreContext.Provider>
  );
}

export const useAuth = <T,>(selector: (store: AuthStore) => T): T => {
  const context = useContext(AuthStoreContext)
  if (!context) {
    throw new Error("useAuth must be used within a Provider")
  }
  return useStore(context, selector)
}