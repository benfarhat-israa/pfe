import React, { useState, useEffect } from 'react';
import { Modal, Button, Typography, Space, Input } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import Split from 'react-split';
import { notification } from 'antd';
const commandesValide: any[] = [];

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
  panier: Item[]; // <-- AJOUTER ICI
  infoClient: {
    id: number;
    phoneNumber: string;
    name: string;
    firstName: string;
    address: string;
    pointsfidelite: number;
    cardfidelity: string;
  };
}
const PaiementModal: React.FC<PaiementModalProps> = ({
  open,
  onClose,
  total,
  onSuccess,
  panier,
  infoClient
}) => {

  const [inputValue, setInputValue] = useState('');
  const [paidAmount, setPaidAmount] = useState(0);
  const [totalOrder, setTotalOrder] = useState<number | null>(null);
  const [remainingAmount, setRemainingAmount] = useState<number | null>(null);
  const [changeToReturn, setChangeToReturn] = useState<number | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [pointsUtilises, setPointsUtilises] = useState(0);
  const [conversionRate, setConversionRate] = useState<number>(0.1); // Valeur par défaut
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
      const res = await fetch('http://localhost:5000/api/fidelite-config');
      const { conversion_rate } = await res.json();
      setConversionRate(conversion_rate);

      const baseTotal = initialTotal - appliedDiscount;
      const maxRemise = infoClient.pointsfidelite * conversion_rate;
      const remiseAppliquee = Math.min(baseTotal, maxRemise);
      const points = Math.floor(remiseAppliquee / conversion_rate);
      const finalTotal = baseTotal - remiseAppliquee;

      setPointsUtilises(points);
      setTotalOrder(finalTotal);
      setRemainingAmount(finalTotal - paidAmount);
      setChangeToReturn(paidAmount - finalTotal > 0 ? paidAmount - finalTotal : 0);

      Modal.success({
        content: `Points fidélité utilisés : ${points} (${remiseAppliquee.toFixed(2)} €)`
      });
    } catch (error) {
      Modal.error({
        content: "Erreur lors de l'utilisation des points fidélité"
      });
    }
  };
  const handleValideCommande = async () => {

    const finalTotal = totalOrder ?? total;
    //    // Création de la commande
    const generatedCardNumber = `${Math.floor(1000000000000 + Math.random() * 9000000000000)}`;

    const clientFinal = infoClient.id === 0
      ? {
        ...infoClient,
        cardfidelity: generatedCardNumber
      }
      : infoClient;

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

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde dans la base de données');
      }
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: "Impossible d'enregistrer la commande dans l’historique.",
        duration: 2,
      });
      return;
    }
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

  useEffect(() => {
    const fetchFideliteConfig = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/fidelite-config');
        const { conversion_rate } = await res.json();
        setConversionRate(conversion_rate);
      } catch (error) {
        console.error('Erreur lors du chargement du taux de fidélité', error);
      }
    };

    const fetchPromoCodes = async () => {
      try {
        await fetch('http://localhost:5000/api/promo-codes');
      } catch (error) {
        console.error('Erreur lors du chargement des codes promo', error);
      }
    };

    if (open) {
      fetchFideliteConfig();
      fetchPromoCodes();
    }
  }, [open]);

  return (
    <Modal
      title={
        <div>
          <Typography.Title level={4}>Interface de Paiement</Typography.Title>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 10
            }}
          >
            <Typography.Text>
              <strong>Total après remise:</strong>{' '}
              {totalOrder?.toFixed(2) ?? total.toFixed(2)} €
            </Typography.Text>
            <Typography.Text
              type={
                remainingAmount !== null && remainingAmount > 0
                  ? 'danger'
                  : 'success'
              }
            >
              <strong>
                {remainingAmount !== null && remainingAmount > 0
                  ? 'Reste à payer:'
                  : 'À rendre au client:'}
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
            <strong>Total points fidélité:</strong>{' '}
            {infoClient.pointsfidelite}
          </Typography.Text>
          {pointsUtilises > 0 && (
            <Typography.Text type="success">
              <br />
              <strong>Points utilisés:</strong> {pointsUtilises} (
              {(pointsUtilises * conversionRate).toFixed(2)} €)
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
          <Button type="dashed" onClick={handleApplyPromo}>
            Appliquer
          </Button>
          <Button type="primary" onClick={utiliserPointsFidelite}>
            Utiliser les points fidélité
          </Button>
          {appliedDiscount > 0 && (
            <Typography.Text type="success">
              Remise: -{appliedDiscount.toFixed(2)} €
            </Typography.Text>
          )}
        </div>

        <div style={{ height: 300 }}>
          <Split
            sizes={[45, 45, 10]}
            minSize={100}
            gutterSize={10}
            direction="horizontal"
            style={{ display: 'flex', height: '100%' }}
          >
            <div style={{ padding: 10, background: '#f0f2f5' }}>
              <Typography.Title level={4}>Montant payé</Typography.Title>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography.Text>Espèce</Typography.Text>
                <Typography.Text>
                  Montant: {paidAmount.toFixed(2)} €
                </Typography.Text>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleClearAll}
                />
              </div>
            </div>

            <div style={{ padding: 10, background: '#fafafa' }}>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{ marginBottom: 10 }}
              />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 10
                }}
              >
                {Array.from({ length: 9 }, (_, i) => (
                  <Button
                    key={i}
                    onClick={() => handleButtonClick((i + 1).toString())}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button onClick={() => handleButtonClick('.')}>.</Button>
                <Button onClick={() => handleButtonClick('0')}>0</Button>
                <Button danger onClick={handleDeleteCharacter}>
                  Supp Caractère
                </Button>
                <Button danger onClick={handleClearAll}>
                  Effacer tout
                </Button>
              </div>
            </div>

            <div style={{ padding: 10, background: '#e6f7ff' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  style={{ background: 'orange', borderColor: 'orange' }}
                >
                  OK
                </Button>
                {[5, 10, 20].map((val) => (
                  <Button
                    key={val}
                    onClick={() => handleButtonClick(val.toString())}
                  >
                    {val} €
                  </Button>
                ))}
                <Button
                  type="primary"
                  style={{ background: 'green', borderColor: 'green' }}
                  onClick={handleValideCommande}
                >
                  valide
                </Button>
              </Space>
            </div>
          </Split>
        </div>
      </Space>
    </Modal>
  );
};

export default PaiementModal;
