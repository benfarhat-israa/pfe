import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import HomePage, { CartItem } from "./HomePage"; // Import de la page d'accueil
import MenuPage from "./MenuPage"; // Import du menu
import KeyboardPage from "./KeyboardPage"; // Import du clavier
import Commande from "./Commande";
import Deconnection from "./Deconnection";

const POSSystem: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem("activePage") || "home";

  });

  useEffect(() => {
    localStorage.setItem("activePage", activePage);
  }, [activePage]);

  return (
    <Row style={{ height: "100vh", overflow: "hidden" }}>
      <Col xs={24} sm={24} md={22} lg={22} xl={22}>
        {activePage === "home" && <HomePage setCart={setCart} cart={cart} />}
        {activePage === "keyboard" && <KeyboardPage />}
        {activePage === "Commande" && <Commande setActivePage={setActivePage} setCart={setCart} />}
        {activePage === "deconnection" && <Deconnection setActivePage={setActivePage} />}

      </Col>
      <Col xs={24} sm={12} md={2} lg={2} xl={2} style={{ marginLeft: "auto" }}>
        <MenuPage activePage={activePage} setActivePage={setActivePage} />
      </Col>
    </Row>
  );
};

export default POSSystem;
