import React, { useState } from "react";
import { Layout, Button, Card, Row, Col, Menu } from "antd";
import { CreditCardOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";

const { Header, Content, Sider } = Layout;

// Définition du type pour les desserts
interface Dessert {
  name: string;
  price: number;
  image: string;
}

const desserts: Dessert[] = [
  { name: "Tiramisu", price: 4.5, image: "/images/tiramisu.jpg" },
  { name: "Fondant Chocolat", price: 5, image: "/images/fondant.jpg" },
  { name: "Cheesecake", price: 4.8, image: "/images/cheesecake.jpg" },
];

const App: React.FC = () => {
  const [cart, setCart] = useState<Dessert[]>([]);

  const addToCart = (item: Dessert) => {
    setCart([...cart, item]);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={300} className="bg-light p-3">
        <h5>En attente : {cart.length}</h5>
        <div className="border p-2 bg-white">
          {cart.map((item, index) => (
            <p key={index}>
              {item.name} - {item.price}€
            </p>
          ))}
          <hr />
          <h6>
            Total: {cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)} €
          </h6>
        </div>
        <div className="mt-3 d-flex justify-content-between">
          <Button type="primary" danger icon={<CloseOutlined />}>
            Annuler
          </Button>
          <Button type="primary" icon={<CheckOutlined />}>
            Valider
          </Button>
        </div>
        <h6 className="mt-3">Moyens de paiement</h6>
        <div className="d-flex flex-wrap gap-2">
          <Button icon={<CreditCardOutlined />}>CB</Button>
          <Button>Espèces</Button>
          <Button>TR</Button>
          <Button>CHQ</Button>
        </div>
      </Sider>

      <Layout>
        <Header className="bg-white px-3">
          <Menu mode="horizontal" defaultSelectedKeys={["2"]}>
            <Menu.Item key="1">Emporter</Menu.Item>
            <Menu.Item key="2">Sur Place</Menu.Item>
            <Menu.Item key="3">Livraison</Menu.Item>
            <Menu.Item key="4">Drive</Menu.Item>
            <Menu.Item key="5">À table</Menu.Item>
          </Menu>
        </Header>
        <Content className="p-4">
          <h5>Desserts</h5>
          <Row gutter={[16, 16]}>
            {desserts.map((dessert, index) => (
              <Col span={6} key={index}>
                <Card
                  hoverable
                  cover={<img alt={dessert.name} src={dessert.image} />}
                  onClick={() => addToCart(dessert)}
                >
                  <Card.Meta title={`${dessert.name} - ${dessert.price}€`} />
                </Card>
              </Col>
            ))}
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
