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
            sortContactsByLastConversation
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

          sortContactsByLastConversation(message)
        };

        const handleReceiveChannelMessage = (message) => {
          console.log("Received channel message:", message);

          const {
            selectedChatType,
            selectedChatData,
            updateFuncChat,
            selectedChatMessages,
            sortChannelByLastConversation
          } = useAppStore.getState();

          if (
            selectedChatType !== undefined &&
            selectedChatData?._id === message.channelId
          ) {
            console.log(" channel message recived:", message);
            updateFuncChat({
              selectedChatMessages: [...selectedChatMessages, message],
            });
          }
          
          sortChannelByLastConversation(message)
        };

        socketInstance.on("receiveMessage", handleReceiveMessage);
        socketInstance.on("receiveChannelMessage", handleReceiveChannelMessage);
      }
    }

    return () => disconnectSocket();
  }, [userInfo]);
};
