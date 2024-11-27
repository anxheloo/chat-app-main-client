import React, { useEffect, useRef, useState } from "react";
import { TiAttachment } from "react-icons/ti";
import { GrEmoji } from "react-icons/gr";
import { TbSend } from "react-icons/tb";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "../../../../../store";
import { useSocket } from "../../../../../context/SocketContext";

const MessageBar = () => {
  const { selectedChatType, selectedChatData, userInfo,socket } = useAppStore();

//   const socket = useSocket();

  const emojiRef = useRef();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [message, setMessage] = useState("");

  const addEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const sendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    }
  };

  useEffect(() => {
    const closeEmojiOnClickingOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", closeEmojiOnClickingOutside);

    return () => {
      document.removeEventListener("mousedown", closeEmojiOnClickingOutside);
    };
  }, [emojiRef]);

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter message"
        />
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
          <TiAttachment className="text-2xl" />
        </button>

        <div className="relative">
          <button
            onClick={() => setEmojiPickerOpen((prev) => !prev)}
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          >
            <GrEmoji className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={addEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>

      <button
        onClick={sendMessage}
        className=" bg-[#8417ff] hover:bg-[#741bda] rounded-md flex items-center justify-center p-5 text-white focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
      >
        <TbSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
