import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useAuthUserStore = create(
  persist(
    (set) => ({
      authUser: null,
      setAuthUser: (user) => set(() => ({ authUser: user })),
      clearAuthUser: () => set({ authUser: null }),
    }),
    {
      name: "atdms-auth-user",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
