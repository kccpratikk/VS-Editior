import React, { useEffect, useState } from 'react'
import { Editor as Edit} from '@monaco-editor/react'


function Editor({text,onHandleChange}) {


  return (
    <div className='text-white overflow-y-hidden h-full'>
     
        <Edit height="100%" defaultLanguage='javascript' value={text} onChange={onHandleChange} defaultValue="// Start coding..."
        theme="vs-dark"/>
    </div>
  )
}

export default Editor