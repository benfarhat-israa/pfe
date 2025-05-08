import { Menu as AntdMenu, Row, Col } from "antd";
import React from "react";
import { useLocation } from "react-router-dom"; // ← ajout

interface MenuPageProps {
  activePage: string;
  setActivePage: (page: string) => void;
}


const MenuPage: React.FC<MenuPageProps> = ({ activePage, setActivePage }) => {
  const { pathname } = useLocation();

  const handleMenuClick = ({ key }: { key: string }) => {
    setActivePage(key);
  };

  const commonItems = [
    {
      key: "home",
      label: "Accueil",
      icon: "https://cdn-icons-png.flaticon.com/512/25/25694.png",
    },
    {
      key: "keyboard",
      label: "Clavier",
      icon: "https://cdn-icons-png.flaticon.com/512/40/40144.png",
    },
    {
      key: "Commande",
      label: "Commande",
      icon: "https://cdn-icons-png.flaticon.com/512/6948/6948527.png",
    },
  ];

  const logoutItem = {
    key: "deconnection",
    label: "Déconnexion",
    icon: "https://cdn-icons-png.flaticon.com/512/152/152535.png",
  };

  const adminItems = [
    {
      key: "catalogue",
      label: "Catalogue",
      icon: "https://cdn-icons-png.flaticon.com/512/69/69886.png",
    },
    {
      key: "utilisateur",
      label: "Utilisateur",
      icon: "https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small/user-icon-on-transparent-background-free-png.png",
    },
    {
      key: "client",
      label: "Client",
      icon: "https://cdn-icons-png.flaticon.com/512/686/686317.png",
    },
    {
      key: "paramètre",
      label: "Paramètre",
      icon: "https://cdn-icons-png.flaticon.com/512/2099/2099058.png",
    },
  ];

  const menuItems = pathname === "/home" ? [...commonItems, ...adminItems] : commonItems;

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
          {menuItems.map(({ key, label, icon }) => (
            <AntdMenu.Item
              key={key}
              style={{
                height: 90,
                textAlign: "center",
                border: "1px solid #ddd",
                borderRadius: 10,
                marginBottom: 8,
              }}
            >
              <Row justify="center">
                <img src={icon} alt={label} style={{ width: 30, height: 20 }} />
              </Row>
              <Row justify="center">{label}</Row>
            </AntdMenu.Item>
          ))}

          {/* Bouton déconnexion tout en bas */}
          <AntdMenu.Item
            key={logoutItem.key}
            style={{
              height: 90,
              textAlign: "center",
              border: "1px solid #ddd",
              borderRadius: 10,
              marginTop: 20,
            }}
          >
            <Row justify="center">
              <img src={logoutItem.icon} alt={logoutItem.label} style={{ width: 30, height: 20 }} />
            </Row>
            <Row justify="center">{logoutItem.label}</Row>
          </AntdMenu.Item>
        </AntdMenu>
      </Col>
    </Row>
  );
};

export default MenuPage;
