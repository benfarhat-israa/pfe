import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  message,
  Popconfirm,
  Modal,
} from "antd";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

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
  const [modalVisible, setModalVisible] = useState(false);
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

  const onFinish = async (values: {
    nom: string;
    email: string;
    password: string;
  }) => {
    try {
      if (isEditing && editingUserId !== null) {
        const response = await fetch(
          `http://localhost:5000/api/utilisateurs/${editingUserId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...values, role: "user" }),
          }
        );

        if (!response.ok) throw new Error();

        message.success("Utilisateur mis à jour !");
      } else {
        const response = await fetch("http://localhost:5000/api/utilisateurs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, role: "user" }),
        });

        if (!response.ok) throw new Error();

        message.success("Utilisateur ajouté !");
      }

      form.resetFields();
      fetchUtilisateurs();
      setIsEditing(false);
      setEditingUserId(null);
      setModalVisible(false);
    } catch (error) {
      message.error("Erreur lors de l’enregistrement de l’utilisateur");
    }
  };

  const modifierUtilisateur = (user: Utilisateur) => {
    form.setFieldsValue({
      nom: user.nom,
      email: user.email,
      password: "",
    });
    setIsEditing(true);
    setEditingUserId(user.id);
    setModalVisible(true);
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
            title="Supprimer cet utilisateur ?"
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

      <div className="text-end mb-3">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setIsEditing(false);
            setEditingUserId(null);
            setModalVisible(true);
          }}
        >
          Ajouter un utilisateur
        </Button>
      </div>

      <Table
        dataSource={utilisateurs}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={isEditing ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setIsEditing(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
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

          <Form.Item className="text-end">
            <Button type="primary" htmlType="submit" className="me-2">
              {isEditing ? "Mettre à jour" : "Ajouter"}
            </Button>
            <Button
              onClick={() => {
                setModalVisible(false);
                setIsEditing(false);
                form.resetFields();
              }}
              danger
            >
              Annuler
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersPage;
