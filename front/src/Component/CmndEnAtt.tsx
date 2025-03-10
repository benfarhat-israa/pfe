import React from "react";
import { Card, Col, Row, Button, Typography, Divider } from "antd";

const { Title, Text } = Typography;

const commandesAttente = [
  { commandeNum: "CMD12345", nombreArticles: 5, totalCommande: 150.0, resteAPayer: 50.0 },
  { commandeNum: "CMD67890", nombreArticles: 3, totalCommande: 80.0, resteAPayer: 20.0 },
  { commandeNum: "CMD54321", nombreArticles: 4, totalCommande: 120.0, resteAPayer: 0.0 },
  { commandeNum: "CMD09876", nombreArticles: 6, totalCommande: 200.0, resteAPayer: 0.0 },
];



const CommandeList = ({ title, commandes }: { title: string; commandes: any[] }) => {
  return (
    <Card title={title} bordered={false} style={{ textAlign: "center" }}>
      {commandes.map((commande, index) => (
        <div key={index}>
          <Title level={4}>Commande N°: {commande.commandeNum}</Title>
          <Text strong>Nombre d'articles: </Text> {commande.nombreArticles} <br />
          <Text strong>Total Commande: </Text> {commande.totalCommande} € <br />
          <Text strong>Reste à payer: </Text> {commande.resteAPayer} € <br /><br />

          <Row gutter={16} justify="center">
            <Col>
              <Button
                type="primary"
                style={{
                  backgroundColor: "transparent",
                  borderColor: "#1890ff", 
                  color: "#1890ff", 
                }}
              >
                Continuer
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                style={{
                  backgroundColor: "transparent",
                  borderColor: "green", 
                  color: "green", 
                }}
              >
                Valider
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                danger
                style={{
                  backgroundColor: "transparent",
                  borderColor: "red", 
                  color: "red", 
                }}
              >
                Annuler
              </Button>
            </Col>
          </Row>

          {index < commandes.length - 1 && (
            <Divider style={{ borderColor: "#7cb305" }} dashed />
          )}
        </div>
      ))}
    </Card>
  );
};

const App: React.FC = () => {
  return (
    <Row gutter={24} justify="center" style={{ marginTop: 50 }}>
      <Col span={12}>
        <CommandeList title="Commandes en attente" commandes={commandesAttente} />
      </Col>
      <Col span={12}>
      </Col>
    </Row>
  );
};

export default App;
