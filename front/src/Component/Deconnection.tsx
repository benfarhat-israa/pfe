import React from "react";
import { Modal, Button, Typography } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface DeconnectionProps {
  setActivePage: (page: string) => void;
}

const Deconnection: React.FC<DeconnectionProps> = ({ setActivePage }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activePage");
    window.location.href = "/login"; // ou navigate("/login") si tu utilises react-router
  };

  const handleCancel = () => {
    setActivePage("home"); // revient proprement à la page d’accueil
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ExclamationCircleOutlined style={{ color: "#faad14", fontSize: "20px" }} />
          <span>Confirmation de déconnexion</span>
        </div>
      }
      open={true}
      centered
      closable={false}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Annuler
        </Button>,
        <Button key="logout" type="primary" danger onClick={handleLogout}>
          Se déconnecter
        </Button>,
      ]}
    >
      <Text>Êtes-vous sûr de vouloir vous déconnecter ?</Text>
      <br />
      <Text type="secondary">Toutes les données non sauvegardées seront perdues.</Text>
    </Modal>
  );
};

export default Deconnection;
