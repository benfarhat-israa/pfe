import React from "react";
import { Input, Button, Form } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const AuthPage: React.FC = () => {
  const onFinish = (values: any) => {
    console.log("Success:", values);
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
          <Link to="/home">
            <Button type="primary" htmlType="submit" className="w-100" >
              Connexion
            </Button>
            </Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AuthPage;
