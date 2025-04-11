import { useState } from "react";
import { Card, Row, Col, Form, Input, Button, Space } from "antd";
import { UserOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons";
import VirtualKeyboard from "./VirtualKeyboard";

const ClientInfo = () => {
  // États pour les champs et la gestion de la vue
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>(""); // Nouvel état pour Prénom
  const [address, setAddress] = useState<string>(""); // Nouvel état pour Adresse
  const [currentView, setCurrentView] = useState<string>("emporter");

  // États pour le champ actif et le clavier
  const [activeField, setActiveField] = useState<string | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);

  // Mise à jour de la valeur basée sur le champ actif
  const handleInputChange = (value: string) => {
    if (activeField === "phone") {
      setPhoneNumber(value);
    } else if (activeField === "name") {
      setName(value);
    } else if (activeField === "firstName") {
      setFirstName(value);
    } else if (activeField === "address") {
      setAddress(value);
    }
  };

  // Gestion du focus sur un champ
  const handleFocus = (fieldName: string) => {
    setActiveField(fieldName);
    setShowKeyboard(true); // Affiche le clavier
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "20px", border: "2px solid #f0f0f5", borderRadius: "20px", backgroundColor: "#f9f9f9" }}>
      <Card >
        {/* Boutons pour changer la vue */}
        <Space style={{ marginBottom: 10 }}>
          <Button
            style={{
              borderRadius: "25px",
              width: "100px",
              height: "40px",
              backgroundColor: currentView === "emporter" ? "gray" : "white",
              color: currentView === "emporter" ? "white" : "black",
              borderColor: currentView === "emporter" ? "gray" : "black",
            }}
            onClick={() => setCurrentView("emporter")}
          >
            Emporter
          </Button>

          <Button
            style={{
              borderRadius: "25px",
              width: "100px",
              height: "40px",
              backgroundColor: currentView === "livraison" ? "gray" : "white",
              color: currentView === "livraison" ? "white" : "black",
              borderColor: currentView === "livraison" ? "gray" : "black",
            }}
            onClick={() => setCurrentView("livraison")}
          >
            Livraison
          </Button>

          <Button
            style={{
              borderRadius: "25px",
              width: "100px",
              height: "40px",
              backgroundColor: currentView === "surplace" ? "gray" : "white",
              color: currentView === "surplace" ? "white" : "black",
              borderColor: currentView === "surplace" ? "gray" : "black",
            }}
            onClick={() => setCurrentView("surplace")}
          >
            Sur Place
          </Button>
        </Space>

        {/* Formulaire d'entrée */}
        <Form layout="vertical">
          <Row gutter={[16, 16]}>
            {/* Champ Nom */}
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

            {/* Champ Téléphone */}
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="téléphone">
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

            {/* Si "Livraison" est sélectionné, afficher les champs supplémentaires */}
            {currentView === "livraison" && (
              <>
                {/* Champ Prénom */}
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

                {/* Champ Adresse */}
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
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(client),
                });

                if (response.ok) {
                  const data = await response.json();
                  console.log("Client ajouté :", data);
                  // Réinitialiser les champs si besoin :
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

        {/* Affichage du clavier virtuel */}
        {showKeyboard && (
          <VirtualKeyboard
            visible={showKeyboard}
            onChange={handleInputChange}
            onClose={() => setShowKeyboard(false)}
          />
        )}
      </Card>

    </div>

  );
};

export default ClientInfo;
