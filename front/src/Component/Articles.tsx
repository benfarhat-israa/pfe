import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Tooltip,
    Space,
    Modal,
    Input,
    Form,
    message,
    Upload,
    Select,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    UploadOutlined,
} from "@ant-design/icons";
const { Option } = Select;

interface Produit {
    id: number;
    designation: string;
    image?: string;
    tva: number;
    prixttc: number;
    couleur?: string;
    category: string;
    pointsfid: number;
}

const Articles: React.FC = () => {
    const [produits, setProduits] = useState<Produit[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [produitToEdit, setProduitToEdit] = useState<Produit | null>(null);
    const [form] = Form.useForm();
    const [formAjout] = Form.useForm();
    const [categories, setCategories] = useState<{ id: string; designation: string }[]>([]);

    useEffect(() => {
        chargerProduits();
        chargerCategories();
    }, []);

    const chargerProduits = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/produits");
            const data = await res.json();
            setProduits(data);
        } catch (err) {
            message.error("Erreur lors du chargement des produits.");
        }
    };

    const chargerCategories = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/categories");
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            message.error("Erreur lors du chargement des catégories.");
        }
    };

    const handleAjoutProduit = async (values: any) => {
        const formData = new FormData();

        Object.entries(values).forEach(([key, val]) => {
            if (key === "image" && Array.isArray(val) && val.length > 0) {
                const fileObj = val[0].originFileObj;
                if (fileObj) {
                    formData.append(key, fileObj);
                } else {
                    message.error("Aucune image sélectionnée.");
                    return;
                }
            } else {
                formData.append(key, String(val));
            }
        });

        try {
            const response = await fetch("http://localhost:5000/api/produits", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                message.success("Produit ajouté !");
                setIsAddModalVisible(false);
                formAjout.resetFields();
                chargerProduits();
            } else {
                message.error("Erreur lors de l'ajout.");
            }
        } catch (error) {
            message.error("Erreur réseau.");
        }
    };

    const modifierProduit = (produit: Produit) => {
        setProduitToEdit(produit);
        form.setFieldsValue(produit);
        setIsModalVisible(true);
        const fichierImage = produit.image
            ? [{
                uid: '-1',
                name: produit.image,
                status: 'done',
                url: `http://localhost:5000/uploads/${produit.image}`,
            }]
            : [];

        form.setFieldsValue({
            ...produit,
            image: fichierImage,
        });

    };

    const handleOk = async () => {
        if (!produitToEdit) return;
        try {
            const values = await form.validateFields();
            await fetch(`http://localhost:5000/api/produits/${produitToEdit.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            message.success("Produit modifié avec succès.");
            chargerProduits();
            setIsModalVisible(false);
        } catch (err) {
            message.error("Erreur lors de la modification.");
        }
    };

    const supprimerProduit = async (id: number) => {
        try {
            await fetch(`http://localhost:5000/api/produits/${id}`, {
                method: "DELETE",
            });
            message.success("Produit supprimé.");
            chargerProduits();
        } catch (err) {
            message.error("Erreur lors de la suppression.");
        }
    };

    const colonnes = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Désignation", dataIndex: "designation", key: "designation" },
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (image: string | undefined) =>
                image ? (
                    <img
                        src={`http://localhost:5000/uploads/${image}`}
                        alt="Produit"
                        style={{ width: 40, height: 40 }}
                    />
                ) : (
                    <div style={{ border: "1px solid #ccc", width: 40, height: 40 }} />
                ),
        },
        {
            title: "TVA",
            dataIndex: "tva",
            key: "tva",
            render: (val: number) => `${val} %`,
        },
        {
            title: "Prix TTC",
            dataIndex: "prixttc",
            key: "prixttc",
            render: (prix: any) => parseFloat(prix).toFixed(2),
        },
        {
            title: "Couleur",
            dataIndex: "couleur",
            key: "couleur",
            render: (couleur: string) => (
                <div
                    style={{
                        backgroundColor: couleur,
                        width: 40,
                        height: 20,
                        border: "1px solid #ccc",
                    }}
                />
            ),
        },
        { title: "Catégorie", dataIndex: "category", key: "category" },
        { title: "Pts Fidélité", dataIndex: "pointsfid", key: "pointsfid" },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Produit) => (
                <Space>
                    <Tooltip title="Modifier">
                        <Button
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => modifierProduit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <Button
                            shape="circle"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => supprimerProduit(record.id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div
                style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}
            >
                <h2>Liste des articles</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsAddModalVisible(true)}
                >
                    Ajouter un article
                </Button>
            </div>

            <Table
                columns={colonnes}
                dataSource={produits}
                rowKey={(record) => record.id.toString()}
                bordered
            />

            {/* MODAL MODIFICATION */}
            <Modal
                title="Modifier un produit"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical" onFinish={handleOk}>
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
                    <Form.Item name="pointsfid" label="Points Fidélité">
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="category" label="Catégorie" rules={[{ required: true }]}>
                        <Select placeholder="Choisir une catégorie">
                            {categories.map((cat) => (
                                <Option key={cat.id} value={cat.designation}>
                                    {cat.designation}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="image" label="Image" valuePropName="fileList" getValueFromEvent={e => e.fileList}>
                        <Upload beforeUpload={() => false} maxCount={1}>
                            <Button icon={<UploadOutlined />}>Choisir une nouvelle image</Button>
                        </Upload>
                    </Form.Item>
                </Form>


            </Modal>

            {/* MODAL AJOUT */}
            <Modal
                title="Ajouter un produit"
                open={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                footer={null}
            >
                <Form form={formAjout} layout="vertical" onFinish={handleAjoutProduit}>
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
                    <Form.Item name="pointsfid" label="Points Fidélité">
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="category" label="Catégorie" rules={[{ required: true }]}>
                        <Select placeholder="Choisir une catégorie">
                            {categories.map((cat) => (
                                <Option key={cat.id} value={cat.designation}>
                                    {cat.designation}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="image"
                        label="Image"
                        valuePropName="fileList"
                        getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}
                    >
                        <Upload
                            listType="picture"
                            beforeUpload={() => false}
                            maxCount={1}
                            defaultFileList={[]}
                        >
                            <Button icon={<UploadOutlined />}>Choisir une image</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Ajouter
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default Articles;
