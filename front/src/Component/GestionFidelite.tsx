import { Button, Input, Form, InputNumber, message } from "antd";
import React, { useEffect, useState } from "react";

const GestionFidelite: React.FC = () => {
  const [conversionRate, setConversionRate] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/fidelite-config")
      .then((res) => res.json())
      .then((data) => setConversionRate(data.conversion_rate));
  }, []);
//conversion mis à jour
  const handleFinish = async () => {
    try {
      await fetch("http://localhost:5000/api/fidelite-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversion_rate: conversionRate }),
      });
      message.success("Taux de conversion mis à jour !");
    } catch (err) {
      message.error("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="mb-5 p-5 bg-white shadow rounded">
      <h3 className="text-xl font-medium mb-2">Réglage de la Conversion des Points</h3>
      <Form layout="inline" onFinish={handleFinish}>
        <Form.Item label="Consommation de points">
          <Input.Group compact>
            <Input
              style={{ width: 120, textAlign: "center", backgroundColor: "#f5f5f5" }}
              value="100 points ="
              disabled
            />
            <InputNumber
              value={conversionRate}
              onChange={(value) => value && setConversionRate(value)}
              min={0.001}
              step={0.01}
              style={{ width: 100, textAlign: "center" }}
            />
            <Input
              style={{ width: 40, textAlign: "center", backgroundColor: "#f5f5f5" }}
              value="€"
              disabled
            />
          </Input.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Valide</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GestionFidelite;
