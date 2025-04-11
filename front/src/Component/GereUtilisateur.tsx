import React, { useState, useEffect } from "react";
import { Table, Button, Form, Input, message, Popconfirm } from "antd";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

// Structure des utilisateurs
interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  role: string;
}

const UsersPage: React.FC = () => {
  const [form] = Form.useForm();
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      message.warning("Accès réservé à l'administrateur");
      navigate("/home");
    }
  }, [navigate]);

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const fetchUtilisateurs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/utilisateurs");
      const data = await response.json();

      if (Array.isArray(data)) {
        setUtilisateurs(data.filter((user) => user.role === "user"));
      } else {
        message.error("Format de données invalide reçu du serveur");
      }
    } catch (error) {
      message.error("Erreur lors de la récupération des utilisateurs");
    }
  };

  const onFinish = async (values: { nom: string; email: string; password: string }) => {
    try {
      if (isEditing && editingUserId !== null) {
        // 🔁 Mise à jour d’un utilisateur existant
        const response = await fetch(`http://localhost:5000/api/utilisateurs/${editingUserId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, role: "user" }),
        });

        if (!response.ok) throw new Error();

        message.success("Utilisateur mis à jour !");
        setIsEditing(false);
        setEditingUserId(null);
      } else {
        // ➕ Ajout d’un nouvel utilisateur
        const userToAdd = { ...values, role: "user" };
        const response = await fetch("http://localhost:5000/api/utilisateurs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userToAdd),
        });

        if (!response.ok) throw new Error();

        message.success("Utilisateur ajouté !");
      }

      form.resetFields();
      fetchUtilisateurs();
    } catch (error) {
      message.error("Erreur lors de l’enregistrement de l’utilisateur");
    }
  };

  const modifierUtilisateur = (user: Utilisateur) => {
    form.setFieldsValue({
      nom: user.nom,
      email: user.email,
      password: "", // Mot de passe vide, il faudra le resaisir
    });
    setIsEditing(true);
    setEditingUserId(user.id);
  };

  const annulerModification = () => {
    setIsEditing(false);
    setEditingUserId(null);
    form.resetFields();
  };

  const supprimerUtilisateur = async (id: number) => {
    try {
      await fetch(`http://localhost:5000/api/utilisateurs/${id}`, {
        method: "DELETE",
      });
      setUtilisateurs(utilisateurs.filter((user) => user.id !== id));
      message.success("Utilisateur supprimé !");
    } catch (error) {
      message.error("Erreur lors de la suppression de l'utilisateur");
    }
  };

  const columns = [
    {
      title: "Nom",
      dataIndex: "nom",
      key: "nom",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Utilisateur) => (
        <>
          <Button
            onClick={() => modifierUtilisateur(record)}
            style={{ marginRight: 8 }}
            icon={<EditOutlined />}
            type="primary"
            shape="circle"
          />
          <Popconfirm
            title="Supprimer ce client ?"
            onConfirm={() => supprimerUtilisateur(record.id)}
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
      <h2 className="text-center mb-4">Gestion des utilisateurs</h2>

      <div className="shadow p-4 mb-4 bg-white rounded">
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item
            label="Nom"
            name="nom"
            rules={[{ required: true, message: "Veuillez entrer un nom" }]}
          >
            <Input placeholder="Nom de l'utilisateur" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Veuillez entrer un email" },
              { type: "email", message: "Email invalide" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Mot de passe"
            name="password"
            rules={[{ required: true, message: "Veuillez entrer un mot de passe" }]}
          >
            <Input.Password placeholder="Mot de passe" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="me-2">
              {isEditing ? "Mettre à jour" : "Ajouter un utilisateur"}
            </Button>
            {isEditing && (
              <Button onClick={annulerModification} danger>
                Annuler
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>

      <div className="shadow p-4 bg-white rounded">
        <Table
          dataSource={utilisateurs}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
};

export default UsersPage;
