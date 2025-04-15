import React, { useState } from 'react';
import Split from 'react-split';
import { Button, Space, Typography, Input, Modal } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';

const App: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [paidAmount, setPaidAmount] = useState(0);
  const [totalOrder, setTotalOrder] = useState<number | null>(null);
  const [remainingAmount, setRemainingAmount] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const handleButtonClick = (value: string) => {
    setInputValue((prev) => prev + value);
  };

  const handleOperationClick = (op: string) => {
    setOperation(op);
    setPaidAmount(parseFloat(inputValue) || 0);
    setInputValue('');
  };

  const handleCalculate = () => {
    const numericValue = parseFloat(inputValue) || 0;
    let result = paidAmount;

    if (operation === '+') result += numericValue;

    const updatedRemaining = totalOrder !== null ? Math.max(totalOrder - result, 0) : null;

    setPaidAmount(result);
    if (updatedRemaining !== null) setRemainingAmount(updatedRemaining);
    setInputValue(result.toFixed(2));
    setOperation(null);
  };

  const handleDeleteCharacter = () => setInputValue((prev) => prev.slice(0, -1));

  const handleClearAll = () => {
    setInputValue('');
    setPaidAmount(0);
    setTotalOrder(null);
    setRemainingAmount(null);
    setOperation(null);
  };

  const handleValidate = () => {
    const total = parseFloat(inputValue);
    if (!isNaN(total)) {
      setTotalOrder(total);
      setRemainingAmount(total);
      setInputValue('');
      Modal.success({ content: 'Total défini avec succès !' });
    } else if (remainingAmount === 0) {
      Modal.success({ content: 'Paiement validé avec succès !' });
      handleClearAll();
    } else {
      Modal.warning({ content: 'Il reste un montant à payer.' });
    }
  };

  const handlePayInFull = () => {
    if (totalOrder !== null) {
      setPaidAmount(totalOrder);
      setRemainingAmount(0);
      setInputValue(totalOrder.toFixed(2));
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Button type="primary" icon={<ShoppingOutlined />} onClick={showModal}>
        Ouvrir Paiement
      </Button>

      <Modal
        title={
          <div>
            <Typography.Title level={4} style={{ marginBottom: '10px' }}>
              Interface de Paiement
            </Typography.Title>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography.Text style={{ fontSize: '16px' }}>
                <strong>Total de la commande:</strong>{' '}
                {totalOrder !== null ? totalOrder.toFixed(2) : '--'} €
              </Typography.Text>
              <Typography.Text style={{ fontSize: '16px' }}>
                <strong>Reste à payer:</strong>{' '}
                {(remainingAmount !== null && remainingAmount !== totalOrder)
                  ? remainingAmount.toFixed(2)
                  : totalOrder !== null
                    ? totalOrder.toFixed(2)
                    : '--'} €
              </Typography.Text>
            </div>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={900}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ height: 300, width: '100%' }}>
            <Split
              sizes={[45, 45, 10]}
              minSize={100}
              gutterSize={10}
              direction="horizontal"
              style={{ display: 'flex', height: '100%' }}
            >
              {/* Panel 1: Montant payé */}
              <div style={{ background: '#f0f2f5', padding: '10px' }}>
                <Typography.Title level={4}>Montant payé</Typography.Title>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography.Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Espèce</Typography.Text>
                  <Typography.Text style={{ fontSize: '18px', fontWeight: 'bold' }}>
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

              {/* Panel 2: Calculatrice */}
              <div style={{ background: '#fafafa', padding: '10px' }}>
                <Input
                  placeholder="Saisissez ici"
                  value={inputValue}
                  style={{ marginBottom: '15px' }}
                  readOnly
                />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {Array.from({ length: 9 }, (_, i) => (
                    <Button key={i + 1} type="primary" onClick={() => handleButtonClick((i + 1).toString())}>
                      {i + 1}
                    </Button>
                  ))}
                  <Button type="primary" onClick={() => handleButtonClick('.')}>.</Button>
                  <Button type="primary" onClick={() => handleButtonClick('0')}>0</Button>
                  <Button type="primary" onClick={() => handleOperationClick('+')}>+</Button>
                  <Button danger onClick={handleDeleteCharacter}>Supp Caractère</Button>
                  <Button danger onClick={handleClearAll}>Effacer tout</Button>
                  <Button type="primary" style={{ gridColumn: 'span 3' }} onClick={handlePayInFull}>
                    Régler en totalité
                  </Button>
                </div>
              </div>

              {/* Panel 3: Actions Rapides */}
              <div style={{ background: '#e6f7ff', padding: '10px' }}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Button
                    type="primary"
                    style={{ backgroundColor: 'orange', borderColor: 'orange', width: '100%', height: '45px' }}
                    onClick={handleCalculate}
                  >
                    OK
                  </Button>
                  <Button
                    type="primary"
                    style={{ width: '100%', height: '45px' }}
                    onClick={() => handleButtonClick('5')}
                  >
                    5 €
                  </Button>
                  <Button
                    type="primary"
                    style={{ width: '100%', height: '45px' }}
                    onClick={() => handleButtonClick('10')}
                  >
                    10 €
                  </Button>
                  <Button
                    type="primary"
                    style={{ width: '100%', height: '45px' }}
                    onClick={() => handleButtonClick('20')}
                  >
                    20 €
                  </Button>
                  <Button
                    type="primary"
                    style={{ backgroundColor: 'green', borderColor: 'green', width: '100%', height: '45px' }}
                    onClick={handleValidate}
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

export default App;
