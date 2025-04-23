"use client";
import { useEffect, useState, useCallback } from "react";
import { Typography, Button } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import BottomBar from "../components/botom/BottomBar";
import styles from "./treino.module.css";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/app/utils/auth";
import api from "@/app/utils/axiosInstance";

interface Exercicio {
  id: number;
  nome: string;
  descricao: string;
}

export default function Treinos() {
  const [alunos, setAlunos] = useState<Exercicio[]>([]);
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);
  const [treinosPorDia, setTreinosPorDia] = useState<Record<string, Exercicio[]>>({});

  const router = useRouter();
  const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

  const alunoId =
    typeof window !== "undefined" && localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") as string).id
      : null;

  const getDiaAtualStr = () => diasSemana[(new Date().getDay() + 6) % 7];
  const diaAtualStr = getDiaAtualStr();

  const mapDia = {
    6: "dom_ex",
    0: "seg_ex",
    1: "ter_ex",
    2: "qua_ex",
    3: "qui_ex",
    4: "sex_ex",
    5: "sáb_ex",
  } as const;

  const salvarTreinosLocalmente = useCallback((treinos: Record<string, Exercicio[]>) => {
    if (alunoId) {
      localStorage.setItem(`treinos-${alunoId}`, JSON.stringify(treinos));
    }
  }, [alunoId]);

  const carregarTreinosLocalmente = useCallback(() => {
    if (alunoId) {
      const treinosSalvos = localStorage.getItem(`treinos-${alunoId}`);
      if (treinosSalvos) {
        try {
          setTreinosPorDia(JSON.parse(treinosSalvos));
          return true;
        } catch (error) {
          console.error("Erro ao parsear treinos do localStorage:", error);
          return false;
        }
      }
    }
    return false;
  }, [alunoId]);

  const fetchDadosDoServidor = useCallback(async () => {
    try {
      if (!alunoId) throw new Error("Aluno não encontrado no localStorage.");
      setLoading(true);

      const token = getAccessToken();
      if (!token) throw new Error("Token não encontrado.");

      // Busca os treinos do usuário
      const treinosResponse = await api.get(`/treino`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const treinosData: Exercicio[] = treinosResponse.data;
      setAlunos(treinosData);

      // Busca os dados do usuário (incluindo a relação dos treinos por dia)
      const usuarioResponse = await api.get(`/users/${alunoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsuario(usuarioResponse.data);
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
    } finally {
      setLoading(false);
    }
  }, [alunoId]);

  useEffect(() => {
    if (!carregarTreinosLocalmente()) {
      fetchDadosDoServidor();
    }
  }, [carregarTreinosLocalmente, fetchDadosDoServidor]);

  useEffect(() => {
    if (usuario && alunos.length > 0) {
      const novoTreinosPorDia: Record<string, Exercicio[]> = {};
      diasSemana.forEach((dia) => {
        const chave = mapDia[diasSemana.indexOf(dia) as keyof typeof mapDia];
        const ids = usuario[chave] || [];
        const idList = Array.isArray(ids)
          ? ids.map((item: any) => (typeof item === "object" ? item.id : item))
          : [];

        novoTreinosPorDia[dia] = alunos.filter((t) => idList.includes(t.id));
      });
      setTreinosPorDia(novoTreinosPorDia);
      salvarTreinosLocalmente(novoTreinosPorDia);
    }
  }, [usuario, alunos, salvarTreinosLocalmente]);

  const { Title, Text } = Typography;

  const verTreino = (id: number) => {
    if (id && router) {
      console.log("Navegando para o treino com ID:", id);
      router.push(`/user/treino/${id}`);
    } else {
      console.warn("Router não está disponível ou ID inválido");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.dayContainer}>
        <div className={styles.dayCard}>
          <div style={{ display: "flex", justifyContent: "row", alignItems: "center", marginBottom: 16 }}>
            <Title className={styles.dayTitle}>Meus Treinos</Title>
            <Button onClick={fetchDadosDoServidor} loading={loading} size="small" icon={<SyncOutlined />} className={styles.btnn}>
              Atualizar
            </Button>
          </div>

          {treinosPorDia[diaAtualStr]?.length > 0 ? (
            <div className={styles.exerciseList}>
              {treinosPorDia[diaAtualStr].map((treino) => (
                <div
                  key={treino.id}
                  className={styles.exerciseCard}
                  onClick={() => verTreino(treino.id)}
                >
                  <div>
                    <Text className={styles.treinoTitle}>{treino.nome}</Text>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Text type="secondary" style={{ marginLeft: 10 }}>
              Nenhum treino para {diaAtualStr}.
            </Text>
          )}
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
