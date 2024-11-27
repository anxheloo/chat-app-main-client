import React, { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { apiClient } from "../../../../../lib/api-client";
import { GET_ALL_CONTACTS, SEARCH } from "../../../../../lib/utils";
import { useAppStore } from "../../../../../store";
import { IoIosCloseCircle } from "react-icons/io";

const CreateChannel = () => {
  const updateKeys = useAppStore((state) => state.updateKeys);
  const [openChannelModel, setOpenChannelModel] = useState(false);

  // const updateFuncChat = useAppStore(state => state.updateFuncChat)
  const [searchedContact, setSearchContact] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");

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

  const createChannel = async () => {};

  const removeMember = (id) => {
    setSelectedContacts((prev) => prev.filter((item) => item.id !== id));
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
            className="w-full max-w-[400px] h-full max-h-[400px] bg-[#181920] border-none text-white flex flex-col px-2 py-3 gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-bold text-center">
              Please fill up the details for new channel.
            </div>
            <input
              required
              type="text"
              id="members"
              className="rounded-lg p-4 bg-[#2c2e3b] border-none w-full"
              placeholder="Search Contacts"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />

            {/* <div className="rounded-lg p-6 h-fit bg-[#2c2e3b] border-none w-full">
                <div className="flex gap-2 flex-nowrap items-center overflow-scroll menu px-1">
                  {selectedContacts.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between px-1 h-[30px] w-full min-w-[100px] bg-gray-100 rounded-2xl"
                    >
                      <div className="size-4 white rounded-full"></div>

                      <div className="!text-black">{item.name}</div>

                      <IoIosCloseCircle
                        className=" size-5 cursor-pointer"
                        onClick={() => removeMember(item.id)}
                      />
                    </div>
                  ))}
                </div>

                <input
                  required
                  type="text"
                  id="members"
                  className="flex flex-1 min-w-[40%] bg-transparent outline-none "
                  placeholder="Search Contacts"
                  onChange={(e) => setSearchContact(e.target.value)}
                />
              </div> */}
          </div>
        </div>
      )}
    </>
  );
};

export default CreateChannel;
