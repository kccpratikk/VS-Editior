
export default function useTree() {
  const insert = (curr, id, newItem) => {
    if (curr.id === id) {
      return {
        ...curr,
        items: [newItem, ...curr.items],
        isExpanded: true,
      };
    }

    const latestNode = curr.items.map((item) => insert(item, id, newItem));

    return { ...curr, items: latestNode };
  };

  const remove = (curr, id) => {
    if (!curr?.items) return curr;

    if (curr.items.some((item) => item.id == id)) {
      return { ...curr, items: curr.items.filter((item) => item.id != id) };
    }

    const latestNode = curr.items.map((item) => {
      return remove(item, id);
    });

    return { ...curr, items: latestNode };
  };

  const rename = (curr, id, name) => {
    if (curr.id === id) {
      return { ...curr, name: name };
    }

    const latestNode = curr.items.map((item) => rename(item, id, name));

    return { ...curr, items: latestNode };
  };

  const setExpand = (curr,id)=>{
    
    if(curr.id===id){
      return {...curr,isExpanded:!curr.isExpanded}
    }

     const latestNode = curr.items.map((item) => setExpand(item, id));

    return { ...curr, items: latestNode };
}

  return { insert, remove, rename,setExpand };
}



 






