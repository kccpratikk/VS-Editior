import React, { useEffect, useRef, useState } from "react";
import Folder from "./components/Folder";
import useTree from "./hooks/useTree";
import Editor from "./components/Editor";
import TopBar from "./components/TopBar";
import MenuBar from "./components/MenuBar";
import { FilePlus2Icon,FolderPlusIcon,ChevronDown,ChevronRight } from "lucide-react";


export default function App() {
  const [data, setExplorer] = useState({});

  const [openTabs, setOpenTabs] = useState([]);
  const [openTab, setOpenTab] = useState();
  const [selected, setSelected] = useState({ id: "1" });
  const [showInput, setShowInput] = useState(null);
  const [dropDownVisibleId, setDropDownVisibleId] = useState("");
  const [showRenameField, setRenameField] = useState();
  

  const ref = useRef();

  const { insert, remove, rename,setExpand} = useTree();
  
    

  const handleFolderOpen = (directoryHandle) => {
    setExplorer({
      id: "1",
      name: directoryHandle.name,
      isFolder: true,
      handle: directoryHandle,
      items: [],
      loaded: false,
      isExpanded:false
    });
     
    setOpenTabs([])
  }

  const handleAddInOpenTabs = (id, name, content, handle = null) => {
    setOpenTabs((prev) => [
      ...prev,
      {
        id,
        name,
        content,
        handle,
        isEdited:false
      },
    ]);
  };

 const handleRemoveFromOpenTabs = (id)=>{
     let idx = openTabs.findIndex(item=>item.id===id)
    
    let newTopBar = openTabs.filter(item=>item.id!=id)

    setOpenTabs(newTopBar)
    
    if(id===openTab){
    if(idx<newTopBar.length)
    setOpenTab(newTopBar[idx].id)
    else if(idx>0)
    setOpenTab(newTopBar[idx-1].id)  
 }

}
  

  const readFileContent = async (fileHandle) => {
    try {
      const file = await fileHandle.getFile()
      return await file.text()
    } catch (error) {
      console.error(error)
      return ""
    }
  }

  const handleOnClick = async (id, name, { parentId, isFolder, handle } = {}) => {
       
    setSelected({ id, parentId });

    if (!isFolder) {
      if (!openTabs.some((item) => item.id === id)) {
        const content = handle ? await readFileContent(handle) : ""
        handleAddInOpenTabs(id, name, content, handle)
      }

      setOpenTab(id)
    }
  };


  const handleExpand = (id) => {
    
    setExplorer((prev) => setExpand(prev, id));
  }

  const findNodeById = (node, id) => {
    if (node.id === id) return node;
    
    if (node.items && node.items.length > 0) {
      for (let item of node.items) {
        const found = findNodeById(item, id);
        if (found) return found;
      }
    }
    
    return null;
  };

  const findParentById = (node, id) => {
    if (!node.items) return null;
    for (let item of node.items) {
      if (item.id === id) return node;
      const found = findParentById(item, id);
      if (found) return found;
    }
    return null;
  };

  const handleAdd = async (id, newItem) => {
    try {
      const parentNode = findNodeById(data, id);
      
      // If parent has a handle (from file system), create the file/folder there
      if (parentNode?.handle) {
        if (newItem.isFolder) {
          // Create folder
          const folderHandle = await parentNode.handle.getDirectoryHandle(
            newItem.name,
            { create: true }
          );
          newItem.handle = folderHandle;
        } else {
          // Create file
          const fileHandle = await parentNode.handle.getFileHandle(
            newItem.name,
            { create: true }
          );
          newItem.handle = fileHandle;
        }
      }
    } catch (error) {
      console.error("Error creating file/folder:", error);
      alert(`Failed to create ${newItem.isFolder ? "folder" : "file"}: ${error.message}`);
      return;
    }
    
   
    setExplorer((prev) => insert(prev, id, newItem));
    
    if (!newItem.isFolder) {
      handleAddInOpenTabs(newItem.id, newItem.name, "", newItem.handle);
      setOpenTab(newItem.id);
    }
      
  };

  const handleRemove = async (id) => {
    const node = findNodeById(data, id);
    const parentNode = findParentById(data, id);

    try {
      if (parentNode?.handle && node?.name) {
        if (typeof parentNode.handle.removeEntry === "function") {
          await parentNode.handle.removeEntry(node.name, { recursive: node.isFolder });
        } else if (typeof parentNode.handle.remove === "function") {
          await parentNode.handle.remove(node.name, { recursive: node.isFolder });
        } else {
          console.warn("Directory handle does not support removal of entries");
        }
      }
    } catch (error) {
      console.error("Failed to remove from filesystem:", error);
      alert(`Failed to remove ${node?.isFolder ? "folder" : "file"}: ${error.message}`);
      return;
    }

    handleRemoveFromOpenTabs(id);
    setExplorer((prev) => remove(prev, id));
  };

  const handleRename = (id, name) => {
    setDropDownVisibleId("");
    setExplorer((prev) => rename(prev, id, name));
  };

  const handleOnChangeInput = (id, isFolder) => {
    setShowInput({ id, isFolder });
    setSelected({ id: "1" });
    setRenameField();
  };

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setSelected({ id: "1" });
      }
    };

    addEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleSave = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
      }
    };

    addEventListener("keydown", handleSave);

    return () => {
      removeEventListener("keydown", handleSave);
    };
  }, []);

 

  const onHandleChange = (value) => {
     
    console.log("run")
    let newOpenTabs = openTabs.map((item) => {
      if (item.id === openTab) return { ...item, content: value,isEdited:true};
      else return item;
    });

    setOpenTabs(newOpenTabs);
  };

  const setNodeChildren = (curr, nodeId, children) => {
   
    if (curr.id === nodeId) {
      
      return { ...curr, items: children, loaded: true };
    }

    return {
      ...curr,
      items: curr.items.map((item) => setNodeChildren(item, nodeId, children)),
    };
  };

  
  const loadDirectoryChildren = async (nodeId, directoryHandle) => {
    const children = []

    for await (const [name, entryHandle] of directoryHandle.entries()) {
      const childId = `${nodeId}-${entryHandle.kind}-${name}`

      if (entryHandle.kind === "file") {
        children.push({
          id: childId,
          name,
          isFolder: false,
          handle: entryHandle,
          items: [],
          isExpanded:false
        })
      } else if (entryHandle.kind === "directory") {
        children.push({
          id: childId,
          name,
          isFolder: true,
          handle: entryHandle,
          items: [],
          loaded: false,
          isExpanded:false
        })
      }
    }
    
    setExplorer((prev) => setNodeChildren(prev, nodeId, children))
    
  };

  const useDebounceonHandleChange = (fn, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);

      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  };

  const debounceonHandleChange = useDebounceonHandleChange(
    onHandleChange,
    1000,
  );

  const getContent = () => {
    return openTabs.find((item) => item.id === openTab)?.content;
  };

  const saveFile = async (fileTab) => {
    try {
      if (!fileTab) {
        console.error("No file tab found");
        return false;
      }

      if (!fileTab.handle) {
        console.error(`Cannot save file "${fileTab.name}" - file was not opened from the file system`);
        alert(`Cannot save file "${fileTab.name}" - file was not opened from the file system. Please open a folder first.`);
        return false;
      }

      const writable = await fileTab.handle.createWritable();
      await writable.write(fileTab.content);
      await writable.close();

      console.log(`File saved: ${fileTab.name}`);
      return true;
    } catch (error) {
      console.error("Error saving file:", error);
      alert(`Failed to save file: ${error.message}`);
      return false;
    }
  };


  const handleAddFolderClick = async(e, isFolder,{handle,loaded}={}) => {
    e.stopPropagation();
   console.log(selected)
   //if (showInput != null) return;
   
    if (selected["parentId"]) handleOnChangeInput(selected.parentId, isFolder);
    else {
       
    if (handle && !loaded && typeof onLoadDirectory === "function") {
       // setLoading(true);
        await loadDirectoryChildren(selected.id, handle);
       // setLoading(false);
      }
      
      handleOnChangeInput(selected.id, isFolder);
    }
  };

  const handleRootFolderClick = async(e)=>{
    e.stopPropagation()
    
    setExplorer((prev) => setExpand(prev, data.id));
    
    if(data.handle && !data.loaded){
      await loadDirectoryChildren(selected.id,data.handle);
    }

  }

  useEffect(()=>{
    
    const handleSaveFile = async (e)=>{
       
      if((e.ctrlKey || e.metaKey)&& e.key.toLowerCase()==='s'){
        e.preventDefault();
        const fileTab = openTabs.find(item => item.id === openTab);
        
        if (fileTab) {
          const success = await saveFile(fileTab);
          
          if (success) {
            const c = openTabs.map(item => item.id === openTab ? {...item, isEdited: false} : item);
            setOpenTabs(c);
          }
        }
      }
    }
    addEventListener("keydown",handleSaveFile)
       
    return ()=>{
      removeEventListener("keydown",handleSaveFile)
    }
  },[openTabs,openTab])

  return (
    <div className="h-screen overflow-hidden bg-[#1e1e1e] flex flex-col">
      <MenuBar onFolderOpen={handleFolderOpen} />
      <div className="flex h-full">
      <div ref={ref} className="bg-[#252526] min-w-80 border-r border-[#2D2D2D]">
        <p className="text-gray-300  p-2 text-xs">
          EXPORER
        </p>
        { data.name&&<div onClick={handleRootFolderClick} className="flex justify-between items-center pr-1 pl-1 cursor-pointer">
           <div className="flex items-center">
           <span>
              {data.isExpanded ? (
                <ChevronDown size={15} color="white" />
              ) : (
                <ChevronRight size={15} color="white" />
              )}
            </span>
          <p className="text-xs text-gray-300 font-semibold ">{data.name}</p>
            </div>
            <div className="flex items-center gap-3 pr-2">
              {console.log(selected)}
              <FilePlus2Icon
                onClick={(e) => handleAddFolderClick(e, false)}
                size={15}
                color="white"
              />
              <FolderPlusIcon
                onClick={(e) =>
                  handleAddFolderClick(e, true, {
                    handle: data.handle,
                    loaded: data.loaded,
                  })
                }
                size={15}
                color="white"
              />
            </div>
        </div>
       }
        <div  className="overflow-y-auto">
        {data.isExpanded&&data.items?.map((item)=> <Folder
            key={item.id}
            data={item}
            handleOnClick={handleOnClick}
            onLoadDirectory={loadDirectoryChildren}
            selected={selected}
            handleAdd={handleAdd}
            handleOnChangeInput={handleOnChangeInput}
            showInput={showInput}
            setShowInput={setShowInput}
            handleRemove={handleRemove}
            dropDownVisibleId={dropDownVisibleId}
            setDropDownVisibleId={setDropDownVisibleId}
            showRenameField={showRenameField}
            setRenameField={setRenameField}
            handleRename={handleRename}
            handleExpand={handleExpand}
            handleRemoveFromOpenTabs = {handleRemoveFromOpenTabs}
            parentId={data.id}
          />
        )
        }
        </div>
      </div>

      {/* sideBar */}
      <div className="flex-1 flex flex-col h-full">
        <TopBar
          topBar={openTabs}
          opened={openTab}
          setOpened={setOpenTab}
          handleRemoveFromOpenTabs = {handleRemoveFromOpenTabs}
        />

        <div className="flex-1 overflow-hidden">
          <Editor text={getContent()} onHandleChange={debounceonHandleChange} openTab={openTab} openTabs={openTabs} />
        </div>
      </div>
      </div>
    </div>
  );
}
