import React, { useState, useEffect } from "react";
import { Layout, Button, Table, Card, Row, Col, Typography, Space, Modal, Input, InputNumber, message } from "antd";
import { CheckOutlined, CloseOutlined, PlusOutlined, MinusOutlined, CreditCardOutlined, EuroOutlined } from "@ant-design/icons";
import ClientInfo from "./ClientInfo";

const { Content, Sider } = Layout;

interface CartItem {
  key: number;
  name: string;
  quantity: number;
  prixTTC: number;
}
interface Categorie {
  id: number;
  designation: string;
}

interface Produit {
  id: number;
  designation: string;
  prixTTC: number;
  tva: number;
  couleur: string;
  image: string;
  pointsFid: number;
  category: number | Categorie;
}
const Home: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selecteProduit, setSelecteProduit] = useState<{ name: string; prixTTC: number } | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredProduits, setFilteredProduits] = useState<Produit[]>([]);

  const showModal = (produit: { name: string; prixTTC: number }) => {
    setSelecteProduit(produit); // Sélectionner le produit
    setIsModalOpen(true);
    setQuantity(1); // Réinitialiser la quantité
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setQuantity(1);
  };
  const handleOk = () => {
    if (selecteProduit) {
      // Ajouter le produit au panier
      addToCart(selecteProduit.name, selecteProduit.prixTTC, quantity);
    }
    handleCancel(); // Fermer la modale après validation
  };

  const addToCart = (name: string, prixTTC: number, quantity: number): void => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.name === name);
      if (existingItem) {
        // Si le produit est déjà dans le panier, mettre à jour la quantité
        return prevCart.map((item) =>
          item.name === name
            ? { ...item, quantity: item.quantity + quantity, prixTTC: (item.prixTTC / item.quantity) * (item.quantity + quantity) }
            : item
        );
      }
      // Sinon, ajouter le nouveau produit
      return [
        ...prevCart,
        { key: prevCart.length + 1, name, quantity, prixTTC: prixTTC * quantity },
      ];
    });
  };
  const updateCartQuantity = (key: number, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.key === key ? { ...item, quantity: newQuantity, prixTTC: (item.prixTTC / item.quantity) * newQuantity } : item
      )
    );
  };

  const totalAmount: string = cart
    .reduce((sum, item) => sum + (item.prixTTC || 0), 0) // Vérifie que 'item.prixTTC' est défini
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
      dataIndex: "prixTTC",
      key: "prixTTC",
      render: (text: number) => `${text.toFixed(2)} €`,
    },
  ];
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const [pendingOrders, setPendingOrders] = useState<{ id: number; items: CartItem[]; total: string }[]>(() => {
    const savedOrders = localStorage.getItem("pendingOrders");
    return savedOrders ? JSON.parse(savedOrders) : [];
  });
  // pour le filtrage des produits par catégorie
  const handleCategorySelect = (designation: string) => {
    setSelectedCategory(designation);
  };
  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        const data = await response.json();
        console.log("Catégories récupérées :", data); // Vérification
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
        console.log("Données reçues des produits :", data); // 👈 Ajout ici pour voir les produits
  
        const normalized = data.map((p: Produit) => ({
          ...p,
          category: typeof p.category === 'object' ? p.category.id : p.category,
        }));
  
        console.log("Produits normalisés :", normalized); // Vérifier si la catégorie est bien un id et non un objet
  
        setProduits(normalized);
        setFilteredProduits(normalized);
      })
      .catch((err) => console.error("Erreur de chargement des produits :", err));
  }, []);
  
  useEffect(() => {
    if (selectedCategory === null) {
      setFilteredProduits(produits); // Afficher tous les produits si aucune catégorie n'est sélectionnée
    } else {
      const filtered = produits.filter((produit) => {
        console.log("Comparaison produit.category et selectedCategory :", produit.category, selectedCategory); // Log des valeurs comparées
        return Number(produit.category) === Number(selectedCategory); // Forcer la comparaison de type
      });
      setFilteredProduits(filtered); // Mettre à jour les produits filtrés
    }
  }, [selectedCategory, produits]);
  
  
  console.log("Catégorie sélectionnée :", selectedCategory);
  console.log("Produits filtrés :", filteredProduits);



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
                style={{ height: "50px", backgroundColor: "#ff4d4d", color: "white", flex: 1, fontSize: "10px" }}
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
                  fontSize: "10px",
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
                style={{ height: "50px", backgroundColor: "#798686", color: "white", flex: 1, fontSize: "10px" }}
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
                  <Col
                    key={category.id}
                    span={8}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "10px",
                    }}
                  >
                    <Button
                      type="default"
                      onClick={() => handleCategorySelect(category.designation)}
                      style={{
                        borderColor: category.designation === selectedCategory ? "#669999" : "gray",
                        color: "black",
                        backgroundColor: "white",
                        width: "100%",
                        height: "40px",
                        fontSize: "14px",
                        fontFamily: "monospace",
                        borderRadius: "6px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {category.designation}
                    </Button>

                  </Col>
                ))}
              </Row>
            </Space>
            <Row style={{ marginTop: 20 }}>
              {filteredProduits.length > 0 ? (
                filteredProduits.map((produit) => (
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} key={produit.id}>
                    <Card
                      hoverable
                      style={{ height: "100%" }}
                      cover={
                        <img
                          alt={produit.designation}
                          src={`http://localhost:5000/uploads/${produit.image}`}
                          style={{ width: "100%", height: "150px", objectFit: "cover" }}
                        />
                      }
                      onClick={() => showModal({
                        name: produit.designation,
                        prixTTC: produit.prixTTC
                      })}
                    >
                      <Card.Meta
                        title={produit.designation}
                        description={produit.prixTTC ? `${produit.prixTTC.toFixed(2)} €` : "Prix non disponible"}
                      />
                    </Card>
                  </Col>
                ))
              ) : (
                <Col span={24} style={{ textAlign: "center", padding: "20px" }}>
                  <Typography.Text type="secondary">Aucun produit disponible pour cette catégorie</Typography.Text>
                </Col>
              )}
            </Row>

          </Content>
        </Layout>
      </Col>

      {/* Modale avec boutons "+" et "-" */}
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={
          <div style={{ textAlign: "center" }}>
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
            {selecteProduit?.name} - {selecteProduit?.prixTTC && !isNaN(selecteProduit?.prixTTC)
              ? selecteProduit?.prixTTC.toFixed(2) + " €"
              : "Prix non disponible"}
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
