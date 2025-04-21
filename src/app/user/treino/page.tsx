"use client";
import { useEffect, useState } from "react";
import { Typography } from "antd";
import BottomBar from "../components/botom/BottomBar";
import styles from "./treino.module.css";
import { getTreinos } from "@/app/utils/api";
import { useRouter } from "next/navigation";

interface Exercicio {
  id: number;
  nome: string;
  descricao: string;
}

export default function UsuarioPage() {
  const [alunos, setAlunos] = useState<Exercicio[]>([]);
  const [filteredAlunos, setFilteredAlunos] = useState<Exercicio[]>([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!alunoId) throw new Error("Aluno não encontrado no localStorage.");
        setLoading(true);

        const user = localStorage.getItem("user");
        const parsedUser = user ? JSON.parse(user) : null;
        const token = parsedUser?.token;
        if (!token) throw new Error("Token não encontrado.");

        const data = await getTreinos(token);
        setAlunos(data);
        setFilteredAlunos(data);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${alunoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Erro ao buscar usuário");
        const usuarioData = await response.json();
        if (!usuarioData) throw new Error("Usuário não encontrado.");

        setUsuario(usuarioData);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [alunoId]);

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
    }
  }, [usuario, alunos]);

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
          <Title className={styles.dayTitle}>Meus Treinos</Title>

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
              Nenhum treino adicionado.
            </Text>
          )}
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
