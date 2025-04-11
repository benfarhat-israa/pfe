import React, { useState } from "react";
import { Input, Button, Form, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const AuthPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
  
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        message.success(data.message);
        localStorage.setItem("role", data.role); // ✅ Sauvegarde du rôle
  
        // ✅ Redirection selon le rôle
        if (data.role === "admin") {
          navigate("/home");
        } else {
          navigate("/home");
        }
      } else {
        message.error(data.message);
      }
    } catch (error) {
      message.error("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="p-4 shadow rounded bg-white" style={{ width: 350 }}>
        <h2 className="text-center mb-4">Connexion</h2>
        <Form
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Veuillez entrer votre nom d'utilisateur!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nom d'utilisateur" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Veuillez entrer votre mot de passe!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mot de passe" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-100" 
              loading={loading}
            >
              Connexion
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AuthPage;
