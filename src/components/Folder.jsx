import React, { useEffect, useState } from "react";
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
}) {
  
  console.log("folder rendered");
  
  const [show, setShow] = useState(false);
  const [name, setName] = useState(data.name);

  const handleLocalClick = (id, name, { isFolder, parentId }) => {
    if (showRenameField === id) return;

    if (isFolder) {
      setShow((prev) => !prev);
      handleOnClick(id, name);
    } else {
      handleOnClick(id, name, parentId);
    }
  };

  const handleAddFolderClick = (e, isFolder) => {
    e.stopPropagation();

    if (selected["parentId"]) handleOnChangeInput(selected.parentId, isFolder);
    else handleOnChangeInput(selected.id, isFolder);
  };

  const handleOnAddBlur = (e) => {
    const newItem = {
      id: Date.now(),
      name: e.target.value,
      isFolder: showInput.isFolder,
      items: [],
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
    handleOnClick(id);
  };

  useEffect(() => {
    if (showInput && showInput.id === data.id) setShow(true);
  }, [showInput]);

  return (
    <div className="relative">
      <div
        style={{ paddingLeft: `${depth * 12}px` }}
        className={`flex items-center w-full py-0.5  cursor-pointer justify-between ${selected && selected.id === data.id && showRenameField != data.id && data.name != "root" ? "bg-blue-600" : " hover:bg-gray-900"}`}
        onContextMenu={(e) => handleDropDown(e, data.id)}
      >
        <div
          onClick={() =>
            handleLocalClick(data.id, data.name, {
              isFolder: data.isFolder,
              parentId,
            })
          }
          className=" w-full flex items-center  gap-1 "
        >
          {data.isFolder ? (
            <span>
              {show ? (
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
          {showRenameField != data.id ? (
            <p
              className={`text-white ${data.name === "root" ? "text-md font-semibold" : "text-xs"}`}
            >
              {data.name}
            </p>
          ) : (
            <input
              type="text"
              autoFocus
              onBlur={handleOnRenameBlur}
              className="text-white text-xs outline-none border border-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
        </div>

        <div className="flex items-center ">
          {data.name === "root" && (
            <div className="flex items-center gap-3 pr-2">
              <FilePlus2Icon
                onClick={(e) => handleAddFolderClick(e, false)}
                size={15}
                color="white"
              />
              <FolderPlusIcon
                onClick={(e) => handleAddFolderClick(e, true)}
                size={15}
                color="white"
              />
            </div>
          )}
        </div>
      </div>
      {/*Sub folders and files*/}

      <div
        className={` ${show || (showInput && showInput.id === data.id) ? "block" : "hidden"}`}
      >
        {showInput && showInput.id === data.id && (
          <div className="flex items-center justify-center">
            <span style={{ width: `${depth * 20}px` }}></span>
            <input
              type="text"
              className="w-[300px]  text-white text-xs outline-none border border-blue-500"
              onBlur={handleOnAddBlur}
              autoFocus
            />
          </div>
        )}
        {data.items.map((item) => (
          <div key={item.id}>
            <Folder
              data={item}
              handleOnClick={handleOnClick}
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
            />

            {dropDownVisibleId === item.id && (
              <DropDown
                setDropDownVisibleId={setDropDownVisibleId}
                handleRemove={handleRemove}
                id={selected.id}
                setRenameField={setRenameField}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(Folder);