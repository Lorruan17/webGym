"use client";
import { useEffect, useState } from "react";
import styles from "./dieta.module.css";
import BottomBar from "../components/botom/BottomBar";
import { Typography } from "antd";
import {
  CoffeeOutlined,
  AppleOutlined,
  MoonOutlined,
  ClockCircleOutlined,
  ShopOutlined,
  ContainerOutlined,
  FireOutlined,
  BoxPlotOutlined,
  ForkOutlined
} from "@ant-design/icons";


const { Title, Text } = Typography;

type UserData = {
  horario_cafe_da_manha?: string;
  horario_almoco?: string;
  horario_lanche_da_tarde?: string;
  horario_jantar?: string;
  horario_ceia?: string;
  horario_alternativo?: string;
  cafe_da_manha?: string;
  almoco?: string;
  lanche_da_tarde?: string;
  jantar?: string;
  ceia?: string;
  alternativo?: string;
};

export default function DietaPage() {
  const [userData, setUserData] = useState<UserData>({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);
    const token = parsedUser.token;
    const { id } = parsedUser;

    if (!token || !id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro na requisição");
        return res.json();
      })
      .then((data) => {
        setUserData(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar dados do usuário:", err);
      });
  }, []);

  const getIcon = (titulo: string) => {
    switch (titulo) {
      case "Café da Manhã":
        return <CoffeeOutlined className={styles.refeicaoIcon} />;
      case "Almoço":
        return <ForkOutlined className={styles.refeicaoIcon} />; // Usando RestaurantOutlined
      case "Lanche da Tarde":
        return <AppleOutlined className={styles.refeicaoIcon} />;
      case "Jantar":
        return <BoxPlotOutlined className={styles.refeicaoIcon} />; // Usando RestaurantOutlined
      case "Ceia":
        return <MoonOutlined className={styles.refeicaoIcon} />;
      case "Refeição Alternativa":
        return <ClockCircleOutlined className={styles.refeicaoIcon} />;
      default:
        return null;
    }
  };

  const renderRefeicao = (titulo: string, horario?: string, refeicao?: string) => (
    <div key={titulo} className={styles.refeicaoItem}>
      <div className={styles.refeicaoHeader}>
        {getIcon(titulo)}
        <Title level={5} className={styles.refeicaoTitulo}>{titulo}</Title>
      </div>
      <p><Text strong>Horário:</Text> <Text>{horario || <Text type="secondary">Sem horário</Text>}</Text></p>
      <p><Text strong>Alimentos:</Text> <Text>{refeicao || <Text type="secondary">Sem refeição</Text>}</Text></p>
    </div>
  );

  return (
    <div className={styles.container}>
      <Title level={2} className={styles.pageTitle}>Minha Dieta</Title>
      {renderRefeicao("Café da Manhã", userData.horario_cafe_da_manha, userData.cafe_da_manha)}
      {renderRefeicao("Almoço", userData.horario_almoco, userData.almoco)}
      {renderRefeicao("Lanche da Tarde", userData.horario_lanche_da_tarde, userData.lanche_da_tarde)}
      {renderRefeicao("Jantar", userData.horario_jantar, userData.jantar)}
      {renderRefeicao("Ceia", userData.horario_ceia, userData.ceia)}
      {renderRefeicao("Refeição Alternativa", userData.horario_alternativo, userData.alternativo)}
      <BottomBar />
    </div>
  );
}