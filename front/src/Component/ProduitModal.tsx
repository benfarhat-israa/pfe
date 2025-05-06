import React from "react";
import { Modal, Button, Typography } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

type ProduitModalProps = {
  open: boolean;
  produit: {
    name: string;
    image?: string;
    prixttc: string | number;
  } | null;
  quantity: number;
  setQuantity: (value: number) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

const ProduitModal: React.FC<ProduitModalProps> = ({
  open,
  onCancel,
  onConfirm,
  produit,
  quantity,
  setQuantity
}) => {
  if (!produit) return null;

  const prix =
    typeof produit.prixttc === "number"
      ? produit.prixttc.toFixed(2)
      : !isNaN(parseFloat(produit.prixttc))
      ? parseFloat(produit.prixttc).toFixed(2)
      : "N/A";

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      closable={false}
      width={350}
      bodyStyle={{
        padding: 20,
        textAlign: "center",
        borderRadius: 12
      }}
    >
      <div>
        <Typography.Title level={4} style={{ marginBottom: 10 }}>
          {produit.name}
        </Typography.Title>

        {produit.image && (
          <img
            src={produit.image}
            alt={produit.name}
            style={{ width: "100%", maxHeight: 150, objectFit: "contain", marginBottom: 20 }}
          />
        )}

        <Typography.Text style={{ display: "block", marginBottom: 20 }}>
          Quantité désirée
        </Typography.Text>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            marginBottom: 20
          }}
        >
          <Button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
            <MinusOutlined />
          </Button>
          <div
            style={{
              fontSize: 18,
              width: 40,
              textAlign: "center",
              border: "1px solid #ccc",
              borderRadius: 4,
              padding: "4px 0"
            }}
          >
            {quantity}
          </div>
          <Button onClick={() => setQuantity(quantity + 1)}>
            <PlusOutlined />
          </Button>
        </div>

        <Button
          type="primary"
          onClick={onConfirm}
          style={{
            backgroundColor: "#faad14",
            borderColor: "#faad14",
            borderRadius: 8,
            width: "80%"
          }}
        >
          Confirmer {prix} €
        </Button>
      </div>
    </Modal>
  );
};

export default ProduitModal;
