import React, { useState } from "react";
import { Layout, Button, Table, Card, Row, Col, Typography, Divider, Space } from "antd";
import { CheckOutlined, CloseOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import Livraison from "./Livraison";
import Emporter from "./Emporter";
import SurPlace from "./SurPlace";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

// ✅ Définition du type pour un élément du panier
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

const POSSystem: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [currentView, setCurrentView] = useState<string>("emporter");

  const addToCart = (name: string, price: number): void => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.name === name);
      if (existingItem) {
        return prevCart.map((item) =>
          item.name === name ? { ...item, quantity: item.quantity + 1, price: item.price + price } : item
        );
      }
      return [...prevCart, { key: prevCart.length + 1, name, quantity: 1, price }];
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

  // Filtrer les articles selon la catégorie sélectionnée
  const filteredArticles = articles.filter((article) => article.id_category === selectedCategory);

  return (
    <Row gutter={[16, 16]}>
      <Col span={4}>
        {/* Sidebar Panier */}
        <Sider width={300} className="bg-white p-3 shadow-sm">
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
      <Col span={18}>
        {/* Contenu Principal */}
        <Layout>
          {/* Barre de navigation avec boutons dynamiques */}
          <Header className="d-flex justify-content-around bg-light p-3 shadow-sm">
            <Button
              onClick={() => setCurrentView("emporter")}
              type={currentView === "emporter" ? "primary" : "default"}
            >
              Emporter
            </Button>
            <Button
              onClick={() => setCurrentView("livraison")}
              type={currentView === "livraison" ? "primary" : "default"}
            >
              Livraison
            </Button>
            <Button
              onClick={() => setCurrentView("surplace")}
              type={currentView === "surplace" ? "primary" : "default"}
            >
              Sur Place
            </Button>
          </Header>

          {/* Affichage de la vue sélectionnée */}
          <Content className="p-4">
            {currentView === "emporter" && <Emporter />}
            {currentView === "livraison" && <Livraison />}
            {currentView === "surplace" && <SurPlace />}
            {/* Sélectionner une catégorie */}
            <Card className="shadow-sm p-3">
      <Title level={4} className="text-center">Choisissez une catégorie</Title>
      <Row justify="center">
        <Col>
          <Space size="middle">
            {categories.map((category) => (
              <Button
                key={category.id}
                type={selectedCategory === category.id ? "primary" : "default"}
                onClick={() => setSelectedCategory(category.id)}
                size="large"
              >
                {category.name}
              </Button>
            ))}
          </Space>
        </Col>
      </Row>
    </Card>


            {/* Affichage des articles en fonction de la catégorie sélectionnée */}
            <div>
              <Row gutter={[16, 16]}>
                {filteredArticles.map((article) => (
                  <Col xs={12} sm={8} md={6} lg={6} xl={6} key={article.id}>
                    <Card
                      hoverable
                      cover={<img alt={article.name} src={article.img} style={{ width: "100%", height: "200px", objectFit: "cover" }} />}
                      actions={[
                        <Button type="primary" onClick={() => addToCart(article.name, article.price)}>
                          <ShoppingCartOutlined />
                        </Button>,
                      ]}
                    >
                      <Card.Meta title={article.name} description={`${article.price} €`} />
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Content>
        </Layout>
      </Col>
    </Row>
  );
};

export default POSSystem;
