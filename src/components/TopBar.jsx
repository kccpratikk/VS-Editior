import React from 'react'

function TopBar({topBar,setTopBar,opened,setOpened}) {


  const handleRemove = (id)=>{
     
    let newTopBar = topBar.filter(item=>item.id!=id)

    setTopBar(newTopBar)
  }

  return (
    <div className='flex flex-start items-center  '>
       {
          topBar.map((item)=>(
            
            <div className={`relative flex items-center group min-w-20 px-6 py-1  text-center border border-gray-700 cursor-pointer text-white text-xs ${opened===item.id?"border-t-blue-600 border-t-2":""}`} key={item.id} onClick={()=>setOpened(item.id)}>
             <p>{item.name} </p>
             <p onClick={()=>handleRemove(item.id)} className='hidden absolute right-1 top-0 group-hover:block '>x</p>
             </div>
          ))
       }
    </div>
  )
}

export default TopBar