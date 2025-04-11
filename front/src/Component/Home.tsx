import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import HomePage from "./HomePage"; // Import de la page d'accueil
import HistoriquePage from "./HistoriquePage"; // Import de la page Historique
import OutilPage from "./OutilPage"; // Import de la page Outil
import MenuPage from "./MenuPage"; // Import du menu
import KeyboardPage from "./KeyboardPage"; // Import du clavier
import GereUtilisateur from "./GereUtilisateur";
import GestionClient from "./GestionClient";

const POSSystem: React.FC = () => {
  // Récupérer la dernière page active depuis localStorage
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem("activePage") || "home";
  });

  // Sauvegarder la page active dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem("activePage", activePage);
  }, [activePage]);

  return (
    <Row>
      <Col xs={24} sm={24} md={22} lg={22} xl={22}>
        {/* Afficher la page active */}
        {activePage === "home" && <HomePage />}
        {activePage === "keyboard" && <KeyboardPage />}
        {activePage === "Commande" && <HistoriquePage />}
        {activePage === "catalogue" && <OutilPage />}
        {activePage === "utilisateur" && <GereUtilisateur />}
        {activePage === "client" && <GestionClient />}


      </Col>
      <Col xs={24} sm={12} md={2} lg={2} xl={2} style={{ marginLeft: "auto" }}>
        {/* Afficher le menu avec la page active */}
        <MenuPage activePage={activePage} setActivePage={setActivePage} />
      </Col>
    </Row>
  );
};

export default POSSystem;
