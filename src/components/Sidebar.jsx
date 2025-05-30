import React from "react";
import { RiChatSmileAiFill } from "react-icons/ri";
import { RiRoadMapFill } from "react-icons/ri";
import { GoHomeFill } from "react-icons/go";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const paths = {
    "/home": "1",
    "/chat-with-ai": "2",
    "/my-roadmaps": "3",
  };
  const selectedKey = paths[location.pathname] || "1";

  const sidebarItems = [
    {
      key: "1",
      icon: <GoHomeFill />,
      label: "Home",
    },
    {
      key: "2",
      icon: <RiChatSmileAiFill />,
      label: "Chat with AI",
    },
    {
      key: "3",
      icon: <RiRoadMapFill />,
      label: "My Roadmaps",
    },
  ];

  const handleMenuClick = (e) => {
    if (e.key === "1") navigate("/home");
    else if (e.key === "2") navigate("/chat-with-ai");
    else if (e.key === "3") navigate("/my-roadmaps");
  };

  return (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      style={{ height: "100%" }}
      items={sidebarItems}
      onClick={handleMenuClick}
    />
  );
};

export default Sidebar;
