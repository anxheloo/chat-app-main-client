import React, { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../../../../store";
import moment from "moment";
import { apiClient } from "../../../../../lib/api-client";
import { GET_ALL_MESSAGES, HOST } from "../../../../../lib/utils";
import { GoFileZip } from "react-icons/go";
import { MdDownloadForOffline } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";

const MessageContainer = () => {
  console.log("Inside MessageContainer");
  const scrollRef = useRef();

  const selectedChatType = useAppStore((state) => state.selectedChatType);
  const selectedChatData = useAppStore((state) => state.selectedChatData);
  const selectedChatMessages = useAppStore(
    (state) => state.selectedChatMessages
  );
  const updateFuncChat = useAppStore((state) => state.updateFuncChat);
  const updateKeys = useAppStore((state) => state.updateKeys);

  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  // get all messages
  useEffect(() => {
    const getAllMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES,
          { id: selectedChatData._id },
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          updateFuncChat({ selectedChatMessages: response.data.messages });
          console.log("These are messages:", response.data.messages);
        }
      } catch (error) {
        updateKeys({ status: "error", message: "Something went wrong!" });
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType === "contact") getAllMessages();
    }
  }, [selectedChatData, selectedChatType]);

  // scroll to the new added message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  // check if the file is image
  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  // main render function
  const renderMessages = () => {
    let lastDate = null;

    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");

      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {showDate && (
            <div className=" text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDmMessages(message)}
        </div>
      );
    });
  };

  // const downloadFile = async(url) =>{

  //   const res = await apiClient.get(`${HOST}/${url}`, {responseType: "blob"})

  //   const urlBlob = window.URL.createObjectURL( new Blob([res.data]));
  //   const link = document.createElement("a")
  //   link.href = urlBlob
  //   link.setAttribute("download", url.split("/").pop())

  //   document.body.appendChild(link);
  //   link.click()
  //   link.remove();
  //   window.URL.revokeObjectURL(urlBlob)
  // }

  const downloadFile = async (url) => {
    updateFuncChat({ isDownloading: true, fileDownloadProgress: 0 });
    // Step 1: Fetch the file data
    console.log("Starting file download...");
    const res = await apiClient.get(`${HOST}/${url}`, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentageCompleted = Math.round((loaded * 100) / total);
        updateFuncChat({ fileDownloadProgress: percentageCompleted });
      },
    });
    console.log("File fetched from server:", res);

    // Step 2: Create a Blob URL
    const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
    console.log("Blob URL created:", urlBlob);

    // Step 3: Create an <a> element
    const link = document.createElement("a");
    console.log("Anchor element created:", link);

    // Step 4: Set the href to the Blob URL
    link.href = urlBlob;

    // Step 5: Extract the filename from the URL and set it as the download attribute
    const fileName = url.split("/").pop();
    link.setAttribute("download", fileName);
    console.log("Filename set for download:", fileName);

    // Step 6: Append the <a> element to the document body
    document.body.appendChild(link);
    console.log("Anchor element appended to the document body.");

    // Step 7: Programmatically click the <a> element to trigger download
    link.click();
    console.log("Click triggered on the anchor element.");

    // Step 8: Remove the <a> element from the DOM
    link.remove();
    console.log("Anchor element removed from the document.");

    // Step 9: Revoke the Blob URL to free up memory
    window.URL.revokeObjectURL(urlBlob);
    console.log("Blob URL revoked to release memory.");

    updateFuncChat({ isDownloading: false, fileDownloadProgress: 0 });
  };

  // render conditions
  const renderDmMessages = (message) => (
    <div
      className={`py-2 ${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-white/20"
          } border inline-block p-4 rounded max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      )}

      {message.messageType === "file" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-white/20"
          } border inline-block p-4 rounded max-w-[50%] break-words`}
        >
          {checkIfImage(message.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageUrl(message.fileUrl);
              }}
            >
              <img
                src={`${HOST}/${message.fileUrl}`}
                alt="file display"
                className=" size-[300px]"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className="tet-white/80 text-3xl bg-black/20 rounded-full p-3">
                <GoFileZip />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span
                className="text-3xl cursor-pointer hover:opacity-80"
                onClick={() => downloadFile(message.fileUrl)}
              >
                <MdDownloadForOffline />
              </span>
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef}></div>

      {showImage && (
        <div className="fixed inset-0 z-20 flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`${HOST}/${imageUrl}`}
              alt="file display"
              className=" w-full h-full max-h-[80vh] bg-cover"
            />
          </div>

          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="text-3xl cursor-pointer hover:opacity-80"
              onClick={() => downloadFile(imageUrl)}
            >
              <MdDownloadForOffline />
            </button>
            <button
              className="text-3xl cursor-pointer hover:opacity-80"
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}
            >
              <IoMdCloseCircle />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
