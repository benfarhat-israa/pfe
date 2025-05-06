import React, { useEffect, useState } from "react";
import { Card, Typography, Button, Row, Col, message, Pagination } from "antd";
import Paiment from "./paiment";

const { Text } = Typography;

interface Item {
  key: string;
  name: string;
  quantity: number;
  prixttc: number;
}

interface Commande {
  commandeNum: string;
  nombreArticles: number;
  totalCommande: number;
  resteAPayer: number;
  items: Item[];
}



type CommandesAttentePagePropsType = {
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
  setCart: any;
};

function CommandesAttentePage({ setActivePage, setCart }: CommandesAttentePagePropsType) {
  const [commandesAttente, setCommandesAttente] = useState<Commande[]>([]);
  const [selectedCommande, setSelectedCommande] = useState<Commande | null>(null);
  const [isPaiementModalVisible, setPaiementModalVisible] = useState(false);
  const [selectedPaiementTotal, setSelectedPaiementTotal] = useState<number>(0);
  const [onPaiementSuccess, setOnPaiementSuccess] = useState<(() => void) | null>(null);
  const [infoClient] = useState({
    phoneNumber: "",
    name: "",
    firstName: "",
    address: "",
    pointsfidelite: 0,
    cardfidelity: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Fonction pour charger les commandes depuis localStorage
  const loadPendingOrders = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("pendingOrders") || "[]");
      setCommandesAttente(stored);
    } catch (e) {
      console.error("Erreur de lecture des commandes", e);
      setCommandesAttente([]);
    }
  };

  useEffect(() => {
    loadPendingOrders();
  }, []);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCommandes = commandesAttente.slice(startIndex, endIndex);

  const handleAnnuler = (globalIndex: number) => {
    const updated = commandesAttente.filter((_, i) => i !== globalIndex);
    setCommandesAttente(updated);
    localStorage.setItem("pendingOrders", JSON.stringify(updated));
    message.warning("Commande annulée.");
  };

  const handleContinuer = (commande: Commande) => {
    if (commande.items && commande.items.length > 0) {
      message.success("Commande restaurée dans le panier.");
      setActivePage("home");
      setCart(commande.items);
    }

    const updatedPendingOrders = commandesAttente.filter(c => c.commandeNum !== commande.commandeNum);
    setCommandesAttente(updatedPendingOrders);
    localStorage.setItem("pendingOrders", JSON.stringify(updatedPendingOrders));
  };

  const handleValider = (commande: Commande, globalIndex: number) => {
    setSelectedCommande(commande);
    const total = commande.resteAPayer ?? commande.totalCommande ?? 0;
    setSelectedPaiementTotal(typeof total === "string" ? parseFloat(total) : total);

    const onSuccessPaiement = () => {
      const updated = commandesAttente.filter((_, i) => i !== globalIndex);
      setCommandesAttente(updated);
      localStorage.setItem("pendingOrders", JSON.stringify(updated));
      message.success("Commande validée et supprimée.");
    };

    setPaiementModalVisible(true);
    setOnPaiementSuccess(() => onSuccessPaiement);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: 20 }}>
      <Typography.Title level={4}>Commandes en attente</Typography.Title>
      <div style={{ flex: 1 }}>
        <Row gutter={[16, 16]}>
          {paginatedCommandes.map((commande, index) => {
            const globalIndex = startIndex + index;
            return (
              <Col span={12} key={globalIndex}>
                <Card style={{ height: "150px", marginTop: "0px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div style={{ flex: 1 }}>
                      <Text strong>Cmd num :</Text> {commande.commandeNum || "-"} <br />
                      <Text strong>Nbr articles :</Text> {commande.nombreArticles || 0} <br />
                      <Text strong>Total cmd :</Text>{" "}
                      {commande.totalCommande
                        ? parseFloat(commande.totalCommande.toString()).toFixed(2)
                        : "0.00"} € <br />
                      <Text strong>Reste à payer :</Text>{" "}
                      <Text>
                        {commande.resteAPayer
                          ? parseFloat(commande.resteAPayer.toString()).toFixed(2)
                          : "0.00"} €
                      </Text>{" "}
                      <br />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginLeft: "15px" }}>
                      <Button
                        type="primary"
                        ghost
                        style={{ borderColor: "#1890ff", color: "#1890ff" }}
                        onClick={() => handleContinuer(commande)}
                      >
                        Continuer
                      </Button>
                      <Button
                        type="primary"
                        ghost
                        style={{ borderColor: "#52c41a", color: "#52c41a" }}
                        onClick={() => handleValider(commande, globalIndex)}
                      >
                        Valider
                      </Button>
                      <Button
                        type="primary"
                        ghost
                        danger
                        style={{ borderColor: "#ff4d4f", color: "#ff4d4f" }}
                        onClick={() => handleAnnuler(globalIndex)}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>

        {commandesAttente.length === 0 && (
          <Text type="secondary">Aucune commande en attente pour le moment.</Text>
        )}

        <div style={{ textAlign: "center", marginTop: "auto", paddingTop: 20 }}>
          {commandesAttente.length > 0 && (
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={commandesAttente.length}
              onChange={page => setCurrentPage(page)}
            />
          )}
        </div>

        <Paiment
          open={isPaiementModalVisible}
          onClose={() => setPaiementModalVisible(false)}
          total={selectedPaiementTotal}
          infoClient={infoClient}
          panier={selectedCommande?.items ?? []}
          onSuccess={onPaiementSuccess ?? undefined}
        />

      </div>
    </div>

  );
}

export default CommandesAttentePage;
