import React from 'react';
import { Card, Typography, Button, Row, Col, Modal } from 'antd';

const { Text } = Typography;

// Définition des types des props du modal
interface CommandesModalProps {
  visible: boolean;
  onClose: () => void;
}

// Liste des commandes en attente
const commandesAttente = [
  { commandeNum: "1524642", nombreArticles: 12, totalCommande: 12345.32, resteAPayer: 10245.2 },
  { commandeNum: "202502270003", nombreArticles: 1, totalCommande: 15.5, resteAPayer: 15.5 },
  { commandeNum: "1524642", nombreArticles: 12, totalCommande: 12345.32, resteAPayer: 10245.2 },
  { commandeNum: "1524642", nombreArticles: 12, totalCommande: 12345.32, resteAPayer: 10245.2 },
  { commandeNum: "1524642", nombreArticles: 12, totalCommande: 12345.32, resteAPayer: 10245.2 },
  { commandeNum: "1524642", nombreArticles: 12, totalCommande: 12345.32, resteAPayer: 10245.2 },
];

const CommandesModal: React.FC<CommandesModalProps> = ({ visible, onClose }) => {
  return (
    <Modal title="Commandes en attentes" open={visible} onCancel={onClose} footer={null} width={900}>
      <Row gutter={[16, 16]}>
        {commandesAttente.map((commande, index) => (
          <Col span={12} key={index}>
            <Card>
              <Text strong>Cmd num :</Text> {commande.commandeNum} <br />
              <Text strong>Nbr articles :</Text> {commande.nombreArticles} <br />
              <Text strong>Total cmd :</Text> {commande.totalCommande.toFixed(2)} € <br />
              <Text strong>Reste à payer :</Text> <Text>{commande.resteAPayer.toFixed(2)} €</Text> <br />
              <Row gutter={8} justify="center" style={{ marginTop: 10 }}>
                <Col>
                  <Button 
                    type="primary" 
                    ghost 
                    style={{ 
                      backgroundColor: 'transparent', 
                      borderColor: '#1890ff', 
                      color: '#1890ff' 
                    }}
                  >
                    Continuer
                  </Button>
                </Col>
                <Col>
                  <Button 
                    type="primary" 
                    ghost 
                    style={{ 
                      backgroundColor: 'transparent', 
                      borderColor: '#52c41a', 
                      color: '#52c41a' 
                    }}
                  >
                    Valider
                  </Button>
                </Col>
                <Col>
                  <Button 
                    type="primary" 
                    ghost 
                    danger 
                    style={{ 
                      backgroundColor: 'transparent', 
                      borderColor: '#ff4d4f', 
                      color: '#ff4d4f' 
                    }}
                  >
                    Annuler
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <Button type="default" onClick={onClose}>Fermer</Button>
      </div>
    </Modal>
  );
};

const App: React.FC = () => {
  const [visible, setVisible] = React.useState<boolean>(true);

  return (
    <div style={{ padding: 20 }}>
      <Button type="primary" onClick={() => setVisible(true)}>Afficher les commandes</Button>
      <CommandesModal visible={visible} onClose={() => setVisible(false)} />
    </div>
  );
};

export default App;
