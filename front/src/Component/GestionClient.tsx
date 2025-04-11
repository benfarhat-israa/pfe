import React, { useState, useEffect } from "react";
import { Table, Button, Form, Input, message, Popconfirm, Modal } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

// Définir l'interface Client
interface Client {
    id: number;
    nom: string;
    prenom: string;
    telephone: string;
    adresse: string;
    pointsFidelite: number;
}

const ClientsPage: React.FC = () => {
    const [form] = Form.useForm();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    // Récupérer les clients depuis l'API
    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/clients");
            const data = await response.json();
            setClients(data);
        } catch (error) {
            message.error("Erreur de récupération des clients");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    // Ajouter ou modifier un client
    const onFinish = async (values: Client) => {
        try {
            setLoading(true);
            let response;
            if (editingClient) {
                // Modification d'un client
                response = await fetch(`http://localhost:5000/api/clients/${editingClient.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                });
                message.success("Client modifié !");
            } else {
                // Ajout d'un nouveau client
                response = await fetch("http://localhost:5000/api/clients", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                });
                message.success("Client ajouté !");
            }
            const newClient = await response.json();
            setClients((prevClients) =>
                editingClient
                    ? prevClients.map((client) =>
                        client.id === newClient.id ? newClient : client
                    )
                    : [...prevClients, newClient]
            );
            setIsModalVisible(false);
            form.resetFields();
        } catch {
            message.error("Erreur lors de l'ajout/modification");
        } finally {
            setLoading(false);
        }
    };

    // Supprimer un client
    const supprimerClient = async (id: number) => {
        try {
            await fetch(`http://localhost:5000/api/clients/${id}`, {
                method: "DELETE",
            });
            setClients(clients.filter((client) => client.id !== id));
            message.success("Client supprimé !");
        } catch {
            message.error("Erreur lors de la suppression");
        }
    };

    // Modifier un client
    const modifierClient = (client: Client) => {
        setEditingClient(client);
        form.setFieldsValue(client);
        setIsModalVisible(true);
    };

    const columns = [
        {
            title: "Nom",
            dataIndex: "nom",
            key: "nom",
        },
        {
            title: "Prénom",
            dataIndex: "prenom",
            key: "prenom",
        },
        {
            title: "Téléphone",
            dataIndex: "telephone",
            key: "telephone",
        },
        {
            title: "Adresse",
            dataIndex: "adresse",
            key: "adresse",
        },
        {
            title: "Points de fidélité",
            dataIndex: "pointsFidelite",
            key: "pointsFidelite",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Client) => (
                <>
                    <Button
                        onClick={() => modifierClient(record)}
                        style={{ marginRight: 8 }}
                        icon={<EditOutlined />}
                        type="primary"
                        shape="circle"
                    />
                    <Popconfirm
                        title="Supprimer ce client ?"
                        onConfirm={() => supprimerClient(record.id)}
                        okText="Oui"
                        cancelText="Non"
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            type="primary"
                            shape="circle"
                        />
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Gestion des clients</h2>

            <div className="shadow p-4 mb-4 bg-white rounded">
                <Button type="primary" onClick={() => setIsModalVisible(true)}>
                    Ajouter un client
                </Button>
            </div>

            <div className="shadow p-4 bg-white rounded">
                <Table dataSource={clients} columns={columns} rowKey="id" pagination={{ pageSize: 5 }} />
            </div>

            <Modal
                title={editingClient ? "Modifier le client" : "Ajouter un client"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical" onFinish={onFinish} form={form}>
                    <Form.Item label="Nom" name="nom" rules={[{ required: true, message: "Veuillez entrer le nom" }]}>
                        <Input placeholder="Nom du client" />
                    </Form.Item>

                    <Form.Item label="Prénom" name="prenom" rules={[{ required: true, message: "Veuillez entrer le prénom" }]}>
                        <Input placeholder="Prénom du client" />
                    </Form.Item>

                    <Form.Item label="Téléphone" name="telephone" rules={[{ required: true, message: "Veuillez entrer le téléphone" }]}>
                        <Input placeholder="Téléphone du client" />
                    </Form.Item>

                    <Form.Item label="Adresse" name="adresse" rules={[{ required: true, message: "Veuillez entrer l'adresse" }]}>
                        <Input placeholder="Adresse du client" />
                    </Form.Item>

                    <Form.Item label="Points de fidélité" name="pointsFidelite" rules={[{ required: true, message: "Veuillez entrer les points de fidélité" }]}>
                        <Input placeholder="Points de fidélité" type="number" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {editingClient ? "Modifier le client" : "Ajouter le client"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ClientsPage;
