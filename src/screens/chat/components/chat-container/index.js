import React from "react";
import Header from "./components/Header";
import MessageContainer from "./components/MessageContainer";
import MessageBar from "./components/MessageBar";

const ChatContainer = () => {
  return <div className="fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1">
    <Header />
    <MessageContainer />
    <MessageBar />
  </div>;
};

export default ChatContainer;
