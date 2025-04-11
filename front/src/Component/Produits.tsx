import React from "react";
import { Layout, Tabs } from "antd";
import Articles from "./Articles";
import Categories from "./Categories";

const { Content } = Layout;
const { TabPane } = Tabs;

const Produits = () => {
  return (
    <Layout>
      <Content style={{ padding: "20px" }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Gestion des articles" key="1">
            <Articles />
          </TabPane>
          <TabPane tab="Gestion des catégories" key="2">
            <Categories />
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default Produits;
