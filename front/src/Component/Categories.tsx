import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, Form, Input, Upload, Space, Tooltip } from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

// Définition du type Category
interface Category {
    id: string;
    designation: string;
    couleur: string;
    image: string | File;  // Modifie cette ligne pour accepter les deux types
}


function CategoriesList() {
    const [categories, setCategories] = useState<Category[]>([]); // Type des catégories
    const [searchText, setSearchText] = useState(""); // Etat pour la recherche
    const [modalVisible, setModalVisible] = useState(false); // Ajout
    const [modalEditVisible, setModalEditVisible] = useState(false); // Modification
    const [formCategory, setFormCategory] = useState({
        designation: "",
        couleur: "#000000",
        image: null as File | null,
    });
    const [formCategoryEdit, setFormCategoryEdit] = useState<Category | null>(null); // Objet catégorie à modifier

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/categories");
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            message.error("Erreur lors de la récupération des catégories.");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Erreur lors de la suppression de la catégorie.");
            message.success("Catégorie supprimée avec succès.");
            fetchCategories();
        } catch (error: any) {
            message.error(error.message || "Erreur inconnue.");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormCategory({ ...formCategory, [name]: value });
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormCategoryEdit({ ...formCategoryEdit!, [name]: value });
    };

    const handleImageChange = (file: File) => {
        setFormCategory({ ...formCategory, image: file });
        return false;
    };

    const handleEditImageChange = (file: File) => {
        setFormCategoryEdit({ ...formCategoryEdit!, image: file });
        return false;
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("designation", formCategory.designation);
            formData.append("couleur", formCategory.couleur);
            if (formCategory.image) {
                formData.append("image", formCategory.image);
            }

            const response = await fetch("http://localhost:5000/api/categories", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Erreur lors de l'ajout de la catégorie.");
            message.success("Catégorie ajoutée !");
            setModalVisible(false);
            setFormCategory({ designation: "", couleur: "#000000", image: null });
            fetchCategories();
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const handleEditSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("designation", formCategoryEdit!.designation);
            formData.append("couleur", formCategoryEdit!.couleur);
            if (formCategoryEdit!.image instanceof File) {
                formData.append("image", formCategoryEdit!.image);
            }

            const response = await fetch(`http://localhost:5000/api/categories/${formCategoryEdit!.id}`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) throw new Error("Erreur lors de la modification.");
            message.success("Catégorie modifiée !");
            setModalEditVisible(false);
            setFormCategoryEdit(null);
            fetchCategories();
        } catch (error: any) {
            message.error(error.message);
        }
    };

    // Fonction de filtrage sur la colonne "Désignation"
    const filteredCategories = categories.filter((category) =>
        category.designation.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (image: string) =>
                image ? (
                    <img
                        src={`http://localhost:5000/uploads/${image}`} // adapte selon ton chemin
                        alt="Catégorie"
                        style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
                    />
                ) : (
                    "Aucune"
                ),
        },
        {
            title: "Désignation",
            dataIndex: "designation",
            key: "designation",
        },
        {
            title: "Couleur",
            dataIndex: "couleur",
            key: "couleur",
            render: (text: string) => (
                <div style={{ backgroundColor: text, width: 30, height: 30, borderRadius: 4 }}></div>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (text: string, record: Category) => (
                <Space>
                    <Tooltip title="Modifier">
                        <Button
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setFormCategoryEdit(record);
                                setModalEditVisible(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <Button
                            shape="circle"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record.id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: "flex", gap: "1rem", marginBottom: 16 }}>
            <Input
                    placeholder="Rechercher par désignation"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 200 }}
                />
            </div>
            <div
                style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}
            >
                <h2>Liste des catégories</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setModalVisible(true)}
                >
                    Ajouter une catégorie
                </Button>
            </div>

            <Table dataSource={filteredCategories} columns={columns} rowKey="id" />

            {/* Modal d'ajout */}
            <Modal
                title="Ajouter une catégorie"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical" onFinish={handleSubmit}>
                    <Form.Item label="Désignation" required>
                        <Input name="designation" value={formCategory.designation} onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="Couleur">
                        <Input type="color" name="couleur" value={formCategory.couleur} onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="Image">
                        <Upload beforeUpload={handleImageChange} showUploadList={false}>
                            <Button icon={<UploadOutlined />}>Choisir une image</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Ajouter
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal de modification */}
            {formCategoryEdit && (
                <Modal
                    title="Modifier la catégorie"
                    open={modalEditVisible}
                    onCancel={() => setModalEditVisible(false)}
                    footer={null}
                >
                    <Form layout="vertical" onFinish={handleEditSubmit}>
                        <Form.Item label="Désignation" required>
                            <Input name="designation" value={formCategoryEdit.designation} onChange={handleEditChange} />
                        </Form.Item>
                        <Form.Item label="Couleur">
                            <Input type="color" name="couleur" value={formCategoryEdit.couleur} onChange={handleEditChange} />
                        </Form.Item>
                        <Form.Item label="Image">
                            {/* Aperçu de l'image existante */}
                            {typeof formCategoryEdit.image === "string" && (
                                <img
                                    src={`http://localhost:5000/uploads/${formCategoryEdit.image}`}
                                    alt="Aperçu"
                                    style={{ width: 100, height: 100, objectFit: "cover", marginBottom: 8, borderRadius: 4 }}
                                />
                            )}

                            {/* Champ pour changer l'image */}
                            <Upload beforeUpload={handleEditImageChange} showUploadList={false}>
                                <Button icon={<UploadOutlined />}>Changer l'image</Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Modifier
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            )}
        </div>
    );
};

export default CategoriesList;
