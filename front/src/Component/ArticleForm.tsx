import { useState } from "react";
import { Button,  Upload, Modal, Form, Input, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function ArticleForm() {
  const [formData, setFormData] = useState({
    designation: "",
    category: "",
    pointsFid: 0,
    tva: 0,
    prixTTC: 0,
    couleur: "#000000",
    image: null as File | null,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); // for submit loading state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) : value,
    });
  };

  const handleImageChange = (file: File) => {
    setFormData({ ...formData, image: file });
    return false;
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Simulate form submission, replace with your actual API call
      console.log("Form submitted:", formData);
      setModalVisible(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setModalVisible(true)}>
        Ajouter un article
      </Button>
      <Modal
        title="Ajouter un article"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={formData}
        >
          <Form.Item
            label="Désignation"
            name="designation"
            rules={[{ required: true, message: 'Veuillez entrer la désignation' }]}
          >
            <Input
              type="text"
              name="designation"
              placeholder="Désignation"
              value={formData.designation}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item label="Catégorie" name="category">
  <Select
    value={formData.category}
    onChange={(value) => setFormData({ ...formData, category: value })}
    options={[
      { value: "cat1", label: "ENTRÉE" },
      { value: "cat2", label: "PLATS 2" },
      { value: "cat3", label: "SAUCES" },
      { value: "cat4", label: "SUPPLÉMENTS" },
      { value: "cat5", label: "DESSERTS" },
      { value: "cat6", label: "BOISSONS" },

    ]}
  />
</Form.Item>

          <Form.Item label="Points Fidélité" name="pointsFid">
            <Input
              type="number"
              name="pointsFid"
              placeholder="Nombre de points fidélité"
              value={formData.pointsFid}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item label="TVA" name="tva">
            <Input
              type="number"
              name="tva"
              placeholder="TVA"
              value={formData.tva}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item label="Prix TTC" name="prixTTC">
            <Input
              type="number"
              name="prixTTC"
              placeholder="Prix TTC"
              value={formData.prixTTC}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item label="Couleur" name="couleur">
            <Input
              type="color"
              name="couleur"
              value={formData.couleur}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item label="Image" name="image">
            <Upload beforeUpload={handleImageChange} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Choisir une image</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={loading} 
              disabled={loading}
            >
              Ajouter
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
