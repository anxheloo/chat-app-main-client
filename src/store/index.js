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

const chatSlice = (set,get) => ({
  selectedChatType: null,
  selectedChatData: null,
  // existing messages
  selectedChatMessages: [],
  directMessagesContacts: [],
  // uploading state
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress:0,
  // channels
  channels: [],
  updateFuncChat: (typeOrData) => set(typeOrData),

  sortChannelByLastConversation: (message) =>{
    const channels = [...get().channels];
    const data = channels.find( channel => channel._id === message.channelId);
    const index = channels.findIndex( channel => channel._id === message.channelId);
    if(index !== -1 && index !== undefined){
      channels.splice(index,1)
      channels.unshift(data)
      set({channels: channels})
    }
  },

  sortContactsByLastConversation: (message) =>{
    const userId = get().userInfo.id;
    const fromId = message.sender._id === userId ? message.recipient._id : message.sender._id;
    const fromData = message.sender._id === userId ? message.recipient : message.sender;
    const contacts = [...get().directMessagesContacts];
    const data = contacts.find( contact => contact._id === fromId);
    const index = contacts.findIndex( contact => contact._id === fromId);
    if(index !== -1 && index !== undefined){
      contacts.splice(index,1)
      contacts.unshift(data)
    }else{
      contacts.unshift(fromData)
    }
    set({directMessagesContacts: contacts})
  }
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
