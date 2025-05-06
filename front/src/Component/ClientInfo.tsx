import { useState, useEffect } from "react";
import { Card, Row, Col, Form, Input, Button, Space, Modal } from "antd";
import { UserOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons";
import VirtualKeyboard from "./VirtualKeyboard";

interface Client {
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
  pointsfidelite: number;
  cardfidelity: string;
}

interface ClientInfoProps {
  onClientReady: (client: Client) => void;
  infoClient: {
    phoneNumber: string;
    name: string;
    firstName: string;
    address: string;
    pointsfidelite: number;
    cardfidelity: string;
  };
  setInfoClient: React.Dispatch<React.SetStateAction<{
    phoneNumber: string;
    name: string;
    firstName: string;
    address: string;
    pointsfidelite: number;
    cardfidelity: string;
  }>>;
}

const ClientInfo: React.FC<ClientInfoProps> = ({ onClientReady, infoClient, setInfoClient }) => {
  const [currentView, setCurrentView] = useState("emporter");
  const [activeField, setActiveField] = useState<string | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);

  // Génère un numéro de carte fidélité à 13 chiffres
  const generateFidelityCardNumber = () => {
    return `${Math.floor(1000000000000 + Math.random() * 9000000000000)}`;
  };

  const handleFocus = (fieldName: string) => {
    setActiveField(fieldName);
    setShowKeyboard(true);
  };

  const handleChange = (key: string, value: any) => {
    setInfoClient({ ...infoClient, [key]: value });
  };

  const getInfoClient = async (phone_number: any) => {
    try {
      const response = await fetch(`http://localhost:5000/api/clients/${phone_number}`);
      if (response.ok) {
        const existingClient: Client = await response.json();
        setInfoClient({
          phoneNumber: existingClient.telephone,
          name: existingClient.nom,
          firstName: existingClient.prenom,
          address: existingClient.adresse,
          pointsfidelite: existingClient.pointsfidelite || 0,
          cardfidelity: existingClient.cardfidelity,
        });
        setShowKeyboard(false);

        // onClientReady(existingClient);
      } else if (response.status === 404) {
        // Nouveau client → on attend que les champs nécessaires soient remplis
        if (!infoClient.name || (currentView === "livraison" && (!infoClient.firstName || !infoClient.address))) {
          return;
        }

        const newClient: Client = {
          nom: infoClient.name,
          prenom: infoClient.firstName,
          telephone: infoClient.phoneNumber,
          adresse: infoClient.address,
          pointsfidelite: 0,
          cardfidelity: generateFidelityCardNumber(),
        };

        const addResponse = await fetch("http://localhost:5000/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newClient),
        });

        if (addResponse.ok) {
          const data = await addResponse.json();
          Modal.success({
            title: "Client ajouté",
            content: `Numéro de carte fidélité : ${data.cardfidelity}`,
          });
          setInfoClient({
            phoneNumber: data.telephone,
            name: data.nom,
            firstName: data.prenom,
            address: data.adresse,
            pointsfidelite: 0,
            cardfidelity: data.cardfidelity,
          });
          setShowKeyboard(false);
          onClientReady(data);
        } else {
          Modal.error({
            title: "Erreur",
            content: "Impossible d’ajouter le client.",
          });
        }
      }
    } catch (error) {
      Modal.error({
        title: "Erreur réseau",
        content: "Impossible de contacter le serveur.",
      });
    }
  }

  useEffect(() => {
  }, [currentView]);

  return (
    <Card style={{ padding: 20, borderRadius: 20, marginLeft: 10, backgroundColor: "#f9f9f9", height: "260px" }}>
      <Space style={{ marginBottom: 10, marginTop: "-40px" }}>
        {["emporter", "livraison", "surplace"].map((view) => (
          <Button
            key={view}
            onClick={() => setCurrentView(view)}
            style={{
              borderRadius: 25,
              width: 120,
              height: 50,
              backgroundColor: currentView === view ? "gray" : "white",
              color: currentView === view ? "white" : "black",
            }}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </Button>
        ))}
      </Space>

      <Form layout="vertical">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Nom">
              <Input
                prefix={<UserOutlined />}
                placeholder="Nom"
                value={infoClient.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onFocus={() => handleFocus("name")}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Téléphone">
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Numéro"
                maxLength={8}
                value={infoClient.phoneNumber}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, ""); // Retire tout caractère non numérique
                  handleChange("phoneNumber", onlyDigits);
                  if (onlyDigits.length === 8) {
                    getInfoClient(onlyDigits);
                  }
                }}
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
                    value={infoClient.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    onFocus={() => handleFocus("firstName")}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Adresse">
                  <Input
                    prefix={<HomeOutlined />}
                    placeholder="Adresse"
                    value={infoClient.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    onFocus={() => handleFocus("address")}
                  />
                </Form.Item>
              </Col>
            </>
          )}

          <Input
            disabled
            value={infoClient.cardfidelity}
            prefix={<HomeOutlined />}
            placeholder="Numéro de carte fidélité"
          />
        </Row>
      </Form>

      {/* {showKeyboard && (
        <VirtualKeyboard
          visible={showKeyboard}
          onChange={handleInputChange}
          onClose={() => setShowKeyboard(false)}
        />
      )} */}
    </Card>
  );
};

export default ClientInfo;
