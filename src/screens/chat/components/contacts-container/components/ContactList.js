import React from "react";
import { useAppStore } from "../../../../../store";
import { HOST } from "../../../../../lib/utils";
import { getColor } from "../../../../../utils/constants";

const ContactList = ({ contacts, isChannel = false }) => {
  const selectedChatData = useAppStore((state) => state.selectedChatData);
  const updateFuncChat = useAppStore((state) => state.updateFuncChat);

  const handleClick = (contact) => {
    if (isChannel) updateFuncChat({ selectedChatType: "channel" });
    else updateFuncChat({ selectedChatType: "contact" });

    updateFuncChat({ selectedChatData: contact });

    if (selectedChatData && selectedChatData._id !== contact._id) {
      updateFuncChat({ selectedChatMessages: [] });
    }
  };

  return (
    <div className="mt-5 ">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer mb-2 ${
            selectedChatData && selectedChatData._id === contact._id ? "bg-[#8417ff]/50" : ""
          }  hover:bg-[#8417ff]`}
          onClick={()=>handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">

              {!isChannel &&
                <div className="size-10 rounded-full overflow-hidden">          
                    <>
                    {contact.image ? (
                        <img
                        src={`${HOST}/${contact.image}`}
                        alt="avatar"
                        className="w-full h-full object-cover bg-black"
                        />
                    ) : (
                        <div
                        className={` uppercase w-full h-full text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                            contact.color
                        )}`}
                        >
                        {contact.firstName
                            ? contact?.firstName?.split("").shift()
                            : contact?.email?.split("").shift()}
                        </div>
                    )}</>
                </div>
              }

            {isChannel && <div className="bg-[#ffffff22] h-10 w-10 rounded-full flex items-center justify-center text-white">#</div>}
            {isChannel ? <span>{contact.name}</span> : <span >{contact.firstName ? `${contact.firstName} ${contact.lastName}` : contact.email}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
