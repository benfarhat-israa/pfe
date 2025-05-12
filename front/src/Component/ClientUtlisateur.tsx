import React from "react";
import { Layout, Tabs } from "antd";
import { CartItem } from "./HomePage";
import GereUtilisateur from "./GereUtilisateur";
import GestionClient from "./GestionClient";

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
                    <TabPane tab="Gestion des clients" key="1">
                        <GereUtilisateur />
                    </TabPane>
                    <TabPane tab="Gestion des utilisateurs" key="2">
                        <GestionClient />
                    </TabPane>
                </Tabs>
            </Content>
        </Layout>
    );
};

export default Produits;
