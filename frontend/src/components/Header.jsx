import React from "react";
import logo from "../assets/logo.png";
import { Link, NavLink, useNavigate } from "react-router";
import secureLocalStorage from "react-secure-storage";
import { auth, signOut } from "../utils/Firebase";
import { Dropdown } from "antd";
import { TbLogout2 } from "react-icons/tb";
import { MdOutlineAccountCircle } from "react-icons/md";

const Header = () => {
  const navigate = useNavigate();
  const userInfo = secureLocalStorage.getItem("userInfo");

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
        <div className="flex items-center gap-4 px-1" onClick={handleLogout}>
          <TbLogout2 fontSize={22} />
          <p>Logout</p>
        </div>
      ),
    },
  ];

  return (
    <div className="shadow-md flex items-center justify-between p-5 sticky top-0 z-50 bg-white w-full">
      <img
        onClick={() => navigate("/dashboard")}
        src={logo}
        className="w-[160px] cursor-pointer"
        alt=""
      />

      <div className="flex gap-6 items-center">
        <ul className="flex flex-row items-center gap-6 px-5">
          <NavLink
            to={"/dashboard"}
            className={({ isActive }) =>
              isActive
                ? "bg-gray-300 p-1 px-3 rounded-full font-semibold"
                : "hover:opacity-80"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/my-progress"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-300 p-1 px-3 rounded-full font-semibold"
                : "hover:opacity-80"
            }
          >
            My Progress
          </NavLink>
        </ul>

        <Dropdown menu={{ items }} trigger={["click"]}>
          <img src={userInfo.userImg} className="size-10 rounded-full" alt="" />
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
