import { useState } from "react";
import { Card, Row, Col, Form, Input, Button, Space } from "antd";
import { UserOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons";
import VirtualKeyboard from "./VirtualKeyboard";

const ClientInfo = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [currentView, setCurrentView] = useState<string>("emporter");
  const [activeField, setActiveField] = useState<string | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);

  const handleInputChange = (value: string) => {
    if (activeField === "phone") setPhoneNumber(value);
    else if (activeField === "name") setName(value);
    else if (activeField === "firstName") setFirstName(value);
    else if (activeField === "address") setAddress(value);
  };

  const handleFocus = (fieldName: string) => {
    setActiveField(fieldName);
    setShowKeyboard(true);
  };

  return (
    <Card
      style={{
        padding: "20px",
        borderRadius: "50px",
        backgroundColor: "#f9f9f9",
        marginLeft: "10px"
      }}
    >
      {/* Boutons de sélection de vue */}
      <Space style={{ marginBottom: 20 }}>
        {["emporter", "livraison", "surplace"].map((view) => (
          <Button
            key={view}
            style={{
              borderRadius: "25px",
              width: "100px",
              height: "40px",
              backgroundColor: currentView === view ? "gray" : "white",
              color: currentView === view ? "white" : "black",
              borderColor: currentView === view ? "gray" : "black",
            }}
            onClick={() => setCurrentView(view)}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </Button>
        ))}
      </Space>

      {/* Formulaire */}
      <Form layout="vertical">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Nom">
              <Input
                prefix={<UserOutlined />}
                placeholder="Nom"
                value={name}
                onFocus={() => handleFocus("name")}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Téléphone">
              <Input
                prefix={<PhoneOutlined />}
                type="tel"
                placeholder="Numéro"
                value={phoneNumber}
                maxLength={10}
                onFocus={() => handleFocus("phone")}
              />
            </Form.Item>
          </Col>

          {currentView === "livraison" && (
            <>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Prénom">
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Prénom"
                    value={firstName}
                    onFocus={() => handleFocus("firstName")}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Adresse">
                  <Input
                    prefix={<HomeOutlined />}
                    placeholder="Adresse"
                    value={address}
                    onFocus={() => handleFocus("address")}
                  />
                </Form.Item>
              </Col>
            </>
          )}
        </Row>

        <Button
          type="primary"
          style={{
            backgroundColor: "#4CAF50", // Vert élégant
            borderColor: "#4CAF50",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
            padding: "10px 24px",
            borderRadius: "25px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            transition: "all 0.3s ease",
          }}
          onMouseOver={e => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#45A049";
          }}
          onMouseOut={e => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#4CAF50";
          }}
          onClick={async () => {
            try {
              const client = {
                nom: name,
                prenom: firstName,
                telephone: phoneNumber,
                adresse: address,
                pointsFidelite: 0,
              };

              const response = await fetch("http://localhost:5000/api/clients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(client),
              });

              if (response.ok) {
                const data = await response.json();
                console.log("Client ajouté :", data);
                setName("");
                setFirstName("");
                setPhoneNumber("");
                setAddress("");
                setShowKeyboard(false);
                alert("Client ajouté avec succès !");
              } else {
                const error = await response.json();
                console.error("Erreur:", error);
                alert("Erreur lors de l'ajout du client.");
              }
            } catch (error) {
              console.error("Erreur réseau :", error);
              alert("Impossible d'envoyer les données.");
            }
          }}
        >
          Ajouter le client
        </Button>

      </Form>

      {/* Clavier Virtuel dans la même Card */}
      {showKeyboard && (
        <div style={{ marginTop: "20px" }}>
          <VirtualKeyboard
            visible={showKeyboard}
            onChange={handleInputChange}
            onClose={() => setShowKeyboard(false)}
          />
        </div>
      )}
    </Card>
  );
};

export default ClientInfo;
