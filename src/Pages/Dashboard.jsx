import React from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import DashHeader from "../Components/DashHeader";


const Container = styled.div`
  display: block;
  height: 10vh;
  /* ... */
`;

const Dashboard = () => {
  return (
    <Container>
      <DashHeader title={"Dashboard"}/>
      <Outlet />
    </Container>
  );
};

export default Dashboard;
