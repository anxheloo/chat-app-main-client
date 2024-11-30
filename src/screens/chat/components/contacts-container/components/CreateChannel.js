import React, { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { apiClient } from "../../../../../lib/api-client";
import { CREATE_CHANNEL, GET_ALL_CONTACTS, SEARCH } from "../../../../../lib/utils";
import { useAppStore } from "../../../../../store";
import { IoIosCloseCircle } from "react-icons/io";

const CreateChannel = () => {
  const updateKeys = useAppStore((state) => state.updateKeys);
  const updateFuncChat = useAppStore((state) => state.updateFuncChat);
  const channels = useAppStore((state) => state.channels);
  const [openChannelModel, setOpenChannelModel] = useState(false);

  // const updateFuncChat = useAppStore(state => state.updateFuncChat)
  const [searchedContact, setSearchedContact] = useState("");
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");
  const [contactsIsShown, setContactsIsShown] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await apiClient.get(GET_ALL_CONTACTS, {
          withCredentials: true,
        });

        if (res.status === 200) {
          setAllContacts(res.data.contacts);
        }
      } catch (err) {
        updateKeys({ status: "error", message: "Something went wrong" });
        console.log("err:", err);
      }
    };

    getData();
  }, []);

  const createChannel = async () => {

    try{
      if(channelName.length > 0 && selectedContacts.length > 0){
        const res = await apiClient.post(CREATE_CHANNEL,{name: channelName, members: selectedContacts.map( contact => contact.value)}, {withCredentials: true})

      if(res.status === 201){
        setChannelName("")
        setSelectedContacts([])
        setOpenChannelModel(false)
        updateFuncChat({channels: [...channels, res.data.channel]})
        updateKeys({status: "success", message: "Channel created successfully"})
      }
      }else{
        updateKeys({status: "error", message: "Please complete given fields."})
      }

    }catch(error){
      updateKeys({ status: "error", message: error.message });
    }
  };

  const removeMember = (value) => {
    setSelectedContacts((prev) => prev.filter((item) => item.value !== value));
    // setFocus(false);
  };

  return (
    <>
      <div
        className="group cursor-pointer relative text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 transition-all duration-300"
        onClick={() => setOpenChannelModel(true)}
      >
        <CiCirclePlus />
        <span className="group-hover:block hidden text-white text-[12x] absolute -top-6 -left-10 text-nowrap">
          Create channel.
        </span>
      </div>

      {openChannelModel && (
        <div
          className="absolute inset-0 bg-black/30 flex items-center justify-center p-3"
          onClick={() => setOpenChannelModel(false)}
        >
          <div
            className="w-full max-w-[400px] h-fit min-h-[400px] bg-[#181920] border-none text-white flex flex-col justify-between px-2 py-3 gap-3"
            onClick={(e) => {
              e.stopPropagation();
              setContactsIsShown(false)
            }}
          >
            <div className="space-y-2">
              <div className="font-bold text-center">
                Please fill up the details for new channel.
              </div>
              <input
                required
                type="text"
                id="channelName"
                className="rounded-lg p-4 bg-[#2c2e3b] border-none w-full"
                placeholder="Channel Name"
                onChange={(e) => setChannelName(e.target.value)}
                value={channelName}
              />
            </div>

            <div className="flex-1 relative">
              <div className="rounded-lg p-5 bg-[#2c2e3b] border-none w-full flex flex-wrap gap-2">
                {selectedContacts.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between px-1 h-[30px] w-full max-w-[48%] bg-[#8417ff] rounded-2xl"
                  >
                    <div className="size-4 white rounded-full"></div>

                    <div className="!text-black">{item.label}</div>

                    <IoIosCloseCircle
                      className=" size-5 cursor-pointer"
                      onClick={() => removeMember(item.value)}
                    />
                  </div>
                ))}
                <input
                  required
                  type="text"
                  id="members"
                  className="flex flex-1 min-w-[49%] bg-transparent outline-none "
                  placeholder="Search Contacts"
                  onChange={(e) => setSearchedContact(e.target.value)}
                  onClick={(e)=>{
                    e.stopPropagation();
                    setContactsIsShown(prev => !prev)
                  }}
                />
              </div>

              {contactsIsShown && <div className="absolute w-full bg-black overflow-y-scroll flex flex-col gap-2 top-20 bottom-0 p-1 rounded-md">
                {allContacts.length > 0 ? (
                  allContacts.filter(el => el.label.includes(searchedContact)).map((contact) => (
                    <li
                      className="text-white list-none p-1 bg-[#181920]/50 cursor-pointer rounded-lg hover:bg-[#181920]"
                      key={contact.value}
                      onClick={() =>
                       {
                        const existingContact = selectedContacts.some( el => el.value === contact.value)
                        if(existingContact){
                          updateKeys({status:"error", message:"Contact already added"})
                          return;
                        }
                        setSelectedContacts((prev) => [...prev, contact]);
                        setContactsIsShown(false)
                       }
                      }
                    >
                      {contact.label}
                    </li>
                  ))
                ) : (
                  <p>there are no contacts</p>
                )}
              </div>}
            </div>

            <button
              type="button"
              className="bg-[#8417ff] text-white w-full text-center p-3 cursor-pointer rounded-lg"
              onClick={createChannel}
            >
              Create
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateChannel;
