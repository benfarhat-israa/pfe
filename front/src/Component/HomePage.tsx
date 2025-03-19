import React, { useState } from "react";
import { Layout, Button, Table, Card, Row, Col, Typography, Divider, Space, Modal, InputNumber, Input } from "antd";
import { CheckOutlined, CloseOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import ClientInfo from "./ClientInfo";
import { useNavigate } from "react-router-dom";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

interface CartItem {
  key: number;
  name: string;
  quantity: number;
  price: number;
}
// Catégories disponibles
const categories = [
  { id: 1, name: "ENTRÉE" },
  { id: 2, name: "PLATS" },
  { id: 3, name: "SAUCES" },
  { id: 4, name: "SUPPLÉMENTS" },
  { id: 5, name: "DESSERTS" },
  { id: 6, name: "BOISSONS" }
];

// Structure des produits par catégorie
const articles = [
  { id: 1, name: "Salade César", price: 5.5, img: "https://images.ricardocuisine.com/services/recipes/8440.jpg", id_category: 1 },
  { id: 2, name: "Soupe de légumes", price: 4.5, img: "https://img.cuisineaz.com/1024x576/2022/07/11/i184647-soupe-legumes.jpeg", id_category: 1 },
  { id: 3, name: "Burger", price: 8.9, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLvBSYpdrmjC6s63P5oWgTiU4gPl36dkdVfQ&s", id_category: 2 },
  { id: 4, name: "Pasta Bolognese", price: 7.5, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu2FEm-L43OU36h8exife2sBQa3GAHADfnYg&s", id_category: 2 },
  { id: 5, name: "Ketchup", price: 1.2, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi9-cAi_ndQro_LH-Gu4Uo4mGZ147UEmnddToB5uRLl3SrOvE-THCaNOsNusxN0om4WsE&usqp=CAU", id_category: 3 },
  { id: 6, name: "Mayonnaise", price: 1.5, img: "https://bakeitwithlove.com/wp-content/uploads/2023/06/homemade-mayonnaise-sq.jpg", id_category: 3 },
  { id: 7, name: "Fromage", price: 2.0, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8MUcZ_-poNfVMUZggOxtQdlvMiOj_9KUkY36-I0uedgGqjTaIlyKTpkm-F2Cr8rgVhp4&usqp=CAU", id_category: 4 },
  { id: 8, name: "Frites", price: 2.5, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDqhVoEhsXTqI-0i9wY0FXutIdebs4mQ2GOM_K0v51RSlFtyKAkZ8g1xtbZ4Fb2_AEuc0&usqp=CAU", id_category: 4 },
  { id: 9, name: "Fondant", price: 4.9, img: "https://empreintesucree.fr/wp-content/uploads/2018/02/1-fondant-chocolat-recette-patisserie-empreinte-sucree-1.jpg.webp", id_category: 5 },
  { id: 10, name: "Cheesecake", price: 4.9, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSykwJstGcspSzNfsFXX7Jdlu51G-uSDQSOYg&s", id_category: 5 },
  { id: 11, name: "Tarte Citron", price: 5.2, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4R9IehC8f6gx_jt38HOa-DQP4YWzuO36lqw&s", id_category: 5 },
  { id: 12, name: "Coca-Cola", price: 2.0, img: "https://images.7sur7.be/ZmRmZjI3ZDMwZDBiYzQ2OTgyMTgvZGlvLzIzNDU0ODEwMC9maWxsLzEyMDAvNjc1/illustration", id_category: 6 },
  { id: 13, name: "Jus d'orange", price: 2.5, img: "https://sf1.topsante.com/wp-content/uploads/topsante/2023/10/pourquoi-faut-arreter-verre-jus-orange-matin.jpeg", id_category: 6 }
];


const Home: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<{ name: string; price: number } | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const showModal = (article: { name: string; price: number }) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setQuantity(1);
  };

  const handleOk = () => {
    if (selectedArticle) {
      addToCart(selectedArticle.name, selectedArticle.price, quantity);
    }
    handleCancel();
  };

  const addToCart = (name: string, price: number, quantity: number): void => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.name === name);
      if (existingItem) {
        return prevCart.map((item) =>
          item.name === name
            ? { ...item, quantity: item.quantity + quantity, price: item.price + price * quantity }
            : item
        );
      }
      return [...prevCart, { key: prevCart.length + 1, name, quantity, price: price * quantity }];
    });
  };

  const totalAmount: string = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  const columns = [
    { title: "QTE", dataIndex: "quantity", key: "quantity" },
    { title: "DÉSIGNATION", dataIndex: "name", key: "name" },
    {
      title: "PRIX",
      dataIndex: "price",
      key: "price",
      render: (text: number) => `${text.toFixed(2)} €`,
    },
  ];

  const filteredArticles = articles.filter((article) => article.id_category === selectedCategory);

  
  return (
    <Row>
      <Col xs={24} sm={12} md={6} lg={6} xl={6}>
        <Sider width="100%" className="bg-white shadow-sm">
          <Title level={4}>🛒 Panier</Title>
          <Divider />
          <Table
            columns={columns}
            dataSource={cart}
            pagination={false}
            size="small"
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>
                  <strong>Total :</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <strong>{totalAmount} €</strong>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
          <div className="d-flex justify-content-between mt-3">
            <Button danger icon={<CloseOutlined />} onClick={() => setCart([])}>
              Annuler
            </Button>
            <Button type="primary" icon={<CheckOutlined />}>
              Valider
            </Button>
          </div>
        </Sider>
      </Col>

      <Col xs={24} sm={12} md={18} lg={18} xl={18}>
        <Layout>
          <Header className="bg-white p-1">
            <Title level={3}>Système de Caisse - POS</Title>
          </Header>

          <Content className="p-2">
            <ClientInfo />
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <Button.Group>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    type={category.id === selectedCategory ? "primary" : "default"}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </Button.Group>
            </Space>

            <Row style={{ marginTop: 20 }}>
              {filteredArticles.map((article) => (
                <Col xs={24} sm={12} md={8} lg={4} xl={4} key={article.id}>
                  <Card
                    hoverable
                    style={{ height: "100%" }}
                    cover={
                      <img
                        alt={article.name}
                        src={article.img}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                    }
                    actions={[
                      <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        onClick={() => showModal(article)}
                      >
                        Ajouter au panier
                      </Button>,
                    ]}
                  >
                    <Card.Meta title={article.name} description={`${article.price.toFixed(2)} €`} />
                  </Card>
                </Col>
              ))}
            </Row>
          </Content>
        </Layout>
      </Col>

      <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <ShoppingCartOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
          <span>Ajouter au panier</span>
        </div>
      }
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel} style={{ borderRadius: "8px" }}>
          ❌ Annuler
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleOk}
          style={{ backgroundColor: "#52c41a", borderColor: "#52c41a", borderRadius: "8px" }}
        >
          ✅ Valider
        </Button>,
      ]}
    >
      <div style={{ textAlign: "center", padding: "10px 0" }}>
        <Typography.Text strong style={{ fontSize: "16px" }}>
          {selectedArticle?.name} - {selectedArticle?.price.toFixed(2)} €
        </Typography.Text>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginTop: "15px" }}>
        <Typography.Text>Quantité :</Typography.Text>
        <Input
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          type="number"
          style={{ width: "80px", textAlign: "center" }}
          min={1}
        />
      </div>
    </Modal>

    </Row>
  );
};

export default Home;
