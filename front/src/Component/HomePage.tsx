import React, { useState, useEffect } from "react";
import { Layout, Button, Table, Card, Row, Col, Typography, Space, Modal, Input, InputNumber, message } from "antd";
import { CheckOutlined, CloseOutlined, PlusOutlined, MinusOutlined, CreditCardOutlined, EuroOutlined, ClockCircleOutlined } from "@ant-design/icons";
import ClientInfo from "./ClientInfo";
import Paiment from "./paiment";
import Onlinie from "./Onlinie";

const { Content, Sider } = Layout;

export interface CartItem {
  key: number;
  name: string;
  quantity: number;
  price: number;
  pointsfid: number;
}

interface Categorie {
  id: number;
  designation: string;
}

interface Produit {
  id: number;
  designation: string;
  prixttc: number | string | null;
  tva: number;
  couleur: string;
  image: string;
  pointsfid: number;
  category: number | Categorie;
}
type homeType = {
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  cart: CartItem[]
}
function Home({ setCart, cart }: homeType) {
  // const [cart, setCart] = useState<CartItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selecteProduit, setSelecteProduit] = useState<{ name: string; prixttc: number | string | null } | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredProduits, setFilteredProduits] = useState<Produit[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [infoClient, setInfoClient] = useState({
    id: 0,
    phoneNumber: "",
    name: "",
    firstName: "",
    address: "",
    pointsfidelite: 0,
    cardfidelity: "",
  });

  console.log("cart", cart)
  const showModal = (produit: { name: string; prixttc: number | string | null }) => {
    setSelecteProduit(produit);
    setIsModalOpen(true);
    setQuantity(1);
  };
  const handleClosePaymentModal = () => {
    setIsPaymentOpen(false);     // Ferme la modale
    setCart([]);                 // Vide le panier
    setSelectedPayment(null);    // Réinitialise le paiement sélectionné
    setInfoClient({
      id: 0,
      phoneNumber: "",
      name: "",
      firstName: "",
      address: "",
      pointsfidelite: 0,
      cardfidelity: "",
    });                          // Réinitialise les infos client
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setQuantity(1);
  };
  const handleOk = () => {
    if (selecteProduit) {
      let price = 0;
      if (typeof selecteProduit.prixttc === 'number') {
        price = selecteProduit.prixttc;
      } else if (typeof selecteProduit.prixttc === 'string') {
        const prix = parseFloat(selecteProduit.prixttc);
        if (!isNaN(prix)) {
          price = prix;
        } else {
          message.error("Le prix du produit sélectionné est invalide.");
          return;
        }
      }
      addToCart(selecteProduit.name, price, quantity);
    }
    handleCancel();
  };
  const addToCart = (name: string, price: number, quantity: number): void => {
    const produit = produits.find(p => p.designation === name);
    const pointsfid = produit?.pointsfid || 0;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.name === name);
      if (existingItem) {
        return prevCart.map((item) =>
          item.name === name
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prevCart,
        { key: prevCart.length + 1, name, quantity, price, pointsfid },
      ];
    });
  };

  const updateCartQuantity = (key: number, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.key === key ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  const totalAmount: string = cart
    .reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
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
      key: "prixTotal",
      render: (text: any, record: CartItem) => {
        const totalPrice = record.price * record.quantity;
        return `${totalPrice.toFixed(2)} €`;
      },
    },


  ];
  const handleCategorySelect = (designation: string) => {
    setSelectedCategory(designation);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/produits")
      .then((res) => res.json())
      .then((data) => {
        const normalized = data.map((p: any) => ({
          ...p,
          category: typeof p.category === 'object' ? p.category.id : p.category,
          prixttc: typeof p.prixttc === 'string' ? parseFloat(p.prixttc) : p.prixttc,
        }));
        setProduits(normalized as Produit[]);
        setFilteredProduits(normalized as Produit[]);
      })
      .catch((err) => console.error("Erreur de chargement des produits :", err));
  }, []);

  const handleMiseEnAttente = () => {
    if (cart.length === 0) {
      message.warning("Le panier est vide.");
      return;
    }

    const totalPointsFid = cart.reduce((sum, item) => sum + item.pointsfid * item.quantity, 0);

    const pendingItems = cart.map(item => ({
      key: item.key,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      pointsfid: item.pointsfid, // Optionnel : si tu veux aussi voir les points par produit
    }));

    const newCommande = {
      commandeNum: Date.now().toString(),
      nombreArticles: cart.length,
      totalCommande: parseFloat(totalAmount),
      resteAPayer: parseFloat(totalAmount),
      totalPointsFid: totalPointsFid, // Ajouté ici
      items: pendingItems,
    };

    const existing = JSON.parse(localStorage.getItem("pendingOrders") || "[]");
    const updated = [...existing, newCommande];
    localStorage.setItem("pendingOrders", JSON.stringify(updated));

    setCart([]);
    setSelectedPayment(null);
    message.success("Commande mise en attente !");
  };


  useEffect(() => {
    if (selectedCategory === null) {
      setFilteredProduits(produits);
    } else {
      const filtered = produits.filter((produit: any) =>
        produit.category === selectedCategory
      );
      setFilteredProduits(filtered);
    }
  }, [selectedCategory, produits]);

  const totalPanier = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const isClientInfoValid = () => {
    const phone = infoClient.phoneNumber.trim();
    return phone.length === 8 && /^\d{8}$/.test(phone);
  };


  return (
    <Row style={{ height: "100vh", overflow: "hidden" }}> {/* Fixe la hauteur de tout l'écran */}
      <Col xs={10} sm={10} md={10} lg={8} xl={8}>
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "#0b2799 #f1f1f1" }}>
            <Sider width="100%" className="bg-white shadow-sm">
              <Table columns={columns} dataSource={cart} pagination={false} size="small"
                summary={() => (
                  <>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={2}>
                        <strong>Total :</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2}>
                        <strong>{totalAmount} €</strong>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={2}>
                        <strong>Total Points Fid :</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2}>
                        <strong>
                          {cart.reduce((sum, item) => sum + item.pointsfid * item.quantity, 0)} pts
                        </strong>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )}
              />
            </Sider>
          </div>
          <div style={{ borderTop: "1px solid #ddd", background: "#fff", padding: "10px" }}>
            <Card title="Moyens de Paiement" className="shadow-sm mb-3" variant="outlined">
              <div className="d-flex justify-content-between">
                <Button
                  type="default"
                  icon={<EuroOutlined />}
                  onClick={() => setSelectedPayment("cash")}
                  style={{
                    color: selectedPayment === "cash" ? "#fff" : "#0b2799", backgroundColor: selectedPayment === "cash" ? "#0b2799" : "transparent", fontSize: "13px", height: "40px", flex: 1, marginLeft: "-20px",
                  }}
                >
                  Espèces
                </Button>
                <Button
                  type="default"
                  icon={<CreditCardOutlined />}
                  onClick={() => setSelectedPayment("card")}
                  style={{
                    color: selectedPayment === "card" ? "#fff" : "#0b2799", backgroundColor: selectedPayment === "card" ? "#0b2799" : "transparent", fontSize: "13px", height: "40px", flex: 1, marginLeft: "4px",
                  }}
                >
                  Carte Bancaire
                </Button>
              </div>
            </Card>
            <div className="d-flex justify-content-between gap-1">
              <Button
                icon={<CloseOutlined />}
                onClick={() => setCart([])}
                style={{ height: "50px", backgroundColor: "#ff4d4d", color: "white", flex: 1, fontSize: "10px" }}
              >
                Annuler
              </Button>
              <Button
                icon={<CheckOutlined />}
                disabled={!selectedPayment || !isClientInfoValid()}
                style={{
                  height: "50px",
                  backgroundColor: selectedPayment && isClientInfoValid() ? "#009900" : "#ccc",
                  color: "white",
                  flex: 1,
                  fontSize: "10px",
                  cursor: selectedPayment && isClientInfoValid() ? "pointer" : "not-allowed",
                }}
                onClick={() => setIsPaymentOpen(true)}
              >
                Valider
              </Button>


              <Button
                icon={<ClockCircleOutlined />}
                type="primary"
                style={{ height: "50px", backgroundColor: "#798686", color: "white", flex: 1, fontSize: "10px" }}
                onClick={handleMiseEnAttente}
              >
                Mise en attente
              </Button>
            </div>
          </div>
        </div>
      </Col>
      <Col xs={14} sm={14} md={14} lg={16} xl={16} >
        <Layout style={{ backgroundColor: "white" }}>
          <Content className="p-2">
            <ClientInfo onClientReady={(client) => {
              console.log("Client prêt :", client);
            }}

              infoClient={infoClient} setInfoClient={setInfoClient}
            />
            <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
              {/* Section catégories - hauteur auto */}
              <div style={{ flex: "0 0 auto", padding: "10px" }}>
                <Space direction="vertical" style={{ width: "100%" }} size="middle">
                  <Row gutter={[4, 4]} justify="center">
                    {categories.map((category) => (
                      <Col
                        key={category.id}
                        span={8}
                        style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
                      >
                        <Button
                          type="default"
                          onClick={() => handleCategorySelect(category.designation)}
                          style={{
                            borderColor: category.designation === selectedCategory ? "#669999" : "gray",
                            color: "black",
                            backgroundColor: "white",
                            width: "90%",
                            height: "50px",
                            fontSize: "16px",
                            fontFamily: "monospace",
                            borderRadius: "6px",
                            boxShadow: "10px 14px 16px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          {category.designation}
                        </Button>
                      </Col>
                    ))}
                  </Row>
                </Space>
              </div>

              {/* Section produits - prend automatiquement tout l'espace restant avec scroll */}
              <div style={{ flex: "1", overflowY: "auto", padding: "10px" }}>
                <Row gutter={[16, 16]}>
                  {filteredProduits.length > 0 ? (
                    filteredProduits.map((produit) => (
                      <Col xs={12} sm={12} md={8} lg={8} xl={8} key={produit.id}>
                        <Card
                          hoverable
                          style={{
                            height: "100%",
                            marginLeft: "10px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          }}
                          cover={
                            <img
                              alt={produit.designation}
                              src={`http://localhost:5000/uploads/${produit.image}`}
                              style={{
                                width: "100%",
                                height: "135px",
                                objectFit: "cover",
                                borderTopLeftRadius: "8px",
                                borderTopRightRadius: "8px",
                              }}
                            />
                          }
                          onClick={() => showModal({ name: produit.designation, prixttc: produit.prixttc })}
                        >
                          <Card.Meta
                            title={produit.designation}
                            description={
                              typeof produit.prixttc === "number"
                                ? `${produit.prixttc.toFixed(2)} €`
                                : typeof produit.prixttc === "string" &&
                                  !isNaN(parseFloat(produit.prixttc))
                                  ? `${parseFloat(produit.prixttc).toFixed(2)} €`
                                  : "Prix non disponible"
                            }
                          />
                        </Card>
                      </Col>
                    ))
                  ) : (
                    <Col span={24} style={{ textAlign: "center", padding: "20px" }}>
                      <Typography.Text type="secondary">
                        Aucun produit disponible pour cette catégorie
                      </Typography.Text>
                    </Col>
                  )}
                </Row>
              </div>
            </div>

          </Content>
        </Layout>
      </Col>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={null} centered >
        <div style={{ textAlign: "center" }}>
          <Typography.Text strong style={{ fontSize: "18px" }}>
            {selecteProduit?.name}
          </Typography.Text>
          <div style={{ margin: "10px 0" }}>
            <Typography.Text style={{ fontWeight: 500 }}>
              {`${typeof selecteProduit?.prixttc === 'number' ? selecteProduit?.prixttc.toFixed(2) : 'Prix non disponible'} €`}
            </Typography.Text>
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginTop: "20px" }}>
            <Button icon={<MinusOutlined />} onClick={() => setQuantity(Math.max(1, quantity - 1))} />
            <Input type="number" value={quantity} min={1} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} style={{ width: "60px", textAlign: "center" }}
            />
            <Button icon={<PlusOutlined />} onClick={() => setQuantity(quantity + 1)} />
          </div>
          <Button type="primary" onClick={handleOk} style={{ marginTop: "20px", width: "100%" }}
          >
            Confirmer {typeof selecteProduit?.prixttc === 'number' ? `à ${selecteProduit?.prixttc.toFixed(2)} €` : ''}
          </Button>
        </div>
      </Modal>


      <Paiment
        open={isPaymentOpen && selectedPayment === "cash"}
        onClose={handleClosePaymentModal} // Remplace ici le onClose existant
        total={totalPanier}
        infoClient={infoClient}
        panier={cart.map(item => ({
          ...item,
          key: String(item.key),  // Convertir la clé en string
          prixttc: item.price ?? item.price * item.quantity,
        }))}
      />


      <Onlinie onClose={handleClosePaymentModal} visible={isPaymentOpen && selectedPayment === 'card'} />


    </Row>
  );
};

export default Home;