"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Layout, Card, Typography, Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined, BugOutlined, BulbOutlined } from "@ant-design/icons";
import MainLayout from "../sidebar/layout";
import styles from "./config.module.css"; // Importe o arquivo de estilos

const { Title } = Typography;
const { Item } = Form;

interface User {
  id: string;
  email: string;
  name: string;
  // Adicione outras propriedades do usuário conforme necessário
}

interface SettingsForm {
  currentPassword?: string;
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  suggestion?: string;
  report?: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [form] = Form.useForm<SettingsForm>();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
      form.setFieldsValue({ email: parsedUser?.email, name: parsedUser?.name }); // Preenche email e nome iniciais
    } else {
      router.push("/login");
    }
  }, [router, form]);

  const onFinishEditAccount = (values: SettingsForm) => {
    // Aqui você faria a chamada à API para atualizar os dados da conta
    console.log("Dados da conta para atualizar:", values);

    if (!values.currentPassword) {
      message.error("Por favor, insira sua senha atual para salvar as alterações.");
      return;
    }

    if (values.password && values.password !== values.confirmPassword) {
      message.error("As novas senhas não coincidem!");
      return;
    }

    // Envie 'values' (incluindo currentPassword) para a sua API de atualização de conta
    message.success("Dados da conta atualizados com sucesso!");
    form.resetFields(['currentPassword', 'password', 'confirmPassword']); // Limpa os campos de senha após o sucesso
    // Opcional: Atualizar o localStorage com os novos dados do usuário
  };

  const onFinishSuggestion = (values: SettingsForm) => {
    // Aqui você faria a chamada à API para enviar a sugestão
    console.log("Sugestão enviada:", values.suggestion);
    message.success("Sua sugestão foi enviada. Obrigado!");
    form.resetFields(['suggestion']); // Limpa o campo de sugestão
  };

  const onFinishReport = (values: SettingsForm) => {
    // Aqui você faria a chamada à API para reportar o erro
    console.log("Relatório de erro enviado:", values.report);
    message.success("Seu relatório de erro foi enviado. Investigaremos em breve!");
    form.resetFields(['report']); // Limpa o campo de relatório
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <Title level={2} className={styles.title}>
          Configurações
        </Title>

        <Card title="Editar Conta" className={styles.card}>
          <Form layout="vertical" form={form} name="editAccount" onFinish={onFinishEditAccount}>
            <Item
              label="Nome"
              name="name"
              rules={[{ required: true, message: 'Por favor, insira seu nome!' }]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Seu nome" />
            </Item>
            <Item
              label="Email"
              name="email"
              rules={[{ required: true, type: 'email', message: 'Por favor, insira seu email!' }]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Seu email" />
            </Item>
            <Item
              label="Senha Atual"
              name="currentPassword"
              rules={[{ required: true, message: 'Por favor, insira sua senha atual!' }]}
            >
              <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Sua senha atual" />
            </Item>
            <Item
              label="Nova Senha"
              name="password"
              rules={[
                { min: 6, message: 'A senha deve ter pelo menos 6 caracteres!' },
              ]}
            >
              <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Nova senha (opcional)" />
            </Item>
            <Item
              label="Confirmar Nova Senha"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('As novas senhas não coincidem!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Confirmar nova senha (opcional)" />
            </Item>
            <Item>
              <Button type="primary" htmlType="submit" className={styles.buttonPrimary}>
                Salvar Alterações
              </Button>
            </Item>
          </Form>
        </Card>

        <Card title="Enviar Sugestão" className={styles.card}>
          <Form layout="vertical" name="sendSuggestion" onFinish={onFinishSuggestion}>
            <Item
              label="Sua Sugestão"
              name="suggestion"
              rules={[{ required: true, message: 'Por favor, insira sua sugestão!' }]}
            >
              <Input.TextArea rows={4} placeholder="Compartilhe sua ideia para melhorar o sistema" />
            </Item>
            <Item>
              <Button type="primary" htmlType="submit" icon={<BulbOutlined />} className={styles.buttonPrimary}>
                Enviar Sugestão
              </Button>
            </Item>
          </Form>
        </Card>

        <Card title="Reportar um Erro" className={styles.card}>
          <Form layout="vertical" name="reportError" onFinish={onFinishReport}>
            <Item
              label="Descreva o Erro"
              name="report"
              rules={[{ required: true, message: 'Por favor, descreva o erro que você encontrou!' }]}
            >
              <Input.TextArea rows={4} placeholder="Descreva detalhadamente o erro, como aconteceu e o que você estava fazendo" />
            </Item>
            <Item>
              <Button  htmlType="submit" icon={<BugOutlined />} className={styles.buttonDanger}>
                Reportar Erro
              </Button>
            </Item>
          </Form>
        </Card>
      </div>
    </MainLayout>
  );
}