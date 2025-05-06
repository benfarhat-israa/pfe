import React, { useState, useEffect } from 'react';
import { Input, Button, Table, Typography, Space, Form, DatePicker, Modal, message } from 'antd';
import 'antd/dist/reset.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import dayjs, { Dayjs } from 'dayjs';
import { CopyOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

interface PromoCode {
    id: number;
    code: string;
    discount_percent: number;
    expiry_date?: string;
    max_uses?: number;
}

const generateRandomCode = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const PromoPage: React.FC = () => {
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPromoCodes, setFilteredPromoCodes] = useState<PromoCode[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
    const [form] = Form.useForm();
    const [newExpiryDate, setNewExpiryDate] = useState<Dayjs | null>(null);

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    const fetchPromoCodes = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/promo-codes');
            const data = await response.json();
            setPromoCodes(data);
            setFilteredPromoCodes(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des codes promo", error);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = promoCodes.filter(p =>
            p.code.toLowerCase().includes(term)
        );
        setFilteredPromoCodes(filtered);
    };

    const handleAddOrUpdatePromo = async (values: any) => {
        const promoData = {
            code: values.code,
            discount_percent: parseInt(values.discount, 10),
            expiry_date: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : null,
            max_uses: values.maxUses ? parseInt(values.maxUses, 10) : null,
        };

        try {
            if (editingPromo) {
                const response = await fetch(`http://localhost:5000/api/promo-codes/${editingPromo.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(promoData),
                });
                const updated = await response.json();
                setPromoCodes(promoCodes.map(p => p.id === updated.id ? updated : p));
                setFilteredPromoCodes(promoCodes.map(p => p.id === updated.id ? updated : p));
                message.success('Code promo mis à jour');
            } else {
                const response = await fetch('http://localhost:5000/api/promo-codes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(promoData),
                });
                const newPromo = await response.json();
                const updatedList = [newPromo, ...promoCodes];
                setPromoCodes(updatedList);
                setFilteredPromoCodes(updatedList);
                message.success('Code promo ajouté');
            }
            form.resetFields();
            setNewExpiryDate(null);
            setIsModalVisible(false);
            setEditingPromo(null);
        } catch (error) {
            console.error("Erreur lors de l'ajout ou modification", error);
        }
    };

    const handleDeletePromo = async (id: number) => {
        Modal.confirm({
            title: 'Supprimer ce code ?',
            content: 'Cette action est irréversible.',
            okText: 'Oui',
            okType: 'danger',
            cancelText: 'Non',
            onOk: async () => {
                try {
                    await fetch(`http://localhost:5000/api/promo-codes/${id}`, {
                        method: 'DELETE',
                    });
                    const updated = promoCodes.filter(p => p.id !== id);
                    setPromoCodes(updated);
                    setFilteredPromoCodes(updated);
                    message.success('Code supprimé');
                } catch (error) {
                    console.error("Erreur lors de la suppression", error);
                }
            }
        });
    };

    const openModalForEdit = (promo: PromoCode) => {
        setEditingPromo(promo);
        setNewExpiryDate(promo.expiry_date ? dayjs(promo.expiry_date) : null);
        form.setFieldsValue({
            code: promo.code,
            discount: promo.discount_percent,
            maxUses: promo.max_uses,
            expiryDate: promo.expiry_date ? dayjs(promo.expiry_date) : null,
        });
        setIsModalVisible(true);
    };
    const columns = [
        {
            title: '@ Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Remise',
            dataIndex: 'discount_percent',
            key: 'remise',
            render: (value: number) => value ? 'remise en %' : 'frais de livraison',
        },
        {
            title: 'Valeur',
            dataIndex: 'discount_percent',
            key: 'valeur',
            render: (value: number) => value ?? '-',
        },
        {
            title: 'Utilisation rest.',
            dataIndex: 'max_uses',
            key: 'max_uses',
            render: (value: number) => value ?? '-',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: PromoCode) => (
                <Space>
                    <Button size="large"  shape="circle" icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(record.code)}></Button>
                    <Button size="large"  shape="circle" icon={<EditOutlined />} onClick={() => openModalForEdit(record)}></Button>
                    <Button size="large"  shape="circle" danger icon={<DeleteOutlined />} onClick={() => handleDeletePromo(record.id)}></Button>
                </Space>
            ),
        },
    ];

    const tableData = filteredPromoCodes.map((item, index) => ({
        key: index,
        ...item,
    }));
    return (
        <div className="container mt-4">
            <Typography.Title level={2}>Codes Promotionnels</Typography.Title>
            <div className="text-end mb-3">
                <Button
                    type="primary"
                    onClick={() => {
                        form.setFieldsValue({ code: generateRandomCode() });
                        setEditingPromo(null);
                        setIsModalVisible(true);
                    }}
                    icon={<PlusOutlined />}
                    className="mb-3"
                >
                    Nouveau code promo
                </Button>
            </div>
            <Modal
                title={editingPromo ? "Modifier le code promo" : "Créer un code promotionnel"}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                    setEditingPromo(null);
                    setNewExpiryDate(null);
                }}
                onOk={() => form.submit()}
                okText={editingPromo ? "Mettre à jour" : "Ajouter"}
                cancelText="Annuler"
            >
                <Form form={form} layout="vertical" onFinish={handleAddOrUpdatePromo}>
                    <Form.Item label="Code" required rules={[{ required: true, message: 'Le code est requis.' }]}>
                        <Input.Group compact>
                            <Form.Item name="code" noStyle rules={[{ required: true }]}>
                                <Input readOnly style={{ width: 'calc(100% - 110px)' }} />
                            </Form.Item>
                            <Button
                                onClick={() => {
                                    const newCode = generateRandomCode();
                                    form.setFieldsValue({ code: newCode });
                                }}
                            >
                                Générer
                            </Button>
                        </Input.Group>
                    </Form.Item>

                    <Form.Item label="Réduction (%)" name="discount" rules={[{ required: true }]}>
                        <Input placeholder="Ex: 10" />
                    </Form.Item>

                    <Form.Item label="Nombre d'utilisations" name="maxUses" rules={[{ required: true }]}>
                        <Input type="number" min={1} placeholder="Ex: 100" />
                    </Form.Item>

                    <Form.Item label="Date d'expiration (optionnelle)" name="expiryDate">
                        <DatePicker
                            value={newExpiryDate}
                            onChange={(date) => setNewExpiryDate(date)}
                            format="YYYY-MM-DD"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
                <Input
                    placeholder="Rechercher un code..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </Space>

            <Table columns={columns} dataSource={tableData} pagination={{ pageSize: 5 }} />

        </div>
    );
};

export default PromoPage;
