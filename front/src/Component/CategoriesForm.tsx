import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Importez useNavigate pour la redirection

export default function CategoriesForm() {
  const [formCategory, setFormCategory] = useState({
    designation: "",
    couleur: "#000000",
    image: null as File | null,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate(); // Hook pour la redirection

  // Ouvre le modal au chargement de la page
  useEffect(() => {
    setModalVisible(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormCategory({
      ...formCategory,
      [name]: type === "number" ? parseFloat(value) : value,
    });
  };

  const handleImageChange = (file: File) => {
    setFormCategory({ ...formCategory, image: file });
    return false;
  };

  // Fonction pour la soumission du formulaire
  const handleSubmit = () => {
    console.log("Form submitted:", formCategory);
    setModalVisible(false); // Ferme le modal après la soumission
    navigate("/home"); // Redirige vers la page Produits
  };

  // Fonction pour fermer le modal sans soumettre
  const handleCancel = () => {
    setModalVisible(false); // Ferme le modal
    navigate("/produits"); // Redirige vers la page Produits
  };

  return (
    <div>
      {/* Modal pour ajouter une catégorie */}
      <Modal
        title="Ajouter une catégorie"
        visible={modalVisible}
        onCancel={handleCancel} // Ferme le modal et redirige
        footer={null} // Désactive les boutons par défaut
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Désignation" required>
            <Input
              type="text"
              name="designation"
              placeholder="Désignation"
              value={formCategory.designation}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item label="Couleur">
            <Input
              type="color"
              name="couleur"
              value={formCategory.couleur}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item label="Image">
            <Upload beforeUpload={handleImageChange} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Choisir une image</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <div style={{ textAlign: "center" }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: "8px" }}
              >
                Ajouter
              </Button>
              <Button
                type="default"
                htmlType="button"
                onClick={() => setModalVisible(false)}
              >
                Annuler
              </Button>
            </div>
            <Button type="primary" htmlType="submit">
              Ajouter
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
