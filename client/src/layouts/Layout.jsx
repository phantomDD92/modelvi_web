import { Layout } from "antd";
import React from "react";
import SiderBar from "./SiderBar";
import HeaderBar from "./Header";

const { Content, Footer } = Layout;

const Layouts = ({ children }) => {
  return (
    <Layout className="h-full">
      <SiderBar />
      <Layout>
        <HeaderBar />
        <Content className="m-4 max-h-full overflow-auto overflow-x-hidden">     
            {children}
        </Content>
        <Footer className="text-center h-12">
          ModelVI ©{new Date().getFullYear()} Created by David
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Layouts;
