import { io } from "socket.io-client";
import { create } from "zustand";
import { HOST } from "../lib/utils";

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

// Socket Slice
const socketSlice = (set, get) => ({
  socket: null,
initializeSocket:() => {
  const { userInfo } = get();
  if (userInfo && !get().socket) {
    const socketInstance = io(HOST, {
      withCredentials: true,
      query: { userId: userInfo.id },
    });

    set({ socket: socketInstance });

    socketInstance.on("connect", () => {
      console.log("Connected to socket server");
    });

    return socketInstance;
  }
},

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
});

// Combined Store
export const useAppStore = create((...args) => ({
  ...createAuthSlice(...args),
  ...createStatusSlice(...args),
  ...chatSlice(...args),
  ...socketSlice(...args),
}));
