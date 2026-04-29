import React, { useCallback, useEffect, useRef, useState } from "react";
import Explorer from "./components/Folder";
import Folder from "./components/Folder";
import useTree from "./hooks/useTree";
import Editor from "./components/Editor";
import TopBar from "./components/TopBar";

export default function App() {
  const [data, setExplorer] = useState({
    id: "1",
    name: "root",
    isFolder: true,
    items: [],
  });

  const [openTabs, setOpenTabs] = useState([]);
  const [openTab, setOpenTab] = useState();
  const [selected, setSelected] = useState({ id: "1" });
  const [showInput, setShowInput] = useState(null);
  const [dropDownVisibleId, setDropDownVisibleId] = useState("");
  const [showRenameField, setRenameField] = useState();

  const ref = useRef();

  const { insert, remove, rename } = useTree();

   const handleAddInOpenTabs =useCallback((id, name, content) => {
    setOpenTabs(prev=>[
      ...prev,
      {
        id,
        name,
        content,
      },
    ]);
  }, []);  


  const handleOnClick = useCallback((id, name, parentId = undefined) => {
    setSelected({ id, parentId });

    if (!openTabs.some((item) => item.id === id))
      handleAddInOpenTabs(id, name, "");

    setOpenTab(id);
  }, [handleAddInOpenTabs,openTabs]);

 


  const handleAdd = useCallback((id, newItem) => {
   
    setExplorer(insert(data, id, newItem));

    if (!newItem.isFolder) {
      handleAddInOpenTabs(newItem.id, newItem.name, "");
      setOpenTab(newItem.id);
    }
  }, [insert,data,handleAddInOpenTabs]);


  const handleRemove = useCallback((id) => {
    setExplorer(prev => remove(prev, id));
  }, [remove]);

  const handleRename = useCallback((id, name) => {
    setDropDownVisibleId("");
    setExplorer(prev => rename(prev, id, name));
  }, [rename]);

  const handleOnChangeInput = useCallback((id, isFolder) => {
    setShowInput({ id, isFolder });
    setSelected({ id: "1" });
    setRenameField();
  }, []);

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

  useEffect(() => {}, [openTab]);

  const onHandleChange = (value) => {
    let newOpenTabs = openTabs.map((item) => {
      if (item.id === openTab) return { ...item, content: value };
      else return item;
    });

    setOpenTabs(newOpenTabs);
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

  return (
    <div className="h-screen bg-[#1e1e1e] flex">
      <div className="bg-gray-930 w-80 border-r border-gray-700">
        <p className="text-white border-b border-gray-700 p-2 text-xs">
          EXPORER
        </p>
        <div ref={ref} className="">
          <Folder
            data={data}
            handleOnClick={handleOnClick}
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
          />
        </div>
      </div>

      {/* sideBar */}
      <div className="flex-1 flex flex-col">
        <TopBar
          topBar={openTabs}
          setTopBar={setOpenTabs}
          opened={openTab}
          setOpened={setOpenTab}
        />

        {openTabs.length > 0 ? (
          <Editor text={getContent()} onHandleChange={debounceonHandleChange} />
        ) : (
          <div className="h-full w-full text-white mt-10 text-center text-md">
            Please create file to start{" "}
          </div>
        )}
      </div>
    </div>
  );
}
