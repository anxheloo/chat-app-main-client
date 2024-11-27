import React from "react";
import { IoIosClose } from "react-icons/io";
import { useAppStore } from "../../../../../store";
import { HOST } from "../../../../../lib/utils";
import { getColor } from "../../../../../utils/constants";

const Header = () => {
  const updateFuncChat = useAppStore(state => state.updateFuncChat)
  const selectedChatData = useAppStore(state => state.selectedChatData)
  const selectedChatType = useAppStore(state => state.selectedChatType)

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303d] flex items-center justify-between px-3">
      <div className="flex gap-5 items-center">
        <div className="flex gap-3 items-center justify-center">
          <div className="size-12 rounded-full overflow-hidden">
            <>
              {selectedChatData.image ? (
                <img
                  src={`${HOST}/${selectedChatData.image}`}
                  alt="avatar"
                  className="w-full h-full object-cover bg-black"
                />
              ) : (
                <div
                  className={` uppercase w-full h-full text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedChatData.color
                  )}`}
                >
                  {selectedChatData.firstName
                    ? selectedChatData?.firstName?.split("").shift()
                    : selectedChatData?.email?.split("").shift()}
                </div>
              )}
            </>
          </div>
          {selectedChatType === "contact" && selectedChatData.firstName ? `${selectedChatData.firstName} ${selectedChatData.lastName}` : selectedChatData.email}
        </div>
      </div>
        <div className="flex items-center gap-5 justify-center">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all cursor-pointer"
            onClick={() =>
              updateFuncChat({
                selectedChatType: null,
                selectedChatData: null,
                selectedChatMessages: [],
              })
            }
          >
            <IoIosClose className="text-3xl pointer-events-none" />
          </button>
        </div>
    </div>
  );
};

export default Header;
