import { Card, Col, Input, Row, Form } from 'antd';
import { UserOutlined, PhoneOutlined } from "@ant-design/icons";
import { useState } from 'react';

const Emporter = () => {
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
        <Row >
          <Col span={12} >
            <Form.Item label="Nom">
              <Input prefix={<UserOutlined />} placeholder="Nom" />
            </Form.Item>
          </Col>

          <Col span={12} >
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
        </Row>
      </Form>
    </Card>
  );
};

export default Emporter;
