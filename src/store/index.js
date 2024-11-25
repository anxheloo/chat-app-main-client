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

const chatSlice = (set) => ({
  selectedChatType: null,
  selectedChatData: null,
  // existing messages
  selectedChatMessages: [],

  updateFuncChat: (typeOrData) => set(typeOrData),
});

// Combined Store
export const useAppStore = create((...args) => ({
  ...createAuthSlice(...args),
  ...createStatusSlice(...args),
  ...chatSlice(...args),
}));
