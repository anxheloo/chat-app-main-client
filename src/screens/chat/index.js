import React, { useEffect } from "react";
import { useAppStore } from "../../store";
import { useNavigate } from "react-router-dom";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";

const Chat = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      alert("Please set up profile to continue.");
      navigate("/profile");
    }
  }, [navigate, userInfo.profileSetup]);

  return (
    <div className="flex h-screen text-white overflow-hidden">
      <ContactsContainer></ContactsContainer>
      <EmptyChatContainer></EmptyChatContainer>
      <ContactsContainer></ContactsContainer>
    </div>
  );
};

export default Chat;
