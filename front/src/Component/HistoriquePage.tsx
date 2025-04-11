import React, { useState, useEffect } from "react";
import { Table, Button, Layout, Modal, Typography, Card, Space, Tabs } from "antd";
import MisEnAttentes from "./MisEnAttentes";

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface Order {
  id: number;
  items: { key: number; name: string; quantity: number; price: number }[];
  total: number;
}


const Historique: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const savedOrders = localStorage.getItem("pendingOrders");
    if (savedOrders) {
      const parsedOrders: Order[] = JSON.parse(savedOrders).map((order: any) => ({
        ...order,
        total: parseFloat(order.total), // Convertit total en nombre
      }));
      setOrders(parsedOrders);
    }
  }, []);

  const showOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const clearHistory = () => {
    localStorage.removeItem("pendingOrders");
    setOrders([]);
  };

  const columns = [
    { title: "ID Commande", dataIndex: "id", key: "id" },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: number) => <Text strong>{total.toFixed(2)} €</Text>,
    },
    {
      title: "Détails",
      key: "details",
      render: (_: any, record: Order) => (
        <Button type="primary" onClick={() => showOrderDetails(record)}>
          Voir
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <Content style={{ padding: "20px", width: "800px", margin: "0 auto" }}>
        <Card bordered={false} style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", borderRadius: "8px" }}>
          <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
            Historique des commandes
          </Title>
          
          {/* Onglets pour naviguer entre les vues */}
          <Tabs defaultActiveKey="1">
            <TabPane tab="Historique des commandes" key="1">
              <Table columns={columns} dataSource={orders} rowKey="id" pagination={{ pageSize: 5 }} />
              <Space style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
                {orders.length > 0 && (
                  <Button type="primary" danger onClick={clearHistory}>
                    Effacer l'historique
                  </Button>
                )}
              </Space>
            </TabPane>
            
            <TabPane tab="Commandes en attente" key="2">
            <MisEnAttentes />

            </TabPane>
          </Tabs>
        </Card>

        <Modal
          title="Détails de la commande"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          {selectedOrder && (
            <div>
              <Text strong>ID Commande: </Text> {selectedOrder.id}
              <Table
                dataSource={selectedOrder.items}
                columns={[
                  { title: "Produit", dataIndex: "name", key: "name" },
                  { title: "Quantité", dataIndex: "quantity", key: "quantity" },
                  {
                    title: "Prix Unitaire",
                    dataIndex: "price",
                    key: "price",
                    render: (price: number) => `${price.toFixed(2)} €`,
                  },
                ]}
                rowKey="key"
                pagination={false}
                style={{ marginTop: "10px" }}
              />
              <Text strong style={{ fontSize: "16px", display: "block", marginTop: "10px" }}>
                Total: {selectedOrder.total.toFixed(2)} €
              </Text>
            </div>
          )}
        </Modal>
      </Content>
    </Layout>
  );
};

export default Historique;
