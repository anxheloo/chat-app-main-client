import React, { useCallback, useState } from 'react'
import { CiCirclePlus } from "react-icons/ci";
import Lottie from 'react-lottie';
import { animationDefaultOptions } from '../../../../../utils/constants';
import { apiClient } from '../../../../../lib/api-client';
import { SEARCH } from '../../../../../lib/utils';
import { useAppStore } from '../../../../../store';
import Contact from './Contact';

const NewDm = () => {

    const updateKeys = useAppStore(state => state.updateKeys)
    const updateFuncChat = useAppStore(state => state.updateFuncChat)

    const [openNewContactModel, setOpenNewContactModel] = useState(false)
    const [searchedContacts,setSearchContacts] = useState([]);


    const searchContact = async(searchTerm) => {

       if(searchTerm.length > 0) {
        const res = await apiClient.post(SEARCH,{searchTerm}, {
            withCredentials: true,
          });

          if(res.status === 200){
            console.log("these are contacts:", res.data.contacts)
            setSearchContacts(res.data.contacts);
        }else{
            console.log("error searching contacts")
            updateKeys({status: "success", error:res.data.message})
        }
       }else{
        setSearchContacts([])
       }

    }

    const selectContact = useCallback((contact) =>{
        setOpenNewContactModel(false);
        updateFuncChat({selectedChatType:"contact", selectedChatData: contact})
        setSearchContacts([])
    }
,[])

  return (
   <>
    <div className='group cursor-pointer relative text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 transition-all duration-300' onClick={() => setOpenNewContactModel(true)}>
      <CiCirclePlus/>
      <span className='group-hover:block hidden text-white text-[12x] absolute -top-6 -left-10 text-nowrap'>New contact</span>
    </div>

   {openNewContactModel && 
   <div className='absolute inset-0 bg-black/30 flex items-center justify-center p-3' onClick={()=> setOpenNewContactModel(false)}>
        <div className='w-full max-w-[400px] h-full max-h-[400px] bg-[#181920] border-none text-white flex flex-col p-2 gap-3' onClick={(e) => e.stopPropagation()}>
            {/* <div className=' text-center'>Please select a contact</div> */}

            <div>
                <input placeholder='Search contacts' className='rounded-lg p-6 bg-[#2c2e3b] border-none w-full' onChange={(e) => searchContact(e.target.value)}/>
            </div>

            {searchedContacts?.length <= 0 && 
                (<div className="flex-1 flex flex-col justify-center items-center duration-1000 transition-all">
                 <Lottie isClickToPauseDisabled={true} height={100} width={100}  options={animationDefaultOptions}/>
                <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                    Hi <span className="text text-purple-500 ">!</span> Search new <span className="text-purple-500">Contact.</span>
                </h3>
                </div>
            </div>)
            }

            {searchedContacts.length > 0 && (
            <div className='flex flex-1 flex-col gap-2 overflow-y-scroll'>
                {searchedContacts.map(el => <Contact key={el._id} data={el} selectContact={selectContact}/>)}</div>
            )}
        </div>
    </div>
    }
   </>
  )
}

export default NewDm
