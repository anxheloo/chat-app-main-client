import { create } from "zustand";

// Auth Slice
const createAuthSlice = (set) => ({
  userInfo: undefined,
  setUserInfo: (newInfo) => set({ userInfo: newInfo }),
});

// Status Slice
const createStatusSlice = (set) => ({
  status: null,
  message: null,

  updateKeys: (newkeys) => set(newkeys),
});

// Combined Store
export const useAppStore = create((...args) => ({
  ...createAuthSlice(...args),
  ...createStatusSlice(...args),
}));
