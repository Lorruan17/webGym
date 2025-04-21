"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, Typography, Select } from "antd";
import styles from "./register.module.css";

interface Academia {
  id: number;
  nome: string;
  valor: number; // Assuming your Academia interface has a 'valor' property
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
        const res = await fetch("http://192.168.1.6:3000/academia");
        if (res.ok) {
          const data = await res.json();
          setAcademies(data);
        } else {
          const errorData = await res.json();
          alert(errorData.message || "Erro ao carregar academias.");
        }
      } catch (error) {
        console.error("Erro ao buscar academias:", error);
        alert("Erro de conexão ao buscar academias.");
      }
    };

    fetchAcademies();
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);

    // Find the selected academy object based on its ID
    const selectedAcademia = academies.find((academia) => academia.id === values.parceira);

    let academiaValorToSend: number | undefined;
    if (selectedAcademia) {
      academiaValorToSend = selectedAcademia.valor;
    } else {
      alert("Academia selecionada inválida.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://192.168.1.6:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.name,
          email: values.email,
          password: values.password,
          parceira: academiaValorToSend, // Send the 'valor' instead of the ID
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

          {/* Campo parceira (agora buscando da API) */}
          <Form.Item name="parceira" label="Academia" rules={[{ required: true, message: "Selecione uma academia!" }]}>
            <Select placeholder="Selecione uma academia">
              {academies.map((academia) => (
                <Select.Option key={academia.id} value={academia.id}> 
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