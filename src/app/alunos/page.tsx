"use client"
import { useEffect, useState } from "react";
import { Button, Table, Space, Input, Typography } from "antd";
import { useRouter } from "next/navigation";
import styles from "./alunos.module.css"; // Arquivo de estilos
import MainLayout from "../sidebar/layout";
import { FixedSizeList as FlatList } from "react-window";

interface Aluno {
  id: number;
  username: string;
  email: string;
}

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([]); // Lista de alunos
  const [filteredAlunos, setFilteredAlunos] = useState<Aluno[]>([]); // Lista filtrada
  const [searchText, setSearchText] = useState(""); // Texto de pesquisa
  const [loading, setLoading] = useState(false); // Controle de carregamento
  const [page, setPage] = useState(1); // Página atual
  const router = useRouter();

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).token : null;
        if (token) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`, 
            },
          });

          if (response.ok) {
            const data = await response.json();
            setAlunos(data);
            setFilteredAlunos(data);
          } else {
            console.error("Falha ao obter dados dos alunos");
          }
        }
      } catch (error) {
        console.error("Erro ao fazer requisição:", error);
      }
    };

    fetchAlunos();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filteredData = alunos.filter((aluno) =>
      aluno.username.toLowerCase().includes(value)
    );
    setFilteredAlunos(filteredData);
  };

  const viewTreinos = (id: number) => {
    router.push(`/alunos/${id}/treinos`);
  };

  const viewDietas = (id: number) => {
    router.push(`/alunos/${id}/dieta`);
  };

  const { Text } = Typography;

  // Componente de linha otimizado
  const Row: React.FC<{ index: number; style: React.CSSProperties }> = ({ index, style }) => {
    const aluno = filteredAlunos[index];
    if (!aluno) return null;

    return (
      <div style={{ ...style, display: "flex", alignItems: "center", padding: "10px", borderBottom: "1px solid #ddd" }}>
        <span style={{ flex: 1 }}>{aluno.username}</span>
        <span style={{ flex: 1 }}>{aluno.email}</span>
        <Space>
          <Button onClick={() => viewTreinos(aluno.id)} className={styles.btn} type="primary">
            <Text className={styles.btnText}>Treinos</Text>
          </Button>
          <Button onClick={() => viewDietas(aluno.id)} className={styles.btn} type="primary">
            <Text className={styles.btnText}>Dieta</Text>
          </Button>
        </Space>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <Input
          placeholder="Pesquisar aluno por nome"
          value={searchText}
          onChange={handleSearch}
          className={styles.input}
        />

        <FlatList
          className={styles.flat}
          height={350}
          itemCount={filteredAlunos.length}
          itemSize={60}
          width="100%"
        >
          {Row}
        </FlatList>
      </div>
    </MainLayout>
  );
}
