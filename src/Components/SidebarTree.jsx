import React, { useState } from "react";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useLocation, useNavigate } from "react-router-dom";

const SidebarTree = ({treeArray, handleItemIdChange}) => {
  const [selectedItemId, setSelectedItemId] = useState("")
  const navigate = useNavigate()
  const location = useLocation()

  const handleChange = (itemId) => {
    handleItemIdChange(itemId)
    navigate(location.pathname, {state:{key:itemId}})
  };
  return (
    <div>
      <RichTreeView items={treeArray} onItemClick={(event, itemId) => handleChange(itemId)} />
    </div>
  );
};

export default SidebarTree;
