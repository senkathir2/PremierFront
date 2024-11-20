import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SidebarTree from "./SidebarTree";
import SideBarInfo from "../sidbarInfo";
import { useLocation } from "react-router-dom";

const Container = styled.div`
  height: 100vh;
  border-radius: 8px;
  background: var(--Neutral-White, #fff);
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: #000000;
  text-align: left;
  padding: 2vh;
`;

const Paragraph = styled.p`
  color: #000;
  font-feature-settings: "liga" off, "clig" off;

  /* Paragraph/text-xs/[R] */
  font-family: "DM Sans";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
`;

const Sidebar = ({handleItemId}) => {
  const [key, setKey] = useState("")
  const [topBarSelection,  setTopBarSelection] = useState("")
  const location = useLocation()

  useEffect(() => {
    setTopBarSelection(location.pathname.split('/')[2])
  },[location])

  const handleItemIdChange = (itemId) => {
    handleItemId(itemId)
  }

  return (
    <Container>
      {topBarSelection &&
        <SidebarTree
          treeArray={SideBarInfo.sideBarTreeArray[topBarSelection]}
          topBarSelection={topBarSelection}
          handleItemIdChange={handleItemIdChange}
        />
      }
    </Container>
  );
};

export default Sidebar;
