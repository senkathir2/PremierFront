import React from "react";
import Sidebar from "../Components/Sidebar";
import styled from "styled-components";
import { Outlet } from "react-router-dom";

const Container = styled.div`
  display: flex;
  background: #f4f5f6;
  width: 100%;
  height: 200vh;
  padding: 3vh;
`;

const SidebarComp = styled.div`
  flex: 1;
`;

const OutLetContainer = styled.div`
  flex: 5;
`;

const TestPage = () => {
  return (
    <Container>
      <SidebarComp>
        <Sidebar />
      </SidebarComp>
      <OutLetContainer>
        <Outlet />
      </OutLetContainer>
    </Container>
  );
};

export default TestPage;
