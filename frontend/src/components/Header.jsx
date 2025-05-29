import React from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router";
import secureLocalStorage from "react-secure-storage";
import { auth, signOut } from "../utils/Firebase";
import { Button, Dropdown } from "antd";
import { TbLogout2 } from "react-icons/tb";
import { MdOutlineAccountCircle } from "react-icons/md";
import { MdOutlineWbSunny } from "react-icons/md";
import { LuMoon } from "react-icons/lu";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { PathmentorContext } from "../utils/Context";

const Header = ({ setCollapsed, collapsed }) => {
  const navigate = useNavigate();
  const userInfo = secureLocalStorage.getItem("userInfo");
  const { appTheme, setAppTheme } = PathmentorContext()
  // from usecontext get the current theme (light or dark) and show icons or switch to based on the theme

  const handleLogout = async () => {
    try {
      const response = await signOut(auth);
      secureLocalStorage.clear();
      window.location = "/";
    } catch (error) {
      console.error(error);
    }
  };

  const items = [
    {
      key: "1",
      label: (
        <div
          className="flex items-center gap-4 px-1"
          onClick={() => navigate("/my-profile")}
        >
          <MdOutlineAccountCircle fontSize={24} />
          <p>My Profile</p>
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: (
        <div onClick={() => setAppTheme(prev => prev == 'light' ? 'dark' : "light")} className="flex items-center gap-4 px-1" >
          {appTheme == 'light' ? <><LuMoon fontSize={22} /><p>Switch to Dark Mode</p></> :
            <><MdOutlineWbSunny fontSize={22} /><p>Switch to Light Mode</p></>}
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: (
        <div className="flex items-center gap-4 px-1" onClick={handleLogout}>
          <TbLogout2 fontSize={22} />
          <p>Logout</p>
        </div>
      ),
    },
  ];

  return (
    <div className="shadow-md border-b border-white h-[9vh] flex items-center justify-between p-2 pr-3 pl-0 sticky top-0 z-50 w-full">
      <div className="flex gap-2 items-center">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '24px',
            width: 64,
            height: 64,
          }}
        />
        <img
          onClick={() => navigate("/home")}
          src={logo}
          className="w-[160px] cursor-pointer"
          alt=""
        />
      </div>

      <div className="flex gap-6 items-center ">
        <Dropdown menu={{ items }} trigger={["click"]}>
          <img src={userInfo.userImg} className="size-10 rounded-full cursor-pointer" alt="" />
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
