import { Card, Typography, Button, Row, Col } from "antd";

const { Text } = Typography;

const commandesAttente = [
  { commandeNum: "1524642", nombreArticles: 12, totalCommande: 12345.32, resteAPayer: 10245.2 },
  { commandeNum: "202502270003", nombreArticles: 1, totalCommande: 15.5, resteAPayer: 15.5 },
  { commandeNum: "1524642", nombreArticles: 12, totalCommande: 12345.32, resteAPayer: 10245.2 },
  { commandeNum: "1524642", nombreArticles: 12, totalCommande: 12345.32, resteAPayer: 10245.2 },
  { commandeNum: "1524642", nombreArticles: 12, totalCommande: 12345.32, resteAPayer: 10245.2 },
  { commandeNum: "1524642", nombreArticles: 12, totalCommande: 12345.32, resteAPayer: 10245.2 },
];

const App: React.FC = () => {
  return (
    <div style={{ padding: 20 }}>
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
                      borderColor: "#1890ff",
                      color: "#1890ff",
                    }}
                  >
                    Continuer
                  </Button>
                  <Button
                    type="primary"
                    ghost
                    style={{
                      backgroundColor: "transparent",
                      borderColor: "#52c41a",
                      color: "#52c41a",
                    }}
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
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default App;
