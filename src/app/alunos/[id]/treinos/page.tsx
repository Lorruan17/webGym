"use client";
import { useEffect, useState } from "react";
import { Button, Table, Space, Input, Typography, Modal, Select, SelectProps } from "antd";
import { useRouter, useParams } from "next/navigation";
import { DeleteOutlined } from "@ant-design/icons";
import styles from "./treinos.module.css";
import MainLayout from "@/app/sidebar/layout";
import { FixedSizeList as FlatList } from "react-window";
import { getTreinos } from "@/app/utils/api";

interface Exercicio {
  id: number;
  nome: string;
  descricao: string;
}

interface DiaConfig {
  series?: number;
  repeticoes?: number;
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
  const [diaConfigs, setDiaConfigs] = useState<Record<string, DiaConfig>>({});

  const diasSemana: ("Segunda" | "Terça" | "Quarta" | "Quinta" | "Sexta" | "Sábado" | "Domingo")[] = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo",
  ];

  const router = useRouter();
  const params = useParams();
  const alunoId = Number(params.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const user = localStorage.getItem("user");
        const parsedUser = user ? JSON.parse(user) : null;
        const token = parsedUser?.token;
        if (!token) throw new Error("Token não encontrado.");

        const data = await getTreinos(token);
        setAlunos(data);
        setFilteredAlunos(data);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
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

  useEffect(() => {
    if (usuario && alunos.length > 0) {
      const novoTreinosPorDia: Record<string, Exercicio[]> = {};
      const novosDiaConfigs: Record<string, DiaConfig> = {};
      diasSemana.forEach((dia) => {
        const chaveEx = `${dia.slice(0, 3).toLowerCase()}_ex`;
        const chaveSR = `${dia.slice(0, 3).toLowerCase()}_s_r`;
        const ids = usuario[chaveEx] as number[] | undefined;
        const srValues = usuario[chaveSR] as string[] | undefined;
        const idList = Array.isArray(ids) ? ids : [];

        novoTreinosPorDia[dia] = alunos.filter((t) => idList?.includes(t.id));
        if (Array.isArray(srValues) && srValues.length === 2) {
          novosDiaConfigs[dia] = { series: Number(srValues[0]), repeticoes: Number(srValues[1]) };
        } else {
          novosDiaConfigs[dia] = {};
        }
      });
      setTreinosPorDia(novoTreinosPorDia);
      setDiaConfigs(novosDiaConfigs);
    }
  }, [usuario, alunos]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = alunos.filter((a) => a.nome.toLowerCase().includes(value));
    setFilteredAlunos(filtered);
  };

  const adicionarTreinoAoDia = (dia: string) => {
    if (treinoSelecionado) {
      setTreinosPorDia((prev) => ({
        ...prev,
        [dia]: [...(prev[dia] || []), treinoSelecionado],
      }));
      setModalVisible(false);
      setTreinoSelecionado(null);
    }
  };

  const removerTreinoDoDia = (dia: string, treinoId: number) => {
    const novosTreinos = { ...treinosPorDia };
    novosTreinos[dia] = novosTreinos[dia].filter((t) => t.id !== treinoId);
    setTreinosPorDia(novosTreinos);
  };

  const handleDiaConfigChange = (dia: string, type: "series" | "repeticoes", value: SelectProps['value']) => {
    setDiaConfigs((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [type]: value ? Number(value as string) : undefined,
      },
    }));
  };

  const handleConfirmSave = async () => {
    if (!usuario) return;

    try {
      const user = localStorage.getItem("user");
      const parsedUser = user ? JSON.parse(user) : null;
      const token = parsedUser?.token;
      if (!token) throw new Error("Token não encontrado.");

      const body: Record<string, any> = {};
      const treinosBody: Record<string, number[]> = {};
      const srBody: Record<string, (number | undefined | null)[]> = {}; // Tipo alterado aqui

      diasSemana.forEach((dia) => {
        const chaveExercicio = `${dia.slice(0, 3).toLowerCase()}_ex`;
        const chaveSeriesRepeticoes = `${dia.slice(0, 3).toLowerCase()}_s_r`;

        const treinosDoDia = treinosPorDia[dia] || [];
        treinosBody[chaveExercicio] = treinosDoDia.map((t) => t.id);

        if (treinosDoDia.length > 0) {
          const series = diaConfigs[dia]?.series;
          const repeticoes = diaConfigs[dia]?.repeticoes;
          srBody[chaveSeriesRepeticoes] = [series, repeticoes].filter(val => val !== undefined);
          if (srBody[chaveSeriesRepeticoes].length === 0 && (series !== undefined || repeticoes !== undefined)) {
            srBody[chaveSeriesRepeticoes] = [null]; // Agora isso é permitido pelo tipo
          } else if (srBody[chaveSeriesRepeticoes].length === 0) {
            delete body[chaveSeriesRepeticoes]; // Não incluir a chave se não houver valores
          }
        } else {
          delete body[chaveSeriesRepeticoes]; // Não incluir a chave se não houver treinos
        }
      });

      const finalBody = { ...treinosBody, ...srBody };


      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${usuario.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(finalBody),
      });

      if (response.ok) {
        Modal.success({
          title: "Sucesso",
          content: "Treinos e configurações atualizados com sucesso!",
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
        <Title className={styles.title}>Painel de Treinos</Title>

        <Input
          placeholder="Pesquise os Treinos Disponíveis"
          value={searchText}
          onChange={handleSearch}
          className={styles.input}
        />

        {usuario && (
          <div style={{ marginTop: 20, gap: 5, display: "flex", flexDirection: "column" }}>
            <div>
              <Text className={styles.user} strong>Usuário:</Text> <Text className={styles.user}>{usuario.username}</Text>
            </div>
            <div>
              <Text className={styles.user} strong>Email:</Text> <Text className={styles.user}>{usuario.email}</Text>
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
                flexDirection: 'column',
                display: 'flex'
              }}
            >
              <Text strong style={{ fontSize: 16 }}>
                {dia}
              </Text>

              <div className={styles.divSel}>
                <Select
                  className={styles.sel}
                  placeholder="Séries"
                  value={diaConfigs[dia]?.series}
                  onChange={(value) => handleDiaConfigChange(dia, "series", value)}
                  options={[
                    { value: null, label: 'Nenhum' },
                    { value: '1', label: '1x' },
                    { value: '2', label: '2x' },
                    { value: '3', label: '3x' },
                    { value: '4', label: '4x' },
                    { value: '5', label: '5x' },
                    { value: '6', label: '6x' },
                    { value: '7', label: '7x' },
                    { value: '8', label: '8x' },
                    { value: '9', label: '9x' },
                    { value: '10', label: '10x' },
                  ]}
                />
                <Select
                  className={styles.sel}
                  placeholder="Repetições"
                  value={diaConfigs[dia]?.repeticoes}
                  onChange={(value) => handleDiaConfigChange(dia, "repeticoes", value)}
                  options={[
                    { value: null, label: 'Nenhum' },
                    { value: '6', label: '6 reps' },
                    { value: '7', label: '7 reps' },
                    { value: '8', label: '8 reps' },
                    { value: '9', label: '9 reps' },
                    { value: '10', label: '10 reps' },
                    { value: '11', label: '11 reps' },
                    { value: '12', label: '12 reps' },
                    { value: '13', label: '13 reps' },
                    { value: '14', label: '14 reps' },
                    { value: '15', label: '15 reps' },
                    { value: '16', label: '16 reps' },
                    { value: '17', label: '17 reps' },
                    { value: '18', label: '18 reps' },
                    { value: '19', label: '19 reps' },
                    { value: '20', label: '20 reps' },
                    { value: '21', label: '21 reps' },
                    { value: '22', label: '22 reps' },
                    { value: '23', label: '23 reps' },
                    { value: '24', label: '24 reps' },
                    { value: '25', label: '25 reps' },
                  ]}
                />
              </div>

              {treinosPorDia[dia]?.length > 0 ? (
                <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                  {treinosPorDia[dia].map((treino) => (
                    <li
                      key={treino.id}
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
                        onClick={() => removerTreinoDoDia(dia, treino.id)}
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