import { Layout, Typography, Divider, Menu as AntdMenu, Row, Col } from "antd";
import React from "react";
import VirtualKeyboard from "./VirtualKeyboard"; // Assurez-vous que le composant VirtualKeyboard est importé

const { Sider } = Layout;
const { Title } = Typography;

interface MenuPageProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const MenuPage: React.FC<MenuPageProps> = ({ activePage, setActivePage }) => {
  // Fonction pour gérer le changement de page
  const handleMenuClick = ({ key }: { key: string }) => {
    setActivePage(key); // Met à jour la page active
  };

  return (
    <Row>
      <Col>
        <Sider
          width="100%"
          className="bg-white shadow-sm"
          style={{ height: "100%", position: "fixed", overflow: "auto", marginLeft: "auto" }}
        >
          <Title level={4}>Menu</Title>
          <Divider />
          <AntdMenu mode="inline" theme="light" selectedKeys={[activePage]} onClick={handleMenuClick}>
            <AntdMenu.Item key="home" style={{ height: 150 }}>
              <img src="https://cdn-icons-png.flaticon.com/512/25/25694.png" alt="Home" style={{ width: 50, height: 40 }} />
              Accueil
            </AntdMenu.Item>
            <AntdMenu.Item key="keyboard" style={{ height: 150 }}>
              <img src="https://cdn-icons-png.flaticon.com/512/40/40144.png" alt="Clavier" style={{ width: 50, height: 40 }} />
              Clavier
            </AntdMenu.Item>
            <AntdMenu.Item key="historique" style={{ height: 150 }}>
              <img src="https://cdn-icons-png.flaticon.com/512/32/32284.png" alt="Historique" style={{ width: 50, height: 40 }} />
              Historique
            </AntdMenu.Item>
            <AntdMenu.Item key="outil" style={{ height: 150 }}>
              <img src="https://cdn-icons-png.flaticon.com/512/69/69886.png" alt="Outil" style={{ width: 50, height: 40 }} />
              Outil
            </AntdMenu.Item>
          </AntdMenu>
        </Sider>

        {/* Afficher le clavier virtuel si "keyboard" est la page active */}
        {activePage === "keyboard" && <VirtualKeyboard onChange={(input) => console.log(input)} />}
      </Col>
    </Row>
  );
};

export default MenuPage;
