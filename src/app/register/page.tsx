"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, Typography, Select } from "antd";
import styles from "./register.module.css";

export default function RegisterUser() {
  const { Title, Text } = Typography;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.name,
          email: values.email,
          password: values.password,
          parceira: values.parceira, // <-- novo campo aqui
        }),
      });

      if (res.ok) {
        router.back();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Erro ao criar usuário.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 30 }}>
          Crie sua conta
        </Title>

        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item name="name" label="Nome" rules={[{ required: true, message: "Digite seu nome!" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="E-mail" rules={[{ required: true, type: "email", message: "Digite um e-mail válido!" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="password" label="Senha" rules={[{ required: true, message: "Digite uma senha!" }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirmar Senha"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Confirme sua senha!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("As senhas não coincidem!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          {/* Campo parceira */}
          <Form.Item name="parceira" label="Academia" rules={[{ required: true, message: "Selecione uma academia!" }]}>
            <Select placeholder="Selecione uma academia">
              <Select.Option value={1}>Academia Alpha</Select.Option>
              <Select.Option value={2}>Academia Beta</Select.Option>
              <Select.Option value={3}>Academia StrongFit</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block className={styles.btn}>
              Cadastrar
            </Button>
          </Form.Item>
        </Form>

        <div className={styles.col}>
          <Text>Já tem uma conta?</Text>
          <Button className={styles.btn} onClick={handleBack}>
            <Text className={styles.textBtn}>Fazer login</Text>
          </Button>
        </div>
      </Card>
    </div>
  );
}
