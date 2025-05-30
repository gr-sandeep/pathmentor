import React, { useState } from "react";
import { Layout as AntLayout, ConfigProvider, theme } from "antd";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { PathmentorContext } from "../utils/Context";
import secureLocalStorage from "react-secure-storage";

const { Sider, Content } = AntLayout;

const Layout = ({ children }) => {
  const userInfo = secureLocalStorage.getItem("userInfo");
  const [collapsed, setCollapsed] = useState(false);
  const { appTheme, setAppTheme } = PathmentorContext();
  console.log({ appTheme });
  return (
    <ConfigProvider>
      <AntLayout className="min-h-screen w-full">
        {userInfo && (
          <Header setCollapsed={setCollapsed} collapsed={collapsed} />
        )}
        <AntLayout className="h-[91vh] flex">
          {userInfo && (
            <Sider
              trigger={null}
              collapsible
              collapsed={collapsed}
              className="h-full shadow"
            >
              <Sidebar />
            </Sider>
          )}
          <Content className="flex-1 min-h-0 h-full overflow-auto">
            {children}
          </Content>
        </AntLayout>
      </AntLayout>
    </ConfigProvider>
  );
};

export default Layout;
