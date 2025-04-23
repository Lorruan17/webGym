"use client";
import { useEffect, useState } from "react";
import styles from "./dieta.module.css";
import BottomBar from "../components/botom/BottomBar";
import { Typography, Button, message } from "antd";
import {
  CoffeeOutlined,
  AppleOutlined,
  MoonOutlined,
  ClockCircleOutlined,
  BoxPlotOutlined,
  ForkOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import api from "@/app/utils/axiosInstance";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDietaFromStorage();
    fetchDietaFromServer();
  }, []);

  const loadDietaFromStorage = () => {
    const storedDieta = localStorage.getItem("dieta");
    if (storedDieta) {
      try {
        setUserData(JSON.parse(storedDieta));
      } catch (error) {
        console.error("Erro ao parsear dieta do localStorage:", error);
      }
    }
  };

  const saveDietaToStorage = (data: UserData) => {
    localStorage.setItem("dieta", JSON.stringify(data));
  };

  // Usando axiosInstance para buscar dieta do servidor
  const fetchDietaFromServer = async () => {
    setLoading(true);
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    const token = parsedUser.token;
    const { id } = parsedUser;

    if (!token || !id) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(response.data);
      saveDietaToStorage(response.data);
    } catch (err) {
      console.error("Erro ao buscar dados do usuário:", err);
      message.error("Não foi possível carregar a dieta.");
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (titulo: string) => {
    switch (titulo) {
      case "Café da Manhã":
        return <CoffeeOutlined className={styles.refeicaoIcon} />;
      case "Almoço":
        return <ForkOutlined className={styles.refeicaoIcon} />;
      case "Lanche da Tarde":
        return <AppleOutlined className={styles.refeicaoIcon} />;
      case "Jantar":
        return <BoxPlotOutlined className={styles.refeicaoIcon} />;
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={2} className={styles.pageTitle}>Minha Dieta</Title>
        <Button onClick={fetchDietaFromServer} loading={loading} icon={<SyncOutlined />} size="small" className={styles.btnn}>
          Atualizar
        </Button>
      </div>
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
