import { Menu as AntdMenu, Row, Col } from "antd";
import React from "react";


interface MenuPageProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const MenuPage: React.FC<MenuPageProps> = ({ activePage, setActivePage }) => {
  const handleMenuClick = ({ key }: { key: string }) => {
    setActivePage(key);
  };

  return (
    <Row justify="center">
      <Col>
        <AntdMenu
          mode="inline"
          theme="light"
          selectedKeys={[activePage]}
          onClick={handleMenuClick}
          style={{ width: "100%", border: "none" }}
        >
          <AntdMenu.Item key="home" style={{ height: 100, textAlign: "center", border: "1px solid #ddd", borderRadius: 10, marginBottom: 8 }}>
            <Row justify="center">
              <img src="https://cdn-icons-png.flaticon.com/512/25/25694.png" alt="Home" style={{ width: 30, height: 20 }} />
            </Row>
            <Row justify="center" style={{ fontSize: "15px", width: "100%" }}>
              Accueil
            </Row>
          </AntdMenu.Item>

          <AntdMenu.Item key="keyboard" style={{ height: 100, textAlign: "center", border: "1px solid #ddd", borderRadius: 10, marginBottom: 8 }}>
            <Row justify="center">
              <img src="https://cdn-icons-png.flaticon.com/512/40/40144.png" alt="Clavier" style={{ width: 30, height: 20 }} />
            </Row>
            <Row justify="center">
              Clavier
            </Row>
          </AntdMenu.Item>
          <AntdMenu.Item key="Commande" style={{ height: 100, textAlign: "center", border: "1px solid #ddd", borderRadius: 10, marginBottom: 8 }}>
            <Row justify="center">
              <img src="https://cdn-icons-png.flaticon.com/512/6948/6948527.png" alt="Historique" style={{ width: 30, height: 20 }} />
            </Row>
            <Row justify="center">
              Commande
            </Row>
          </AntdMenu.Item>
          <AntdMenu.Item key="catalogue" style={{ height: 100, textAlign: "center", border: "1px solid #ddd", borderRadius: 10, marginBottom: 8 }}>
            <Row justify="center">
              <img src="https://cdn-icons-png.flaticon.com/512/69/69886.png" alt="Outil" style={{ width: 30, height: 20 }} />
            </Row>
            <Row justify="center">
              Catalogue
            </Row>
          </AntdMenu.Item>
          <AntdMenu.Item key="utilisateur" style={{ height: 100, textAlign: "center", border: "1px solid #ddd", borderRadius: 10, marginBottom: 8 }}>
            <Row justify="center">
              <img src="https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small/user-icon-on-transparent-background-free-png.png" alt="Outil" style={{ width: 30, height: 20 }} />
            </Row>
            <Row justify="center">
            Utilisateur
            </Row>
          </AntdMenu.Item>
          <AntdMenu.Item key="client" style={{ height: 100, textAlign: "center", border: "1px solid #ddd", borderRadius: 10, marginBottom: 8 }}>
            <Row justify="center">
              <img src="https://cdn-icons-png.flaticon.com/512/686/686317.png" alt="Outil" style={{ width: 30, height: 20 }} />
            </Row>
            <Row justify="center">
            Client
            </Row>
          </AntdMenu.Item>
        </AntdMenu>
      </Col>
    </Row>
  );
};

export default MenuPage;
