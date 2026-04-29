import React, { useEffect, useRef } from 'react'


function DropDown({setDropDownVisibleId,handleRemove,id,setRenameField}) {
 
 
  const ref= useRef() 
  
  

  useEffect(()=>{
    
    const handler = (e)=>{
       
      if(ref.current && !ref.current.contains(e.target))
        setDropDownVisibleId("")
    }

    addEventListener("mousedown",handler)


   return ()=>{
      removeEventListener("mousedown",handler)
    }
  },[])

  const handleRename  = ()=>{
    
    setDropDownVisibleId("")
    setRenameField(id)
    
  }

  return (
    <div ref={ref}  className=' z-10 w-[150px] absolute left-60 top-10  text-xs rounded-md shadow-full bg-gray-700 text-white flex flex-col gap-1 p-1'>
         <p className='border-b hover:bg-gray-500 border-white'>Create</p>
          <p className='border-b hover:bg-gray-500 border-white' onClick={()=>handleRemove(id)}>Delete</p>
         <p className='border-b hover:bg-gray-500 border-white' onClick={handleRename}>Rename</p>
    </div>
  )
}

export default DropDown