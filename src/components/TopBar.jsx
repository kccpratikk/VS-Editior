import { ClosedCaption, Cross, Crosshair, CrossIcon, DoorClosed, FolderClosed, LucideCross, ShieldClose, SidebarClose } from 'lucide-react'
import React from 'react'

function TopBar({topBar,opened,handleRemoveFromOpenTabs,setOpened}) {


  const handleRemove = (e,id)=>{
     e.stopPropagation()
    handleRemoveFromOpenTabs(id)
  
    
  }
  
  const handleClick = (e,id)=>{
   
    setOpened(id)
  }
  
  return (
    <div className='flex  justify-start items-center'>
       {
          topBar.map((item)=>(
            
            <div className={`relative flex items-center group min-w-20 px-6 py-1  text-center border border-[#2D2D2D] cursor-pointer text-white text-xs ${opened===item.id?"border-t-blue-600 border-t border-b-0":""}`} key={item.id} onClick={(e)=>handleClick(e,item.id)}>
             <p>{item.name} </p>
             {item.isEdited?<p className='h-1 w-1 p-1  bg-white rounded-full absolute right-1 top-2'></p>:<p onClick={(e)=>handleRemove(e,item.id)} className={`${item.id===opened?"":"hidden"} absolute right-1 top-0 group-hover:block `}>x</p>}
             </div>
          ))
       }
    </div>
  )
}

export default TopBar