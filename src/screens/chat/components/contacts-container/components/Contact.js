import React, { memo } from 'react'
import { HOST } from '../../../../../lib/utils'
import { getColor } from '../../../../../utils/constants'

const Contact = memo(({data,selectContact}) => {
    return (
      <div className=' cursor-pointer w-full rounded-md p-3 border border-slate-500 flex items-center gap-3 hover:opacity-80' onClick={() =>selectContact(data)}>

         <div className="size-12 rounded-full overflow-hidden">         
                <>
                {data.image ? (
                    <img
                    src={`${HOST}/${data.image}`}
                    alt="avatar"
                    className="w-full h-full object-cover bg-black"
                    />
                ) : (
                    <div
                    className={` uppercase w-full h-full text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                        data.color
                    )}`}
                    >
                    {data.firstName
                        ? data?.firstName?.split("").shift()
                        : data?.email?.split("").shift()}
                    </div>
                )}</>    
        </div>
        <div className='flex flex-col'>
        {data.firstName && data.lastName && <span>{data.firstName} {data.lastName}</span>}
        <span className=' text-xs'>{data.email}</span>
        </div>
      </div>
    )
  }
  )
export default Contact
