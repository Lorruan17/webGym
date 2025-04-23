"use client";
import { useEffect, useState, useCallback } from "react";
import { Typography, Button } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import BottomBar from "../components/botom/BottomBar";
import styles from "./treino.module.css";
import { getTreinos } from "@/app/utils/api";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/app/utils/auth";

interface Exercicio {
  id: number;
  nome: string;
  descricao: string;
}

export default function Treinos() {
  const [alunos, setAlunos] = useState<Exercicio[]>([]);
  const [loading, setLoading] = useState(false);
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

  const fetchTreinosDoServidor = useCallback(async () => {
    try {
      if (!alunoId) throw new Error("Aluno não encontrado no localStorage.");
      setLoading(true);

      const token = getAccessToken();
      if (!token) throw new Error("Token não encontrado.");

      const data = await getTreinos(token); // Busca todos os treinos do usuário
      setAlunos(data);
    } catch (error) {
      console.error("Erro ao buscar os treinos:", error);
    } finally {
      setLoading(false);
    }
  }, [alunoId, getTreinos]);

  useEffect(() => {
    if (!carregarTreinosLocalmente()) {
      fetchTreinosDoServidor();
    }
  }, [carregarTreinosLocalmente, fetchTreinosDoServidor]);

  useEffect(() => {
    if (alunos.length > 0 && alunoId) {
      const novoTreinosPorDia: Record<string, Exercicio[]> = {};
      const userStr = localStorage.getItem("user");
      const usuario = userStr ? JSON.parse(userStr) : null;

      if (usuario) {
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
    }
  }, [alunos, alunoId, salvarTreinosLocalmente]);

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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Title className={styles.dayTitle}>Meus Treinos</Title>
            <Button onClick={fetchTreinosDoServidor} loading={loading} size="small" icon={<SyncOutlined />} className={styles.btnn}>
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