// src/Component/Onlinie.tsx
import React from 'react';
import { Modal, Button, Typography, Divider } from 'antd';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const { Title, Text } = Typography;

const stripePromise = loadStripe('pk_test_XXXXXXXXXXXXXXXXXXXXXXXX');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      letterSpacing: '0.025em',
      fontFamily: 'Arial, sans-serif',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const CheckoutForm = ({ onClose }: { onClose: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = React.useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    setLoading(false);

    if (error) {
      Modal.error({ title: 'Paiement échoué', content: error.message });
    } else {
      Modal.success({
        title: 'Paiement réussi',
        content: `Paiement effectué avec l'ID : ${paymentMethod.id}`,
      });
      onClose();
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={4}>Paiement sécurisé</Title>
      <Text type="secondary">Veuillez entrer les informations de votre carte bancaire :</Text>
      <Divider />
      <div style={{ border: '1px solid #d9d9d9', borderRadius: 6, padding: 12, backgroundColor: '#fafafa' }}>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      <Button
        type="primary"
        block
        onClick={handlePayment}
        loading={loading}
        style={{ marginTop: 24 }}
        disabled={!stripe}
      >
        Confirmer le paiement
      </Button>
    </div>
  );
};

type OnlinieProps = {
  visible: boolean;
  onClose: () => void;
};

const Onlinie = ({ visible, onClose }: OnlinieProps) => {
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      title={null}
      bodyStyle={{ padding: 0 }}
    >
      <Elements stripe={stripePromise}>
        <CheckoutForm onClose={onClose} />
      </Elements>
    </Modal>
  );
};

export default Onlinie;
