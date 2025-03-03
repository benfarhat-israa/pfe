import { Card, Row, Col, Form, Input } from "antd";
import { UserOutlined, PhoneOutlined, HomeOutlined, IdcardOutlined } from "@ant-design/icons";
import { useState } from "react";

const Livraison = () => {
  // ✅ Déclaration de l'état pour le numéro de téléphone
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  // ✅ Fonction pour gérer la saisie du numéro (seulement des chiffres)
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPhoneNumber(value);
    }
  };

  return (
    <Card title="Informations Client" bordered={false} style={{ width: "100%" }}>
      <Form layout="vertical">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Nom">
              <Input prefix={<UserOutlined />} placeholder="Nom" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Numéro">
              <Input
                prefix={<PhoneOutlined />}
                type="text"
                placeholder="Numéro"
                onChange={handlePhoneNumberChange}
                maxLength={10}
                value={phoneNumber}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Prénom">
              <Input prefix={<IdcardOutlined />} placeholder="Prénom" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Adresse">
              <Input prefix={<HomeOutlined />} placeholder="Adresse" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default Livraison;
