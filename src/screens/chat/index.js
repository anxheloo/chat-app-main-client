import React, { useEffect } from "react";
import { useAppStore } from "../../store";
import { useNavigate } from "react-router-dom";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  console.log("Inside chat component");

  const userInfo = useAppStore((state) => state.userInfo);
  const updateKeys = useAppStore((state) => state.updateKeys);
  const selectedChatType = useAppStore((state) => state.selectedChatType);
  const isUploading = useAppStore((state) => state.isUploading);
  const isDownloading = useAppStore((state) => state.isDownloading);
  const fileUploadProgress = useAppStore((state) => state.fileUploadProgress);
  const fileDownloadProgress = useAppStore(
    (state) => state.fileDownloadProgress
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      // alert("Please set up profile to continue.");
      updateKeys({
        status: "error",
        message: "Please set up profile to continue.",
      });
      navigate("/profile");
    }
  }, [navigate, updateKeys, userInfo.profileSetup]);

  return (
    <div className="flex h-screen text-white overflow-hidden">
      {isUploading && (
        <div className="w-[100vw] h-screen fixed z-20 inset-0 flex items-center gap-5 justify-center backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">Uploading File</h5>
          {fileUploadProgress}%
        </div>
      )}
      {isDownloading && (
        <div className="w-[100vw] h-screen fixed z-20 inset-0 flex items-center gap-5 justify-center backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">Downloading File</h5>
          {fileDownloadProgress}%
        </div>
      )}

      <ContactsContainer />
      {!selectedChatType ? <EmptyChatContainer /> : <ChatContainer />}
    </div>
  );
};

export default Chat;
