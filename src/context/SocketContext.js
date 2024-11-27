import { createContext, useContext, useEffect, useRef } from "react";
import { useAppStore } from "../store";
import { io } from "socket.io-client";
import { HOST } from "../lib/utils";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {   
        console.log("connected")
         });

      const handleReceiveMessage = (message) => {
        const {
          selectedChatType,
          selectedChatData,
          updateFuncChat,
          selectedChatMessages,
        } = useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          (selectedChatData?._id === message.sender_id ||
            selectedChatData?._id === message.recipient?._id)
        ) {
          console.log("message recived:", message);
          updateFuncChat({
            selectedChatMessages: [
              ...selectedChatMessages,
              {
                ...message,
                recipient:
                  selectedChatType === "channel"
                    ? message.recipient
                    : message.recipient._id,

                sender:
                  selectedChatType === "channel"
                    ? message.sender
                    : message.sender._id,
              },
            ],
          });
        }
      };

      socket.current.on("receiveMessage", handleReceiveMessage);

      return () => {
        socket.current?.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
