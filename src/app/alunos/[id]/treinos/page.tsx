"use client";
import { useEffect, useState } from "react";
import { Button, Table, Space, Input, Typography, Modal } from "antd";
import { useRouter, useParams } from "next/navigation";
import { DeleteOutlined } from "@ant-design/icons";
import styles from "./treinos.module.css";
import MainLayout from "@/app/sidebar/page";
import { FixedSizeList as FlatList } from "react-window";
import { getTreinos } from "@/app/utils/api"; // Removido getUserById

interface Exercicio {
  id: number;
  nome: string;
  descricao: string;
}

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Exercicio[]>([]);
  const [filteredAlunos, setFilteredAlunos] = useState<Exercicio[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);
  const [treinosPorDia, setTreinosPorDia] = useState<Record<string, Exercicio[]>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [treinoSelecionado, setTreinoSelecionado] = useState<Exercicio | null>(null);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);

  const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

  const router = useRouter();
  const params = useParams();
  const alunoId = Number(params.id);

  // Buscar treinos e dados do usuário
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const user = localStorage.getItem("user");
        const parsedUser = user ? JSON.parse(user) : null;
        const token = parsedUser?.token;
        if (!token) throw new Error("Token não encontrado.");

        // 1. Buscar todos os treinos
        const data = await getTreinos(token);
        setAlunos(data);
        setFilteredAlunos(data);

        // 2. Buscar todos os usuários
        const response = await fetch("http://192.168.1.6:3000/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Erro ao buscar usuários");

        const allUsers = await response.json();
        const usuarioData = allUsers.find((user: any) => user.id === alunoId);
        if (!usuarioData) throw new Error("Usuário não encontrado.");

        setUsuario(usuarioData);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      } finally {
        setLoading(false);
      }
    };

    if (alunoId) fetchData();
  }, [alunoId]);


  // Atualizar treinos por dia com base no usuário e treinos disponíveis
  useEffect(() => {
    if (usuario && alunos.length > 0) {
      const novoTreinosPorDia: Record<string, Exercicio[]> = {};
      diasSemana.forEach((dia) => {
        const chave = `${dia.slice(0, 3).toLowerCase()}_ex`;
        const ids = usuario[chave] || [];
        const idList = Array.isArray(ids)
          ? ids.map((item: any) => (typeof item === "object" ? item.id : item))
          : [];

        novoTreinosPorDia[dia] = alunos.filter((t) => idList.includes(t.id));
      });
      setTreinosPorDia(novoTreinosPorDia);
    }
  }, [usuario, alunos]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = alunos.filter((a) =>
      a.nome.toLowerCase().includes(value)
    );
    setFilteredAlunos(filtered);
  };

  const adicionarTreinoAoDia = (dia: string) => {
    if (treinoSelecionado) {
      setTreinosPorDia((prev) => ({
        ...prev,
        [dia]: [...prev[dia], treinoSelecionado],
      }));
      setModalVisible(false);
      setTreinoSelecionado(null);
    }
  };

  const removerTreinoDoDia = (dia: string, index: number) => {
    const novos = { ...treinosPorDia };
    novos[dia].splice(index, 1);
    setTreinosPorDia(novos);
  };

  const handleConfirmSave = async () => {
    if (!usuario) return;

    try {
      const user = localStorage.getItem("user");
      const parsedUser = user ? JSON.parse(user) : null;
      const token = parsedUser?.token;
      if (!token) throw new Error("Token não encontrado.");

      const body: Record<string, number[]> = {};
      diasSemana.forEach((dia) => {
        const chave = `${dia.slice(0, 3).toLowerCase()}_ex`;
        body[chave] = treinosPorDia[dia].map((t) => t.id);
      });

      console.log("URL:", `http://192.168.1.6:3000/users/${usuario.id}`);
      console.log("Token:", token);
      console.log("Body:", JSON.stringify(body, null, 2));

      const response = await fetch(`http://192.168.1.6:3000/users/${usuario.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        Modal.success({
          title: "Sucesso",
          content: "Treinos atualizados com sucesso!",
        });
      } else {
        const erro = await response.json();
        throw new Error(erro.message || "Erro ao salvar.");
      }
    } catch (err: any) {
      Modal.error({
        title: "Erro",
        content: err.message,
      });
    } finally {
      setModalConfirmVisible(false);
    }
  };

  const { Title, Text } = Typography;

  const Row: React.FC<{ index: number; style: React.CSSProperties }> = ({
    index,
    style,
  }) => {
    const aluno = filteredAlunos[index];
    if (!aluno) return null;

    return (
      <div
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          padding: "10px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <span style={{ flex: 1 }}>{aluno.nome}</span>
        <span style={{ flex: 1 }}>{aluno.descricao}</span>
        <Space>
          <Button
            className={styles.btn}
            type="primary"
            onClick={() => {
              setTreinoSelecionado(aluno);
              setModalVisible(true);
            }}
          >
            <Text className={styles.btnText}>Add Treino</Text>
          </Button>
        </Space>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <Title level={4}>Painel de Treinos</Title>

        <Input
          placeholder="Pesquise os Treinos Disponíveis"
          value={searchText}
          onChange={handleSearch}
          className={styles.input}
        />

        {usuario && (
          <div style={{ marginTop: 20, gap: 5, display: "flex", flexDirection: "column" }}>
            <div>
              <Text strong>Usuário:</Text> <Text>{usuario.username}</Text>
            </div>
            <div>
              <Text strong>Email:</Text> <Text>{usuario.email}</Text>
            </div>
          </div>
        )}

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

      <div style={{ marginTop: 40 }}>
        <Title level={4}>Treinos por Dia da Semana</Title>
        <div
          style={{
            display: "grid",
            gridTemplateRows: `repeat(${diasSemana.length}, auto)`,
            rowGap: "16px",
            marginTop: 20,
          }}
        >
          {diasSemana.map((dia) => (
            <div
              key={dia}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 16,
                background: "#fafafa",
              }}
            >
              <Text strong style={{ fontSize: 16 }}>
                {dia}
              </Text>
              {treinosPorDia[dia]?.length > 0 ? (
                <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                  {treinosPorDia[dia].map((treino, index) => (
                    <li
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span
                          style={{
                            display: "inline-block",
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: "#105fc5",
                          }}
                        ></span>
                        <span>{treino.nome}</span>
                      </div>
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => removerTreinoDoDia(dia, index)}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <Text type="secondary" style={{ marginLeft: 10 }}>
                  Nenhum treino adicionado.
                </Text>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 40, textAlign: "center" }}>
        <Button type="primary" size="large" onClick={() => setModalConfirmVisible(true)}>
          Salvar Treinos
        </Button>
      </div>

      <Modal
        title="Confirmar Salvar"
        open={modalConfirmVisible}
        onCancel={() => setModalConfirmVisible(false)}
        onOk={handleConfirmSave}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <p>Tem certeza que deseja salvar os treinos atribuídos?</p>
      </Modal>

      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        title="Escolha o dia para adicionar o treino"
        footer={null}
        className={styles.modal}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          {diasSemana.map((dia) => (
            <Button key={dia} onClick={() => adicionarTreinoAoDia(dia)} block>
              {dia}
            </Button>
          ))}
        </Space>
      </Modal>
    </MainLayout>
  );
}
