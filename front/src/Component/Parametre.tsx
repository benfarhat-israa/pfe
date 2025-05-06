import React from "react";
import { Layout, Tabs } from "antd";
import PromoPage from "./PromoPage";
import GestionFidelite from "./GestionFidelite";

const { Content } = Layout;
const { TabPane } = Tabs;

const Produits = () => {
  return (
    <Layout>
      <Content style={{ padding: "20px" }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Gestion des codes promo" key="1">
            <PromoPage />
          </TabPane>
          <TabPane tab="Gestion des points fidélités" key="2">
            <GestionFidelite />
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default Produits;
