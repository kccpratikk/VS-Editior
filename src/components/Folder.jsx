import React, { useState } from "react";

import {
  ChevronDown,
  ChevronRight,
  File,
  FilePlus2Icon,
  FolderMinus,
  FolderPlusIcon,
} from "lucide-react";
import DropDown from "./DropDown";

function Folder({
  data,
  handleOnClick,
  onLoadDirectory,
  selected,
  handleAdd,
  handleOnChangeInput,
  showInput,
  setShowInput,
  dropDownVisibleId,
  setDropDownVisibleId,
  depth = 1,
  handleRemove,
  showRenameField,
  setRenameField,
  handleRename,
  parentId,
  handleExpand,
  handleRemoveFromOpenTabs
}) {

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(data.name);
  
  

  const handleLocalClick = async (
    id,
    name,
    { isFolder, parentId, handle, loaded },
  ) => {
    if (showRenameField === id) return;

    if (isFolder) {
      if (handle && !loaded && typeof onLoadDirectory === "function") {
        setLoading(true);
        await onLoadDirectory(id, handle);
        setLoading(false);
      }

      handleExpand(id);
      handleOnClick(id, name, { parentId: "", isFolder, handle });
    } else {
      handleOnClick(id, name, { parentId, isFolder, handle });
    }
  };


  const handleOnAddBlur = (e) => {
    const newItem = {
      id: Date.now(),
      name: e.target.value,
      isFolder: showInput.isFolder,
      items: [],
      isExpanded: false,
    };

    if (newItem.name.length != 0) handleAdd(showInput.id, newItem);

    setShowInput(null);
  };

  const handleOnRenameBlur = () => {
    if (name === "" || !showRenameField) return;

    handleRename(showRenameField, name);
    setRenameField();
  };

  const handleDropDown = (e, id) => {
    e.preventDefault();

    setDropDownVisibleId(id);
    handleOnClick(id, data.name, {
      parentId,
      isFolder: data.isFolder,
      handle: data.handle,
      loaded: data.loaded,
    });
  };

  const activeInput = (showInput && showInput.id === data.id);
 
  const isExpanded = data.isExpanded || activeInput;

 

  return (
    <div className="relative">
      <div
        style={{ paddingLeft: `${depth * 12}px` }}
        className={`flex items-center w-full py-0.5  cursor-pointer justify-between ${selected && selected.id === data.id && showRenameField != data.id && data.id != "1" ? "bg-[#094771]" : " hover:bg-[#37373D]"}`}
        onContextMenu={(e) => handleDropDown(e, data.id)}
      >
        <div
          onClick={() =>
            handleLocalClick(data.id, data.name, {
              isFolder: data.isFolder,
              parentId,
              handle: data.handle,
              loaded: data.loaded,
            })
          }
          className=" w-full flex items-center  gap-1 "
        >
          {data.isFolder ? (
            <span>
              {isExpanded ? (
                <ChevronDown size={15} color="white" />
              ) : (
                <ChevronRight size={15} color="white" />
              )}
            </span>
          ) : (
            <span>
              <File color="orange" size={15} />
            </span>
          )}
        
          {showRenameField === data.id ? (
            <input
              type="text"
              autoFocus
              onBlur={handleOnRenameBlur}
              className="text-gray-300 text-xs outline-none border border-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
           
          ) : (
             <p
              className={`text-gray-300 ${data.id === "1" ? "text-xs text-gray-300 font-semibold" : "text-xs"}`}
            >
              {data.name}
              {loading ? " (loading...)" : ""}
            </p>
          )}
        </div>
      </div>
      {/*Sub folders and files*/}
      
      <div className={isExpanded ? "block" : "hidden"}>
        {showInput && showInput.id === data.id && (
          <div className="flex items-center justify-center">
            <span style={{ width: `${depth * 20}px` }}></span>
            <input
              type="text"
              style={{ width: "300px" }}
              className="text-gray-300 text-xs outline-none border border-blue-500"
              onBlur={handleOnAddBlur}
              autoFocus
            />
          </div>
        )}
        {data?.items?.map((item) => (
          <div key={item.id} className="relative">
            <Folder
              data={item}
              handleOnClick={handleOnClick}
              onLoadDirectory={onLoadDirectory}
              selected={selected}
              handleAdd={handleAdd}
              handleOnChangeInput={handleOnChangeInput}
              showInput={showInput}
              setShowInput={setShowInput}
              dropDownVisibleId={dropDownVisibleId}
              setDropDownVisibleId={setDropDownVisibleId}
              depth={depth + 1}
              handleRemove={handleRemove}
              showRenameField={showRenameField}
              setRenameField={setRenameField}
              handleRename={handleRename}
              parentId={data.id}
              handleExpand={handleExpand}
              handleRemoveFromOpenTabs = {handleRemoveFromOpenTabs}
            />
            
            {dropDownVisibleId === item.id && (
              <DropDown
                setDropDownVisibleId={setDropDownVisibleId}
                handleRemove={handleRemove}
                id={selected.id}
                setRenameField={setRenameField}
                handleRemoveFromOpenTabs={handleRemoveFromOpenTabs}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(Folder);
