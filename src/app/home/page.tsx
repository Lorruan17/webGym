"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Layout, Card, Statistic, Typography, Divider } from "antd";
import { UsergroupAddOutlined } from "@ant-design/icons";
import styles from "./home.module.css";
import MainLayout from "../sidebar/layout";

const { Title, Paragraph, Text } = Typography;

const cardStyle: React.CSSProperties = {
  borderRadius: 10,
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  marginBottom: 32, // Aumentei a margem inferior para separar mais
};

const statisticStyle: React.CSSProperties = {
  fontWeight: 600, // Deixei a fonte mais forte
  fontSize: '1.5em', // Aumentei um pouco o tamanho
  marginBottom: 8,
};

const iconStyle: React.CSSProperties = {
  fontSize: 40, // Aumentei o tamanho do ícone
  color: '#1890ff',
  marginRight: 16,
};

const presentationStyle: React.CSSProperties = {
  padding: '24px',
  background: '#f7f7f7', // Adicionei um background sutil
  borderRadius: 8,
};

const featureItemStyle: React.CSSProperties = {
  marginBottom: 16,
};

interface User {
  id: string;
  email: string;
  // ... outras propriedades
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [totalAlunos, setTotalAlunos] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/login");
    }

    // Simulação de chamada de API
    fetchTotalAlunos();
  }, [router]);

  const fetchTotalAlunos = () => {
    setTotalAlunos(350); // Exemplo
  };

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        <Title level={2} style={{ marginBottom: 32 }}>
          Painel de Administração
        </Title>

        <Card
          style={{
            borderRadius: 12,
            boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
            marginBottom: 32,
            border: '1px solid #d9d9d9',
          }}
        >
          <Statistic
            title={<Text style={{ fontSize: '1.2em', color: 'rgba(0, 0, 0, 0.85)' }}>Total de Alunos</Text>}
            value={totalAlunos}
            prefix={<UsergroupAddOutlined style={{ ...iconStyle, color: 'blue' }} />}
            valueStyle={{ ...statisticStyle, color: 'blue' }}
          />
        </Card>

        <div style={presentationStyle}>
          <Title level={4} style={{ marginBottom: 0 }}>Bem-vindo ao</Title>
          <Title level={2} style={{ marginTop: 0, marginBottom: 24 }}>[Nome do Seu SaaS]</Title>
          <Title level={3} style={{ marginBottom: 24 }}>Sua Plataforma Completa</Title>
          <Paragraph style={{ fontSize: '1.1em', lineHeight: '1.7' }}>
            Descubra uma nova maneira de gerenciar sua academia e engajar seus alunos.
            <Text strong>[Nome do Seu SaaS]</Text> oferece as ferramentas que você precisa para otimizar suas operações e proporcionar uma experiência excepcional aos seus membros.
          </Paragraph>

          <Divider />

          <Title level={4}>Recursos em Disponíveis:</Title>
          <div style={{ marginTop: 16 }}>

            <div style={featureItemStyle}>
              <Text strong style={{ fontSize: '1.1em' }}>Treinos Personalizadas (PWA para Alunos):</Text>
              <Paragraph>Crie e acompanhe planos de treino aos alunos via um aplicativo web progressivo moderno.</Paragraph>
            </div>
            <div style={featureItemStyle}>
              <Text strong style={{ fontSize: '1.1em' }}>Campo de Dietas (PWA para Alunos):</Text>
              <Paragraph>Adicione Dietas no sistema e logo em seguida já fica disponível para o aluno</Paragraph>
            </div>
          </div>

          <Divider />

          <Paragraph style={{ fontSize: '1.1em', lineHeight: '1.7' }}>
            Explore o menu ao lado para começar a transformar a gestão da sua academia. Se precisar de ajuda, nossa equipe está pronta para você!
          </Paragraph>
        </div>
      </div>
    </MainLayout>
  );
}