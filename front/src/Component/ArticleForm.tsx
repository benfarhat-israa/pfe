import React from 'react';
import { Modal, Form, Input, Button } from 'antd';


interface ArticleFormProps {
  visible: boolean;
  onClose: () => void;
  onProductAdded: () => Promise<void>;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ visible, onClose, onProductAdded }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // Ajoutez ici la logique pour envoyer les données au backend
      await onProductAdded(); // Recharger les produits après ajout
      onClose(); // Fermer le modal
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'article :", error);
    }
  };

  return (
    <Modal
      title="Ajouter un produit"
      visible={visible}
      onOk={handleOk}
      onCancel={onClose}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="designation" label="Désignation" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="prixttc" label="Prix TTC" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item name="tva" label="TVA" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item name="couleur" label="Couleur">
          <Input type="color" />
        </Form.Item>
        <Form.Item name="category" label="Catégorie" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="pointsfid" label="Points Fidélité">
          <Input type="number" />
        </Form.Item>
        <Form.Item name="image" label="Image">
          <Input type="file" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ArticleForm;