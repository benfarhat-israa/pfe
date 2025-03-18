import { useState } from "react";
import { Card, Row, Col, Form, Input, Button, Space } from "antd";
import { UserOutlined, PhoneOutlined, HomeOutlined, IdcardOutlined } from "@ant-design/icons";
import VirtualKeyboard from "./VirtualKeyboard";

const ClientInfo = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [currentView, setCurrentView] = useState<string>("emporter");

  const [activeField, setActiveField] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  const [showKeyboard, setShowKeyboard] = useState(false);

  // Fonction pour gérer la saisie des caractères, avec ajout de caractères sans répétition
  const handleInputChange = (value: string) => {
    if (activeField === "phone") {
      setPhoneNumber(value);
    } else {
      setInputValue(value);  // Met à jour le champ texte actif avec un seul caractère
    }
  };

  // Fonction pour gérer le focus sur un champ
  const handleFocus = (fieldName: string) => {
    setActiveField(fieldName);
    setShowKeyboard(true);  // Affiche le clavier virtuel lorsque le champ est actif
  };

  // Fonction pour masquer le clavier quand le focus est perdu
  const handleBlur = () => {
    setActiveField(null);
    setShowKeyboard(false);  // Masque le clavier virtuel lorsque le champ perd le focus
  };

  // Fonction pour gérer la saisie du numéro de téléphone (uniquement des chiffres)
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPhoneNumber(value);
    }
  };

  return (
    <Card title="Informations Client" bordered={false} style={{ width: "100%" }}>
      {/* Barre de navigation avec boutons dynamiques */}
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => setCurrentView("emporter")} type={currentView === "emporter" ? "primary" : "default"}>
          Emporter
        </Button>
        <Button onClick={() => setCurrentView("livraison")} type={currentView === "livraison" ? "primary" : "default"}>
          Livraison
        </Button>
        <Button onClick={() => setCurrentView("surplace")} type={currentView === "surplace" ? "primary" : "default"}>
          Sur Place
        </Button>
      </Space>

      {/* Formulaire dynamique basé sur la vue actuelle */}
      <Form layout="vertical">
        <Row>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Nom">
              <Input
                prefix={<UserOutlined />}
                placeholder="Nom"
                value={inputValue}
                onFocus={() => handleFocus("name")}
                onBlur={handleBlur}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Numéro">
              <Input
                prefix={<PhoneOutlined />}
                type="text"
                placeholder="Numéro"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                maxLength={10}
                onFocus={() => handleFocus("phone")}
                onBlur={handleBlur}
              />
            </Form.Item>
          </Col>

          {currentView !== "emporter" && (
            <>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Prénom">
                  <Input
                    prefix={<IdcardOutlined />}
                    placeholder="Prénom"
                    onFocus={() => handleFocus("firstname")}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              </Col>

              {currentView === "livraison" && (
                <Col xs={24} sm={12} md={6}>
                  <Form.Item label="Adresse">
                    <Input
                      prefix={<HomeOutlined />}
                      placeholder="Adresse"
                      onFocus={() => handleFocus("address")}
                      onBlur={handleBlur}
                    />
                  </Form.Item>
                </Col>
              )}
            </>
          )}
        </Row>
      </Form>

      {/* Affichage du clavier virtuel pour le champ actif */}
      {showKeyboard && activeField && (
        <VirtualKeyboard
          onChange={handleInputChange}  // La fonction qui reçoit les caractères
        />
      )}
    </Card>
  );
};

export default ClientInfo;
