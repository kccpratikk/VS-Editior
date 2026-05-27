import React from 'react'
import { Editor as Edit} from '@monaco-editor/react'


function Editor({text,onHandleChange,openTab,openTabs}) {

  if(!openTab || openTabs.length==0) return <div></div>

  return (
    <div className='text-white h-full overflow-hidden'>
      <Edit height="100%" defaultLanguage='javascript' value={text} onChange={onHandleChange}
        theme="vs-dark" />
    </div>
  )
}

export default Editor