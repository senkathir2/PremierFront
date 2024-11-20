import React, { useEffect, useState } from "react";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useLocation, useNavigate } from "react-router-dom";

const SidebarTree = ({treeArray, handleItemIdChange, topBarSelection}) => {
  const [selectedItemId, setSelectedItemId] = useState(`overview_${topBarSelection}`)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    handleItemIdChange(selectedItemId)
  }, [selectedItemId])

  useEffect(() => {
    setSelectedItemId(`overview_${topBarSelection}`)
  }, [topBarSelection])

  // const handleChange = (itemId) => {
  //   handleItemIdChange(itemId)
  //   navigate(location.pathname, {state:{key:itemId}})
  // };
  const handleItemSelectionChange = (event, itemId, isSelected) => {
    if(isSelected){
      setSelectedItemId(itemId)
    }
  }

  return (
    <div>
      <RichTreeView 
        items={treeArray} 
        //onItemClick={(event, itemId) => handleChange(itemId)}
        selectedItems={selectedItemId}
        onItemSelectionToggle={handleItemSelectionChange}
      />
    </div>
  );
};

export default SidebarTree;
