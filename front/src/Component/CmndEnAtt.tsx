import React, { useState } from "react";
import { Card, Typography, Button, Row, Col, Modal } from "antd";

const { Text } = Typography;

interface CommandesModalProps {
  visible: boolean;
  onClose: () => void;
}

const initialCommandesAttente = [
  { commandeNum: "1524642", nombreArticles: 12, totalCommande: 12345.32, resteAPayer: 10245.2 },
  { commandeNum: "202502270003", nombreArticles: 1, totalCommande: 15.5, resteAPayer: 15.5 },
  { commandeNum: "1321551", nombreArticles: 5, totalCommande: 500.5, resteAPayer: 200.5 },
  { commandeNum: "4253623", nombreArticles: 7, totalCommande: 7000.0, resteAPayer: 3000.0 },
  { commandeNum: "4253623", nombreArticles: 7, totalCommande: 7000.0, resteAPayer: 3000.0 },
  { commandeNum: "4253623", nombreArticles: 7, totalCommande: 7000.0, resteAPayer: 3000.0 },

];

const CommandesModal: React.FC<CommandesModalProps> = ({ visible, onClose }) => {
  const [commandesAttente, setCommandesAttente] = useState(initialCommandesAttente);

  const handleContinuer = (commandeNum: string) => {
    alert(`Continuer la commande n° ${commandeNum}`);
  };

  const handleValider = (commandeNum: string) => {
    alert(`Commande n° ${commandeNum} validée`);
  };

  const handleAnnuler = (commandeNum: string) => {
    // Remove the selected command from the list
    const updatedCommandes = commandesAttente.filter(
      (commande) => commande.commandeNum !== commandeNum
    );
    setCommandesAttente(updatedCommandes); // Update state
    alert(`Commande n° ${commandeNum} supprimée`);
  };

  return (
    <Modal
      title="Commandes en attentes"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
    >
      <Row gutter={[16, 16]}>
        {commandesAttente.map((commande, index) => (
          <Col span={12} key={index}>
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div style={{ flex: 1 }}>
                  <Text strong>Cmd num :</Text> {commande.commandeNum} <br />
                  <Text strong>Nbr articles :</Text> {commande.nombreArticles} <br />
                  <Text strong>Total cmd :</Text> {commande.totalCommande.toFixed(2)} € <br />
                  <Text strong>Reste à payer :</Text> <Text>{commande.resteAPayer.toFixed(2)} €</Text> <br />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginLeft: "15px" }}>
                  <Button
                    type="primary"
                    ghost
                    style={{
                      backgroundColor: "transparent",
                      borderColor: "#0050b3",
                      color: "#0050b3",
                    }}
                    onClick={() => handleContinuer(commande.commandeNum)}
                  >
                    Continuer
                  </Button>

                  <Button
                    type="primary"
                    ghost
                    style={{
                      backgroundColor: "transparent",
                      borderColor: "#009A24",
                      color: "#009A24",
                    }}
                    onClick={() => handleValider(commande.commandeNum)}
                  >
                    Valider
                  </Button>

                  <Button
                    type="primary"
                    ghost
                    danger
                    style={{
                      backgroundColor: "transparent",
                      borderColor: "#ff4d4f",
                      color: "#ff4d4f",
                    }}
                    onClick={() => handleAnnuler(commande.commandeNum)}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <Button type="default" onClick={onClose}>
          Fermer
        </Button>
      </div>
    </Modal>
  );
};

const App: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(true);

  return (
    <div style={{ padding: 20 }}>
      <Button type="primary" onClick={() => setVisible(true)}>
        Afficher les commandes
      </Button>
      <CommandesModal visible={visible} onClose={() => setVisible(false)} />
    </div>
  );
};

export default App;
