import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Avatar,
  Badge,
  Icon,
  IconButton,
  Link,
  Tab,
  Tabs,
} from "@mui/material";
import { NotificationsOutlined, Search } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

const TopbarContainer = styled.div`
  display: flex;
  height: var(--height-h-12, 48px);
  padding: var(--py-0, 0px) 24px;
  align-items: flex-end;
  gap: 10vw;
  flex-shrink: 0;
  overflow-y: hidden;
  background-color: #ffffff;
  padding-top: 0.7vh;
  padding-bottom: 0.7vh;
`;

const InputContainer = styled.div`
  display: flex;
  padding: var(--py-1, 4px) var(--pr-2, 8px) var(--py-1, 4px) var(--pl-1, 4px);
  align-items: center;
  gap: var(--Size-80, 8px);
  align-self: stretch;
  border-radius: var(--Interactive-border-radius---radius-i-sm, 8px);
  border: 1px solid #e2e2e2;
  background: #f5f6f7;

  margin-top: auto;
  margin-bottom: auto;
`;

const SearchInput = styled.input`
  color: var(--Main-trunks, #595d62);
  font-feature-settings: "liga" off, "clig" off;
  font-family: "DM Sans";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
  background-color: #f5f6f7;
  border: none;
  outline: none;
`;

const TopbarMenu = styled.div`
  display: flex;

  height: var(--height-h-12, 48px);
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  margin-right: 1vw;
  margin-left: auto;
`;

const TopbarItem = styled.div`
  margin-left: 20px;
  display: flex;
  align-items: center;
  position: relative;

  .dropdown-menu {
    position: absolute;
    top: 40px;
    right: 0;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 10px;
    display: none;

    a {
      text-decoration: none;
      color: #697483;
      display: block;
      padding: 10px 20px;
      &:hover {
        background-color: #f5f7fa;
      }
    }
  }

  &:hover .dropdown-menu {
    display: block;
  }
`;

const AlertsButton = styled.button`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 8px;
  border: 1px solid var(--Bluish-Purple-500, #6b3ceb);
  background-color: transparent;
  font-size: 10px;
  cursor: pointer;
  color: var(--Bluish-Purple-500, #6b3ceb);
  text-align: center;
  font-feature-settings: "liga" off, "clig" off;
  font-family: "DM Sans";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */

  svg {
    margin-right: 5px;
  }

  &:hover {
    background-color: #f5f7fa;
  }
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
`;

const Logo = styled.div`
  color: #1b2533;
  font-feature-settings: "liga" off, "clig" off;
  font-family: "Red Hat Display";
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 100% */
  letter-spacing: -1px;
`;

const SearchBarContainer = styled.div`
  display: flex;
  padding: 8px var(--py-0, 0px);
  align-items: center;
  gap: 5vw;
  margin-top: auto;
  margin-bottom: auto;
`;

const TabsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
`;

const NavBarTab = styled(Tab)`
  display: flex;
  padding: var(--py-0, 0px) 8px 16px 8px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  text-transform: none;
`;

const Header = () => {
  const [isAlertPanelOpen, setAlertPanelOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);

  const handleAlertButtonClick = () => {
    setAlertPanelOpen(!isAlertPanelOpen);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <TopbarContainer>
      <SearchBarContainer>
        <Logo>Therion</Logo>
        <InputContainer>
          <Search />
          <SearchInput type="text" placeholder="Search Module, Panel , Etc" />
        </InputContainer>
      </SearchBarContainer>
      <TabsContainer>
        <Tabs sx={{ marginTop: "0.7vh" }} value={value} onChange={handleChange}>
          <Tab label="Dashboard" value={"/"} />
          <Tab label="PEPPL(P1)" value={"/peppl_p1"} />
          <Tab label="PEPPL(P2)" value={"/peppl_p2"} />
          <Tab label="PEPPL(P3)" value={"/peppl_p3"} />
          <Tab label="HT" value={"/"} />
          <Tab label="Inverters" value={"/"} />
          <Tab label="Reports" value={"/"} />
          <Tab label="Comparisions" value={"/"} />
        </Tabs>
      </TabsContainer>
      <TopbarMenu>
        <TopbarItem>
          <Badge
            badgeContent={3}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "#5630BC", // Custom secondary color
                color: "white", // Color of the text in the badge
              },
            }}
          >
            <AlertsButton onClick={handleAlertButtonClick}>
              <NotificationsOutlined fontSize="small" />
              Alerts
            </AlertsButton>
          </Badge>
        </TopbarItem>
        <TopbarItem>
          <IconButton>
            <UserAvatar>DN</UserAvatar>
          </IconButton>
        </TopbarItem>
      </TopbarMenu>
    </TopbarContainer>
  );
};

export default Header;
