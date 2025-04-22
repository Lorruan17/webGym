"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, Typography, Select } from "antd";
import styles from "./register.module.css";

interface Academia {
  id: number;
  nome: string;
  valor: string;
}

export default function RegisterUser() {
  const { Title, Text } = Typography;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [academies, setAcademies] = useState<Academia[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAcademies = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/academia`);
        if (res.ok) {
          const data: Academia[] = await res.json();
          setAcademies(data);
        } else {
          console.error("Erro ao buscar academias:", res.status);
          alert("Erro ao carregar as academias.");
        }
      } catch (error) {
        console.error("Erro ao buscar academias:", error);
        alert("Erro de conexão ao buscar as academias.");
      }
    };

    fetchAcademies();
  }, []);

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
          parceira: values.parceira,
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

          {/* Campo parceira (Academia) */}
          <Form.Item name="parceira" label="Academia" rules={[{ required: true, message: "Selecione uma academia!" }]}>
            <Select placeholder="Selecione uma academia">
              {academies.map((academia) => (
                <Select.Option key={academia.id} value={academia.valor}>
                  {academia.nome}
                </Select.Option>
              ))}
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