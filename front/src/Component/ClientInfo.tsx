import { useState, useEffect } from "react";
import { Card, Row, Col, Form, Input, Button, Space, Modal } from "antd";
import { UserOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons";

interface Client {
  id: number;
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
    id: number;
    phoneNumber: string;
    name: string;
    firstName: string;
    address: string;
    pointsfidelite: number;
    cardfidelity: string;
  };
  setInfoClient: React.Dispatch<React.SetStateAction<{
    id: number;
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
  const [,setActiveField] = useState<string | null>(null);

  const handleFocus = (fieldName: string) => {
    setActiveField(fieldName);
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
          id: existingClient.id,
          phoneNumber: existingClient.telephone,
          name: existingClient.nom,
          firstName: existingClient.prenom,
          address: existingClient.adresse,
          pointsfidelite: existingClient.pointsfidelite || 0,
          cardfidelity: existingClient.cardfidelity,
        });
        onClientReady(existingClient);
      }
    } catch (error) {
      Modal.error({
        title: "Erreur réseau",
        content: "Impossible de contacter le serveur.",
      });
    }
  };

  useEffect(() => { }, [currentView]);

  return (
    <Card
      style={{
        padding: 20,
        borderRadius: 20,
        marginLeft: 10,
        backgroundColor: "#f9f9f9",
        height: "260px",
      }}
    >
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
                  const onlyDigits = e.target.value.replace(/\D/g, "");
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
    </Card>
  );
};

export default ClientInfo;
