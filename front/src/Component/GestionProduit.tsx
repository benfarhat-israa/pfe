import React, { useState } from 'react';
import { Button, Menu, Table, Modal, Form, Input, Select, Upload } from 'antd';
import { UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import VirtualKeyboard from "./keyboard"; 

const { Option } = Select;

interface Article {
  key: string;
  designation: string;
  image: string;
  tva: string;
  prixTTC: string;
  couleurHex: string;
  categorieParente: string;
  pointsFidelite: number;
}

interface Categorie {
  key: string;
  designation: string;
  image: string;
  couleurHex: string;
}

const items = [
  { label: 'Gestion des articles', key: 'article' },
  { label: 'Gestion des catégories', key: 'categorie' },
];

const dataArticles: Article[] = [
  { key: '1', designation: 'Article 1', image: 'https://via.placeholder.com/50', tva: '20%', prixTTC: '120€', couleurHex: '#FF0000', categorieParente: 'Vêtements', pointsFidelite: 10 },
];

const dataCategories: Categorie[] = [
  { key: '1', designation: 'Catégorie 1', image: 'https://via.placeholder.com/50', couleurHex: '#FF0000' },
];

const GestionProduit: React.FC = () => {
  const [current, setCurrent] = useState<'article' | 'categorie'>('article');
  const [modalVisible, setModalVisible] = useState(false);
  const [isArticleForm, setIsArticleForm] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [prixTtc, setPrixTtc] = useState('');
  const [pointsFid, setPointsFid] = useState('');
  const [tva, setTva] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false); // Ajouté pour afficher ou masquer le clavier
  const [activeField, setActiveField] = useState<string | null>(null); // Gérer le champ actif pour afficher le clavier

  const showModal = (isArticle: boolean) => {
    setIsArticleForm(isArticle);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setShowKeyboard(false);  // Masquer le clavier lorsque le modal se ferme
  };

  const handleSubmit = (values: any) => {
    console.log('Form submitted:', values);
    setModalVisible(false);
  };

  const handleFocus = (field: string) => {
    setActiveField(field); // Mettre à jour le champ actif
    if (field === 'pointsFid' || field === 'tva' || field === 'prixTTC' || field === 'designation') {
      setShowKeyboard(true); // Afficher le clavier pour ces champs
    }
  };

  const handleBlur = () => {
    setShowKeyboard(false); // Masquer le clavier lorsque le champ perd le focus
  };

  return (
    <div style={{ padding: 20 }}>
      <Menu onClick={(e) => setCurrent(e.key as 'article' | 'categorie')} selectedKeys={[current]} mode="horizontal" items={items} />

      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '20px 0' }}>
        <Button type="primary" onClick={() => showModal(current === 'article')}>
          {current === 'article' ? 'Ajouter Article' : 'Ajouter Catégorie'}
        </Button>
      </div>

      {current === 'article' ? (
        <Table dataSource={dataArticles} columns={[
          { title: 'Désignation', dataIndex: 'designation', key: 'designation' },
          { title: 'Image', dataIndex: 'image', key: 'image', render: (img) => <img src={img} alt="img" style={{ width: 50, height: 50 }} /> },
          { title: 'TVA', dataIndex: 'tva', key: 'tva' },
          { title: 'Prix TTC', dataIndex: 'prixTTC', key: 'prixTTC' },
          { title: 'Couleur', dataIndex: 'couleurHex', key: 'couleur', render: (color) => <div style={{ width: 20, height: 20, backgroundColor: color, borderRadius: '50%' }} /> },
          { title: 'Catégorie', dataIndex: 'categorieParente', key: 'categorieParente' },
          { title: 'Points Fidélité', dataIndex: 'pointsFidelite', key: 'pointsFidelite' },
          { title: 'Action', key: 'action', render: () => (
            <div style={{ display: 'flex', gap: 10 }}>
              <EditOutlined style={{ fontSize: 18, color: '#1890ff', cursor: 'pointer' }} />
              <DeleteOutlined style={{ fontSize: 18, color: 'red', cursor: 'pointer' }} />
            </div>
          )}
        ]} />
      ) : (
        <Table dataSource={dataCategories} columns={[
          { title: 'Désignation', dataIndex: 'designation', key: 'designation' },
          { title: 'Image', dataIndex: 'image', key: 'image', render: (img) => <img src={img} alt="img" style={{ width: 50, height: 50 }} /> },
          { title: 'Couleur', dataIndex: 'couleurHex', key: 'couleur', render: (color) => <div style={{ width: 20, height: 20, backgroundColor: color, borderRadius: '50%' }} /> },
          { title: 'Action', key: 'action', render: () => (
            <div style={{ display: 'flex', gap: 10 }}>
              <EditOutlined style={{ fontSize: 18, color: '#1890ff', cursor: 'pointer' }} />
              <DeleteOutlined style={{ fontSize: 18, color: 'red', cursor: 'pointer' }} />
            </div>
          )}
        ]} />
      )}

      <Modal title={isArticleForm ? "Ajouter un Article" : "Ajouter une Catégorie"} open={modalVisible} onCancel={handleCancel} footer={null}>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Désignation" name="designation" rules={[{ required: true, message: 'Veuillez entrer la désignation' }]}>
            <div>
              <Input 
                value={inputValue} 
                onFocus={() => handleFocus('designation')} // Indiquer que le champ Désignation est actif
                onChange={(e) => setInputValue(e.target.value)} 
                placeholder="Désignation" 
              />
              {activeField === 'designation' && showKeyboard && <VirtualKeyboard onChange={setInputValue} />}
            </div>
          </Form.Item>

          {isArticleForm && ( 
            <>
              <Form.Item label="Catégorie" name="category">
                <Select>
                  <Option value="cat1">ENTRÉE</Option>
                  <Option value="cat2">PLATS</Option>
                  <Option value="cat3">SAUCES</Option>
                  <Option value="cat4">SUPPLÉMENTS</Option>
                  <Option value="cat5">DESSERTS</Option>
                  <Option value="cat6">BOISSONS</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Points Fidélité" name="pointsFid">
                <div>
                  <Input 
                    type="text"
                    value={pointsFid}
                    onFocus={() => handleFocus('pointsFid')} // Afficher le clavier pour ce champ
                    onBlur={handleBlur}  // Cacher le clavier quand on quitte ce champ
                    onChange={(e) => setPointsFid(e.target.value)} 
                    placeholder="Points Fidélité" 
                  />
                  {activeField === 'pointsFid' && showKeyboard && <VirtualKeyboard onChange={setPointsFid} />}
                </div>
              </Form.Item>

              <Form.Item label="TVA (%)" name="tva">
                <div>
                  <Input 
                    type="text" 
                    value={tva} 
                    onFocus={() => handleFocus('tva')} 
                    onBlur={handleBlur} 
                    onChange={(e) => setTva(e.target.value)} 
                    placeholder="TVA" 
                  />
                  {activeField === 'tva' && showKeyboard && <VirtualKeyboard onChange={setTva} />}
                </div>
              </Form.Item>

              <Form.Item label="Prix TTC" name="prixTTC">
                <div>
                  <Input 
                    type="text" 
                    value={prixTtc} 
                    onFocus={() => handleFocus('prixTTC')} 
                    onBlur={handleBlur} 
                    onChange={(e) => setPrixTtc(e.target.value)} 
                    placeholder="Prix TTC" 
                  />
                  {activeField === 'prixTTC' && showKeyboard && <VirtualKeyboard onChange={setPrixTtc} />}
                </div>
              </Form.Item>
            </>
          )}

          <Form.Item label="Couleur" name="couleur">
            <Input type="color" />
          </Form.Item>

          <Form.Item label="Image" name="image">
            <Upload beforeUpload={() => false} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Choisir une image</Button>
            </Upload>
          </Form.Item>

          <Form.Item style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Button type="primary" htmlType="submit">
              {isArticleForm ? 'Ajouter Article' : 'Ajouter Catégorie'}
            </Button>
            <Button type="default" onClick={() => setModalVisible(false)}>
              Annuler
            </Button>
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default GestionProduit;
