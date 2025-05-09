import React, { useState, useEffect } from 'react';
import {
  Table,
  Typography,
  Modal,
  Button,
  Divider,
  Popconfirm,
  Row,
  Col,
  List,
} from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';

interface Item {
  key: string;
  name: string;
  quantity: number;
  price: number;
}

interface CommandeValidee {
  id: number;
  total: number;
  paid: number;
  remainingAmount: number;
  promoCode: string;
  appliedDiscount: number;
  pointsUtilises: number;
  dateCommande: string; 
  client: {
    phoneNumber: string;
    name: string;
    firstName: string;
    address: string;
    pointsfidelite: number;
    cardfidelity: string;
  };
  items: Item[];
}

const HistoriqueCommandes: React.FC = () => {
  const [commandes, setCommandes] = useState<CommandeValidee[]>([]);
  const [selectedCommande, setSelectedCommande] = useState<CommandeValidee | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/commandes");
        const data = await response.json();
        setCommandes(data);
      } catch (error) {
        console.error("Erreur lors du chargement des commandes :", error);
      }
    };
  
    fetchCommandes();
  }, []);
  

  const formatMontant = (val: any) => {
    const num = parseFloat(val);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };
  
  const handleVoirDetails = (commande: CommandeValidee) => {
    setSelectedCommande(commande);
    setModalVisible(true);
  };

  const handleFermerModal = () => {
    setModalVisible(false);
    setSelectedCommande(null);
  };

  const handleSupprimerCommande = async (id: number) => {
    try {
      await fetch(`http://localhost:5000/api/commandes/${id}`, {
        method: "DELETE",
      });
      setCommandes(commandes.filter(cmd => cmd.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };
  

  const handleResetHistorique = () => {
    setCommandes([]);
    localStorage.removeItem('savedOrders');
  };

  const colonnes = [
    {
      title: 'ID Commande',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => <strong>{formatMontant(total)} €</strong>,
    },
    {
      title: 'Détails',
      key: 'details',
      render: (_: any, record: CommandeValidee) => (
        <Button
          shape="circle"
          icon={<EyeOutlined />}
          onClick={() => handleVoirDetails(record)}
        />
      ),
    },
    {
      title: 'Supprimer',
      key: 'delete',
      render: (_: any, record: CommandeValidee) => (
        <Popconfirm
          title="Supprimer cette commande ?"
          onConfirm={() => handleSupprimerCommande(record.id)}
        >
          <Button danger shape="circle" icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, maxHeight: '90vh', overflow: 'hidden' }}>
      <Typography.Title level={4}>Historique des commandes</Typography.Title>
      <Table
        columns={colonnes}
        dataSource={commandes}
        rowKey="id"
        pagination={{ pageSize: 6 }}
      />
      {commandes.length > 0 && (
        <Button
          danger
          type="primary"
          onClick={handleResetHistorique}
          style={{ marginTop: 16 }}
        >
          Effacer l'historique
        </Button>
      )}
      <Modal
        open={modalVisible}
        title={<Typography.Title level={4} style={{ margin: 0 }}>🧾 Détails de la commande #{selectedCommande?.id}</Typography.Title>}
        onCancel={handleFermerModal}
        footer={<Button type="primary" onClick={handleFermerModal}>Fermer</Button>}
        width={750}
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto', padding: '24px' }}
      >
        {selectedCommande && (
          <>
            {/* Section Client */}
            <Typography.Title level={5}>👤 Informations client</Typography.Title>
            <Row gutter={16}>
              <Col span={12}>
                <p><strong>Nom :</strong> {selectedCommande.client.firstName} {selectedCommande.client.name}</p>
                <p><strong>Téléphone :</strong> {selectedCommande.client.phoneNumber}</p>
              </Col>
              <Col span={12}>
                <p><strong>Adresse :</strong> {selectedCommande.client.address}</p>
                <p><strong>Carte fidélité :</strong> {selectedCommande.client.cardfidelity}</p>
              </Col>
            </Row>

            <Divider />

            {/* Section Articles */}
            <Typography.Title level={5}>🛒 Articles commandés</Typography.Title>
            <List
              dataSource={selectedCommande.items}
              renderItem={(item) => (
                <List.Item key={item.key}>
                  <Row style={{ width: '100%' }}>
                    <Col span={16}>
                      {item.name} x {item.quantity}
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      {(item.quantity * item.price).toFixed(2)} €
                    </Col>
                  </Row>
                </List.Item>
              )}
            />

            <Divider />

            {/* Section Paiement */}
            <Typography.Title level={5}>💳 Détails du paiement</Typography.Title>
            <Row>
              <Col span={12}>
                <p><strong>Total :</strong></p>
                {selectedCommande.appliedDiscount > 0 && <p><strong>Remise promo :</strong></p>}
                {selectedCommande.pointsUtilises > 0 && (
                  <p><strong>Points utilisés :</strong></p>
                )}
                <p><strong>Payé :</strong></p>
                <p><strong>Reste à payer :</strong></p>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <p>{formatMontant(selectedCommande.total)} €</p>
                {selectedCommande.appliedDiscount > 0 && (
                  <p>-{formatMontant(selectedCommande.appliedDiscount)} €</p>
                )}
                {selectedCommande.pointsUtilises > 0 && (
                  <p>{selectedCommande.pointsUtilises}</p>
                )}
                <p>{formatMontant(selectedCommande.paid)} €</p>
                <p>{formatMontant(selectedCommande.remainingAmount)} €</p>
              </Col>
            </Row>
          </>
        )}
      </Modal>

    </div>
  );
};

export default HistoriqueCommandes;
