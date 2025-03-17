import { useState } from "react";
import { Button, Upload, Modal, Form, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function CategoriesForm() {
  const [formCategory, setformCategory] = useState({
    designation: "",
    couleur: "#000000",
    image: null as File | null,
  });
  const [modalVisible, setModalVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setformCategory({
      ...formCategory,
      [name]: type === "number" ? parseFloat(value) : value,
    });
  };

  const handleImageChange = (file: File) => {
    setformCategory({ ...formCategory, image: file });
    return false;
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formCategory);
    setModalVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={() => setModalVisible(true)}>
        Ajouter une catégorie
      </Button>
      <Modal
        title="Ajouter une catégorie"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
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
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
