import React from 'react'
import { useAppStore } from '../../../../../store'
import { HOST, LOGOUT_ROUTE } from '../../../../../lib/utils'
import { getColor } from '../../../../../utils/constants'
import { useNavigate } from 'react-router-dom'
import { AiOutlineLogout } from "react-icons/ai";
import { apiClient } from '../../../../../lib/api-client'

const ProfileInfo = () => {

    const {userInfo,setUserInfo,updateKeys} = useAppStore()
    const navigate = useNavigate()

    console.log("this is userInfo inside profile-info:", userInfo)

    const logout = async() =>{

        try{

            const res = await apiClient.post(LOGOUT_ROUTE,{}, {
                withCredentials: true,
              });

              if(res.status === 200){
                navigate("/auth")
                setUserInfo(null)
                updateKeys({status:"success", message:res.data.message})
              }

        }catch(error){
            console.log("this is error:", error)
            updateKeys({status:"error", message:error.message})
        }

        setUserInfo(null)
    }

  return (
    <div className='absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]'>
      <div className='flex gap-3 items-center justify-center'>

        <div className="size-12 rounded-full overflow-hidden">      
                
                <>
                {userInfo.image ? (
                    <img
                    src={`${HOST}/${userInfo.image}`}
                    alt="avatar"
                    className="w-full h-full object-cover bg-black"
                    />
                ) : (
                    <div
                    className={` uppercase w-full h-full text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                        userInfo.color
                    )}`}
                    >
                    {userInfo.firstName
                        ? userInfo?.firstName?.split("").shift()
                        : userInfo?.email?.split("").shift()}
                    </div>
                )}</>
                
        </div>

        {userInfo.firstName && userInfo.lastName ?`${userInfo.firstName} ${userInfo.lastName}`: ""}

      </div>

      <div className='flex gap-5 cursor-pointer' onClick={()=>navigate("/profile")}>
                Profile
      </div>
      <div className='flex gap-5 cursor-pointer text-[#741bda]' onClick={logout}>
            <AiOutlineLogout />
      </div>

    </div>
  )
}

export default ProfileInfo
