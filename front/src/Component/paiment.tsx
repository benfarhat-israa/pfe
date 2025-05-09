import React, { useState, useEffect } from 'react';
import { Modal, Button, Typography, Space, Input, Spin, Flex } from 'antd';
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import Split from 'react-split';
import { notification } from 'antd';
const { Title, Paragraph } = Typography;


interface Item {
  key: string;
  name: string;
  quantity: number;
  prixttc: number;
}

interface PaiementModalProps {
  open: boolean;
  onClose: () => void;
  total: number;
  onSuccess?: () => void;
  panier: Item[];
  infoClient: {
    id: number;
    phoneNumber: string;
    name: string;
    firstName: string;
    address: string;
    pointsfidelite: number;
    cardfidelity: string;
  };
  valeurPointsFidelite: number;
  pointsgagneé: number;
  conversionRate: number | null;
  selectedPayment: string | null;
}

const PaiementModal: React.FC<PaiementModalProps> = ({
  open,
  onClose,
  total,
  onSuccess,
  panier,
  infoClient,
  valeurPointsFidelite,
  pointsgagneé,
  conversionRate,
  selectedPayment,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [paidAmount, setPaidAmount] = useState(0);
  const [totalOrder, setTotalOrder] = useState<number | null>(null);
  const [remainingAmount, setRemainingAmount] = useState<number | null>(null);
  const [changeToReturn, setChangeToReturn] = useState<number | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [pointsUtilises, setPointsUtilises] = useState(0);
  const [showCardModal, setShowCardModal] = useState(false);
  const initialTotal = total;

  const viderPanier = () => {
    panier.length = 0;
  };
  const handleButtonClick = (value: string) =>
    setInputValue((prev) => prev + value);
  const handleDeleteCharacter = () =>
    setInputValue((prev) => prev.slice(0, -1));
  const handleClearAll = () => {
    setInputValue('');
    setPaidAmount(0);
    setTotalOrder(null);
    setRemainingAmount(null);
    setChangeToReturn(null);
    setPromoCode('');
    setAppliedDiscount(0);
    setPointsUtilises(0);
  };


  const handleApplyPromo = async () => {
    const code = promoCode.trim().toUpperCase();
    try {
      const response = await fetch('http://localhost:5000/api/apply-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      if (!response.ok) {
        const errorData = await response.json();
        Modal.warning({ content: errorData.message });
        return;
      }
      const promo = await response.json();
      const discount = (promo.discount_percent / 100) * initialTotal;
      setAppliedDiscount(discount);
      const subtotalAfterPromo = initialTotal - discount;
      setTotalOrder(subtotalAfterPromo);
      setRemainingAmount(subtotalAfterPromo - paidAmount);
      setChangeToReturn(paidAmount - subtotalAfterPromo > 0 ? paidAmount - subtotalAfterPromo : 0);
      Modal.success({
        content: `Remise de ${discount.toFixed(2)} € appliquée !`
      });
    } catch (error) {
      Modal.error({
        content: "Erreur serveur ou réseau lors de l'application du code."
      });
    }
  };

  const utiliserPointsFidelite = async () => {
    try {
      const baseTotal = initialTotal - appliedDiscount;
      const maxRemise = valeurPointsFidelite;
      const remiseAppliquee = Math.min(baseTotal, maxRemise);
      const finalTotal = baseTotal - remiseAppliquee;
      conversionRate && setPointsUtilises((remiseAppliquee * 100) / conversionRate);

      setTotalOrder(finalTotal);
      setRemainingAmount(finalTotal - paidAmount);
      setChangeToReturn(paidAmount - finalTotal > 0 ? paidAmount - finalTotal : 0);
      Modal.success({
        content: `Points fidélité utilisés : (${remiseAppliquee.toFixed(2)} €)`
      });
    } catch (error) {
      Modal.error({
        content: "Erreur lors de l'utilisation des points fidélité"
      });
    }
  };
  const handleValideCommande = async () => {
    console.log('selectedPayment:', selectedPayment);
    if (selectedPayment === "card") {
      setShowCardModal(true);

      try {
        const body = {
          originName: "192.168.2.84",
          TransactionCB: "NEWREGLEMENTSOFTAVERA",
          montant: totalOrder ?? total,
        };

        const response = await fetch("http://localhost:5000/postPaiement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const result = await response.json();
        setShowCardModal(false);

        if (!response.ok || result.code !== 1002) {
          notification.error({
            message: "Échec du paiement",
            description: `Code erreur: ${result.code} - ${result.message ?? "Inconnu"}`,
          });
          return;
        }

        notification.success({
          message: "Paiement accepté",
          description: "Le paiement par carte a été validé.",
        });


      } catch (error) {
        setShowCardModal(false);
        notification.error({
          message: "Erreur technique",
          description: "Impossible de contacter le terminal ou erreur du serveur.",
        });
        return;
      }
    }


    const finalTotal = totalOrder ?? total;
    const cardNumber = infoClient.cardfidelity || `${Math.floor(1000000000000 + Math.random() * 9000000000000)}`;
    let clientFinal = { ...infoClient };

    if (infoClient.id === 0) {
      clientFinal = {
        ...clientFinal,
        pointsfidelite: pointsgagneé,
        cardfidelity: cardNumber,
      };
    } else {
      const updatedPoints = infoClient.pointsfidelite - pointsUtilises + pointsgagneé;
      clientFinal = {
        ...clientFinal,
        pointsfidelite: updatedPoints,
      };
    }

    if (selectedPayment === 'cash' && remainingAmount !== null && remainingAmount > 0) {
      notification.warning({
        message: 'Erreur',
        description: "Il reste un montant à payer. Veuillez payer l'intégralité de la somme avant de valider la commande.",
        duration: 4,
      });
      return;

    }

    const newOrder = {
      id: Date.now(),
      total: finalTotal,
      paid: paidAmount,
      remainingAmount,
      promoCode,
      appliedDiscount,
      pointsUtilises,
      client: clientFinal,
      items: [...panier],
    };

    try {
      const response = await fetch('http://localhost:5000/api/commandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (!response.ok) throw new Error('Erreur lors de la sauvegarde dans la base de données');
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: "Impossible d'enregistrer la commande dans l’historique.",
      });
      return;
    }

    notification.success({
      message: "Commande validée",
      description: selectedPayment === 'card'
        ? "La commande a été enregistrée après paiement par carte."
        : "La commande a été enregistrée après paiement en espèces.",
    });

    viderPanier();
    handleClearAll();
    if (onSuccess) onSuccess();
    onClose();
  };

  useEffect(() => {
    const paid = parseFloat(inputValue);
    if (!isNaN(paid)) {
      setPaidAmount(paid);
      setRemainingAmount((totalOrder ?? total) - paid);
      setChangeToReturn(
        paid - (totalOrder ?? total) > 0 ? paid - (totalOrder ?? total) : 0
      );
    } else {
      setPaidAmount(0);
      setRemainingAmount(totalOrder ?? total);
      setChangeToReturn(null);
    }
  }, [inputValue, total, totalOrder]);
  return (
    <div>
      <Modal
        open={showCardModal}
        onCancel={() => setShowCardModal(false)}
        footer={null}
        centered
        closable={false}
      >
        <Flex vertical align="center" justify="center" gap="middle" style={{ padding: '20px' }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/6963/6963703.png"
            alt="Payment Icon"
            width={100}
            height={100}
          />
          <Title level={3}>Traitement de paiement</Title>
          <Paragraph style={{ textAlign: 'center' }}>
            Nous attendons la confirmation de votre paiement.<br />
          </Paragraph>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 60, color: '#808080' }} spin />} />
        </Flex>
      </Modal>
      <Modal
        title={
          <div>
            <Typography.Title level={4}>
              <strong>Interface de Paiement par</strong> {selectedPayment}
            </Typography.Title>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <Typography.Text>
                <strong>Total après remise:</strong>{' '}
                {totalOrder?.toFixed(2) ?? total.toFixed(2)} €
              </Typography.Text>
              <Typography.Text type={remainingAmount !== null && remainingAmount > 0 ? 'danger' : 'success'}>
                <strong>
                  {remainingAmount !== null && remainingAmount > 0 ? 'Reste à payer:' : 'À rendre au client:'}
                </strong>{' '}
                {(
                  (remainingAmount !== null && remainingAmount > 0
                    ? remainingAmount
                    : changeToReturn) ?? (totalOrder ?? total)
                ).toFixed(2)}{' '}
                €
              </Typography.Text>
            </div>
            <Typography.Text>
              <strong>Total points fidélité:</strong> {infoClient.pointsfidelite}
            </Typography.Text>
            {pointsUtilises > 0 && conversionRate !== null && (
              <Typography.Text type="success">
                <br />
                <strong>Points utilisés:</strong> {pointsUtilises} ({((pointsUtilises * conversionRate) / 100).toFixed(2)} €)
              </Typography.Text>
            )}
          </div>
        }
        open={open}
        onCancel={onClose}
        footer={null}
        width={900}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <Input
              placeholder="Code promo"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              style={{ width: 200 }}
            />
            <Button type="dashed" onClick={handleApplyPromo}>Appliquer</Button>
            <Button type="primary" onClick={utiliserPointsFidelite}>Utiliser les points fidélité</Button>
            {appliedDiscount > 0 && (
              <Typography.Text type="success">
                Remise: -{appliedDiscount.toFixed(2)} €
              </Typography.Text>
            )}
          </div>

          <div style={{ height: 300 }}>
            <Split
              sizes={[40, 45, 15]}
              minSize={100}
              gutterSize={10}
              direction="horizontal"
              style={{ display: 'flex', height: '100%' }}
            >
              <div style={{ padding: 10, background: '#f0f2f5' }}>
                <Typography.Title level={4}>Montant payé</Typography.Title>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography.Text>Espèce</Typography.Text>
                  <Typography.Text>Montant: {paidAmount.toFixed(2)} €</Typography.Text>
                  <Button type="primary" danger icon={<DeleteOutlined />} onClick={handleClearAll} />
                </div>
              </div>

              <div style={{ padding: 10, background: '#fafafa' }}>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  style={{ marginBottom: 10 }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {Array.from({ length: 9 }, (_, i) => (
                    <Button key={i} onClick={() => handleButtonClick((i + 1).toString())}>
                      {i + 1}
                    </Button>
                  ))}
                  <Button onClick={() => handleButtonClick('.')}>.</Button>
                  <Button onClick={() => handleButtonClick('0')}>0</Button>
                  <Button danger onClick={handleDeleteCharacter}>Supp Caractère</Button>
                  <Button danger onClick={handleClearAll}>Effacer tout</Button>
                </div>
              </div>

              <div style={{ padding: 10, background: '#e6f7ff' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button type="primary" style={{ background: 'orange', borderColor: 'orange' }}>
                    OK
                  </Button>
                  {[5, 10, 20, 30, 50].map((val) => (
                    <Button key={val} onClick={() => handleButtonClick(val.toString())}>
                      {val} €
                    </Button>
                  ))}
                  <Button
                    type="primary"
                    style={{ background: 'green', borderColor: 'green' }}
                    onClick={() => {
                      console.log('Valider la commande');
                      handleValideCommande();
                    }}
                  >
                    Valider
                  </Button>

                </Space>
              </div>
            </Split>
          </div>
        </Space>
      </Modal>
    </div>

  );
};

export default PaiementModal;
