import React from "react";
import Header from "../Components/Header";
import styled from "styled-components";
import { Outlet } from "react-router-dom";

const Container = styled.div`
  display: block;
  height: 10vh;
  /* ... */
`;

const Dashboard = () => {
  return (
    <Container>
      <Header />
      <Outlet />
    </Container>
  );
};

export default Dashboard;
