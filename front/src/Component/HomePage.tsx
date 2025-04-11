import React, { useState } from "react";
import { Layout, Button, Table, Card, Row, Col, Typography, Space, Modal, Input, InputNumber, message } from "antd";
import { CheckOutlined, CloseOutlined, PlusOutlined, MinusOutlined, CreditCardOutlined, EuroOutlined } from "@ant-design/icons";
import ClientInfo from "./ClientInfo";

const { Content, Sider } = Layout;

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



  const updateCartQuantity = (key: number, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.key === key ? { ...item, quantity: newQuantity, price: (item.price / item.quantity) * newQuantity } : item
      )
    );
  };

  const totalAmount: string = cart
    .reduce((sum, item) => sum + item.price, 0)
    .toFixed(2);


  const columns = [
    {
      title: "QTE",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number, record: CartItem) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => updateCartQuantity(record.key, value ?? 1)}
        />
      ),
    },
    { title: "DÉSIGNATION", dataIndex: "name", key: "name" },
    {
      title: "PRIX",
      dataIndex: "price",
      key: "price",
      render: (text: number) => `${text.toFixed(2)} €`,
    },
  ];
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);


  const [pendingOrders, setPendingOrders] = useState<{ id: number; items: CartItem[]; total: string }[]>(() => {
    const savedOrders = localStorage.getItem("pendingOrders");
    return savedOrders ? JSON.parse(savedOrders) : [];
  });


  const filteredArticles = articles.filter((article) => article.id_category === selectedCategory);

  return (
    <Row>
      <Col xs={24} sm={12} md={8} lg={8} xl={8}>
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

          {/* Contenu scrollable : uniquement la table des produits */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            <Sider width="100%" className="bg-white shadow-sm">
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
            </Sider>
          </div>

          {/* Partie fixe : Paiement + Boutons */}
          <div style={{ borderTop: "1px solid #ddd", background: "#fff", padding: "10px" }}>
            {/* Moyens de paiement */}
            <Card title="Moyens de Paiement" className="shadow-sm mb-3">
              <div className="d-flex justify-content-between">
                <Button
                  type="default"
                  icon={<EuroOutlined />}
                  onClick={() => setSelectedPayment("cash")}
                  style={{
                    color: selectedPayment === "cash" ? "#fff" : "#0b2799",
                    backgroundColor: selectedPayment === "cash" ? "#0b2799" : "transparent",
                    fontSize: "13px",
                    height: "40px",
                    flex: 1,
                    marginLeft: "-20px",
                  }}
                >
                  Espèces
                </Button>
                <Button
                  type="default"
                  icon={<CreditCardOutlined />}
                  onClick={() => setSelectedPayment("card")}
                  style={{
                    color: selectedPayment === "card" ? "#fff" : "#0b2799",
                    backgroundColor: selectedPayment === "card" ? "#0b2799" : "transparent",
                    fontSize: "13px",
                    height: "40px",
                    flex: 1,
                    marginLeft: "4px",

                  }}
                >
                  Carte Bancaire
                </Button>
              </div>
            </Card>

            {/* Boutons */}
            <div className="d-flex justify-content-between gap-1">
              <Button
                icon={<CloseOutlined />}
                onClick={() => setCart([])}
                style={{ height: "50px", backgroundColor: "#ff4d4d", color: "white", flex: 1 ,fontSize:"10px"}}
              >
                Annuler
              </Button>

              <Button
                icon={<CheckOutlined />}
                disabled={!selectedPayment}
                style={{
                  height: "50px",
                  backgroundColor: selectedPayment ? "#009900" : "#ccc",
                  color: "white",
                  flex: 1,
                  fontSize:"10px",
                  cursor: selectedPayment ? "pointer" : "not-allowed",
                }}
                onClick={() => {
                  const newOrders = [...pendingOrders, { id: Date.now(), items: cart, total: totalAmount }];
                  setPendingOrders(newOrders);
                  localStorage.setItem("pendingOrders", JSON.stringify(newOrders));
                  setCart([]);
                  setSelectedPayment(null);
                  message.success("Commande validée !");
                }}
              >
                Valider
              </Button>

              <Button
                type="primary"
                style={{ height: "50px", backgroundColor: "#798686", color: "white", flex: 1 ,fontSize:"10px"}}
              >
                Mise en attente
              </Button>
            </div>
          </div>
        </div>
      </Col>

      <Col xs={24} sm={12} md={16} lg={16} xl={16} >
        <Layout style={{ backgroundColor: "white" }}>
          <Content className="p-2">
            <ClientInfo />
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <Row gutter={[16, 16]} justify="center">
                {categories.map((category) => (
                  <Col key={category.id} span={8} style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                    <Button
                      type={category.id === selectedCategory ? "default" : "default"} // Pas besoin de changer le type, on modifie juste la bordure
                      onClick={() => setSelectedCategory(category.id)}
                      style={{
                        borderColor: category.id === selectedCategory ? "#669999" : "gray", // Modifier la bordure en bleu
                        color: category.id === selectedCategory ? "black" : "black",  // Laisser la couleur du texte inchangée
                        backgroundColor: "white", // Laisser le fond en blanc
                        width: "100%",
                        height: "40px",
                        fontSize: "14px",
                        fontFamily: "monospace",
                        borderRadius: "6px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {category.name}
                    </Button>
                  </Col>
                ))}
              </Row>

            </Space>


            <Row style={{ marginTop: 20 }}>
              {filteredArticles.map((article) => (
                <Col xs={24} sm={12} md={8} lg={8} xl={8} key={article.id}>
                  <Card
                    hoverable
                    style={{ height: "100%" }}
                    cover={
                      <img
                        alt={article.name}
                        src={article.img}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                    }
                    onClick={() => showModal(article)}
                  >
                    <Card.Meta title={article.name} description={`${article.price.toFixed(2)} €`} />
                  </Card>
                </Col>

              ))}
            </Row>

          </Content>
        </Layout>
      </Col>

      {/* Modale avec boutons "+" et "-" */}
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={
          <div style={{ textAlign: "center" }}> {/* Centre le bouton */}
            <Button
              key="submit"
              type="primary"
              onClick={handleOk}
              style={{ backgroundColor: "#52c41a", borderColor: "#52c41a", borderRadius: "8px" }}
            >
              Valider
            </Button>
          </div>
        }
      >
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <Typography.Text strong style={{ fontSize: "16px" }}>
            {selectedArticle?.name} - {selectedArticle?.price.toFixed(2)} €
          </Typography.Text>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "2px",
            marginTop: "1px",
          }}
        >
          <Typography.Text>Quantité :</Typography.Text>
          <Button icon={<MinusOutlined />} onClick={() => setQuantity(Math.max(1, quantity - 1))} />
          <Input
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            type="number"
            style={{ width: "60px", textAlign: "center" }}
            min={1}
          />
          <Button icon={<PlusOutlined />} onClick={() => setQuantity(quantity + 1)} />
        </div>
      </Modal>

    </Row>
  );
};

export default Home;
