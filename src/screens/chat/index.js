import React, { useEffect } from "react";
import { useAppStore } from "../../store";
import { useNavigate } from "react-router-dom";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  console.log("Inside chat component");
  const { userInfo,updateKeys,selectedChatType } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      // alert("Please set up profile to continue.");
      updateKeys({ status: "error", message: "Please set up profile to continue." });
      navigate("/profile");
    }
  }, [navigate, updateKeys, userInfo.profileSetup]);
  
  return (
    <div className=" flex h-screen text-white overflow-hidden">
      <ContactsContainer/>
      {
        !selectedChatType ?  <EmptyChatContainer/> : <ChatContainer />
      }
    </div>
  );
};

export default Chat;
