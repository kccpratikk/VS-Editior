import React from 'react'

function MenuBar({ onFolderOpen }) {
  const handleOpenFolder = async () => {
    if (!window.showDirectoryPicker) {
      console.warn('Directory picker is not supported by this browser.')
      return
    }

    try {
      const directoryHandle = await window.showDirectoryPicker()

      if (typeof onFolderOpen === 'function') {
        onFolderOpen(directoryHandle)
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error(error)
      }
    }
  }

  return (
    <div className='w-full bg-[#252526] border-b flex items-center border-[#2D2D2D] px-1 py-2 text-sm text-gray-300'>
      <ul className='flex items-center gap-4'>
        <li onClick={handleOpenFolder} className='cursor-pointer'>File</li>
        <li>Edit</li>
        <li>Selection</li>
        <li>View</li>
        <li>Go</li>
        <li>Run</li>
      </ul>
    </div>
  )
}

export default MenuBar