import React from "react";
import { Layout, Tabs } from "antd";
import MisEnAttentes from "./MisEnAttentes";
import HistoriquePage from "./HistoriquePage";
import { CartItem } from "./HomePage";

const { Content } = Layout;
const { TabPane } = Tabs;
type CommandePropsType = {
    setActivePage: React.Dispatch<React.SetStateAction<string>>
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
}
const Produits = ({ setActivePage, setCart }: CommandePropsType) => {
    return (
        <Layout >
            <Content style={{ padding: "20px" }}>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Historique des commandee" key="1">
                        < HistoriquePage  />
                    </TabPane>
                    <TabPane tab="Commandes en attente" key="2">
                        <MisEnAttentes setActivePage={setActivePage} setCart={setCart} />
                    </TabPane>
                </Tabs>
            </Content>
        </Layout>
    );
};

export default Produits;
