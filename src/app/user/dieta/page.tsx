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

type DietaData = {
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

type UserData = {
  id?: number;
  token?: string;
  // Outras propriedades do usuário podem estar aqui...
  dieta?: DietaData;
};

export default function DietaPage() {
  const [userData, setUserData] = useState<UserData>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDietaFromUserStorage();
    fetchDietaFromServer();
  }, []);

  const loadDietaFromUserStorage = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser: UserData = JSON.parse(storedUser);
        setUserData(parsedUser);
      } catch (error) {
        console.error("Erro ao parsear usuário do localStorage:", error);
      }
    }
  };

  const saveDietaToUserStorage = (dietaData: DietaData) => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser: UserData = JSON.parse(storedUser);
        const updatedUser = { ...parsedUser, dieta: dietaData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUserData(updatedUser); // Atualiza o estado local também
      } catch (error) {
        console.error("Erro ao atualizar dieta no localStorage:", error);
      }
    } else {
      // Se não houver usuário no storage, criamos um novo com a dieta
      localStorage.setItem("user", JSON.stringify({ dieta: dietaData }));
      setUserData({ dieta: dietaData });
    }
  };

  const fetchDietaFromServer = async () => {
    setLoading(true);
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setLoading(false);
      return;
    }

    const parsedUser: UserData = JSON.parse(storedUser);
    const { token, id } = parsedUser;

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

      // Assumindo que a API retorna todos os dados do usuário, incluindo a dieta
      const {
        horario_cafe_da_manha,
        horario_almoco,
        horario_lanche_da_tarde,
        horario_jantar,
        horario_ceia,
        horario_alternativo,
        cafe_da_manha,
        almoco,
        lanche_da_tarde,
        jantar,
        ceia,
        alternativo,
        ...otherUserData // Captura outras propriedades do usuário
      } = response.data;

      const dietaData: DietaData = {
        horario_cafe_da_manha,
        horario_almoco,
        horario_lanche_da_tarde,
        horario_jantar,
        horario_ceia,
        horario_alternativo,
        cafe_da_manha,
        almoco,
        lanche_da_tarde,
        jantar,
        ceia,
        alternativo,
      };

      // Salva apenas os dados da dieta dentro da estrutura do usuário no localStorage
      saveDietaToUserStorage(dietaData);
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
      {renderRefeicao("Café da Manhã", userData.dieta?.horario_cafe_da_manha, userData.dieta?.cafe_da_manha)}
      {renderRefeicao("Almoço", userData.dieta?.horario_almoco, userData.dieta?.almoco)}
      {renderRefeicao("Lanche da Tarde", userData.dieta?.horario_lanche_da_tarde, userData.dieta?.lanche_da_tarde)}
      {renderRefeicao("Jantar", userData.dieta?.horario_jantar, userData.dieta?.jantar)}
      {renderRefeicao("Ceia", userData.dieta?.horario_ceia, userData.dieta?.ceia)}
      {renderRefeicao("Refeição Alternativa", userData.dieta?.horario_alternativo, userData.dieta?.alternativo)}
      <BottomBar />
    </div>
  );
}