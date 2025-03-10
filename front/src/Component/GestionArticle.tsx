import React, { useState } from 'react';
import { Menu, Table } from 'antd';
import type { MenuProps } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const items: MenuProps['items'] = [
  {
    label: 'Gestion de article',
    key: 'article',
  },
  {
    label: 'Gestion de categorie',
    key: 'categorie',
  },
];

const data = [
  {
    key: '1',
    designation: 'Article 1',
    image: 'https://via.placeholder.com/50',
    tva: '20%',
    prixTTC: '120€',
    couleurHex: '#FF0000', 
    categorieParente: 'Vêtements',
    pointsFidelite: 10,
  },
  {
    key: '2',
    designation: 'Article 2',
    image: 'https://via.placeholder.com/50',
    tva: '10%',
    prixTTC: '100€',
    couleurHex: '#0000FF', 
    categorieParente: 'Accessoires',
    pointsFidelite: 5,
  },
  {
    key: '3',
    designation: 'Article 3',
    image: 'https://via.placeholder.com/50',
    tva: '5%',
    prixTTC: '80€',
    couleurHex: '#00FF00', 
    categorieParente: 'Meubles',
    pointsFidelite: 8,
  },
];

const columns = [
  {
    title: 'Désignation',
    dataIndex: 'designation',
    key: 'designation',
  },
  {
    title: 'Image',
    dataIndex: 'image',
    key: 'image',
    render: (image: string) => <img src={image} alt="image" style={{ width: 50, height: 50 }} />,
  },
  {
    title: 'TVA',
    dataIndex: 'tva',
    key: 'tva',
  },
  {
    title: 'Prix TTC',
    dataIndex: 'prixTTC',
    key: 'prixTTC',
  },
  {
    title: 'Couleur',
    dataIndex: 'couleur',
    key: 'couleur',
    render: (couleur: string, record: any) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 20,
            height: 20,
            backgroundColor: record.couleurHex, 
            borderRadius: '50%',
          }}
        ></div>
        {couleur} 
      </div>
    ),
  },
  {
    title: 'Catégorie Parente',
    dataIndex: 'categorieParente',
    key: 'categorieParente',
  },
  {
    title: 'Nbr Pts Fid',
    dataIndex: 'pointsFidelite',
    key: 'pointsFidelite',
  },
  {
    title: 'Action',
    key: 'action',
    render: (text: string, record: any) => (
      <div style={{ display: 'flex', gap: 10 }}>
        <EditOutlined
          style={{ fontSize: 18, color: '#1890ff', cursor: 'pointer' }}
          onClick={() => handleAction('edit', record)}
        />
        <DeleteOutlined
          style={{ fontSize: 18, color: 'red', cursor: 'pointer' }}
          onClick={() => handleAction('delete', record)}
        />
      </div>
    ),
  },
];

const handleAction = (action: string, record: any) => {
  if (action === 'edit') {
    console.log('Modifier', record);
  } else if (action === 'delete') {
    console.log('Supprimer', record);
  }
};

const App: React.FC = () => {
  const [current, setCurrent] = useState('article');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return (
    <div>
      <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default App;
