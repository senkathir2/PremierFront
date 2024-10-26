import React from "react";
import styled from "styled-components";

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

const endpoint = [
  {
    id: 1,
    Title: "first",
    APIEndpoint: "?",
  },
  {
    id: 2,
    Title: "second",
    APIEndpoint: "?",
  },
  {
    id: 3,
    Title: "third",
    APIEndpoint: "?",
  },
];

const Sidebar = () => {
  return (
    <Container>
      {endpoint.map((ele) => (
        <div key={ele.id}>
          <Paragraph>{ele.Title}</Paragraph>
        </div>
      ))}
    </Container>
  );
};

export default Sidebar;
