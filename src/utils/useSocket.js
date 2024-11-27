import { useEffect } from "react";
import { useAppStore } from "../store";

export const useSocket = () => {
  console.log("Inside useSocket hook");

  const userInfo = useAppStore((state) => state.userInfo);
  const initializeSocket = useAppStore((state) => state.initializeSocket);
  const disconnectSocket = useAppStore((state) => state.disconnectSocket);
  
  useEffect(() => {

    console.log("Inside useEffect of useSocket hook");

    if (userInfo) {

     const socketInstance = initializeSocket();

      if (socketInstance) {

        const handleReceiveMessage = (message) => {

          const {
            selectedChatType,
            selectedChatData,
            updateFuncChat,
            selectedChatMessages,
          } = useAppStore.getState();
  
          if (
            selectedChatType !== undefined &&
            (selectedChatData?._id === message.sender._id ||
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
  
        socketInstance.on("receiveMessage", handleReceiveMessage);

      }
    }
  
    return () => disconnectSocket();
  }, [userInfo]);
  
};
