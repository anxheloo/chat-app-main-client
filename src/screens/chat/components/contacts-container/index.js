import React, { useEffect } from "react";
import ProfileInfo from "./components/Profile-Info";
import NewDm from "./components/NewDm";
import { apiClient } from "../../../../lib/api-client";
import { GET_CONTACTS_FOR_DM } from "../../../../lib/utils";
import { useAppStore } from "../../../../store";
import ContactList from "./components/ContactList";
import CreateChannel from "./components/CreateChannel";

const ContactsContainer = () => {

  const directMessagesContacts = useAppStore(state => state.directMessagesContacts)
  const updateFuncChat = useAppStore(state => state.updateFuncChat)

  useEffect(()=>{

    const getContacts = async()=>{

      const res = await apiClient.get(GET_CONTACTS_FOR_DM, {
        withCredentials:true
      })

      if(res.status === 200){
        console.log("This are contacts:", res.data.contacts)
        updateFuncChat({directMessagesContacts: [...res.data.contacts]})
      }

    }

    getContacts()

  },[updateFuncChat])

  console.log("INside contacts container");
  return <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
    <div className="p-3">
      Logo
    </div>
    
   <div className="my-5">
    <div className="flex items-center justify-between pr-10">
      <Title text={"Direct messages"} />
      <NewDm />
    </div>

    <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
    <ContactList contacts={directMessagesContacts}/>
    </div>

   </div>
   <div className="my-5">
    <div className="flex items-center justify-between pr-10">
      <Title text={"Channels"} />
      <CreateChannel />
    </div>
   </div>

   <ProfileInfo />
  </div>;
};

 
export default ContactsContainer;




const Title = ({text}) =>{
  return <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">{text}</h6>
}

