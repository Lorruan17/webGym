"use client"
import { useEffect, useState } from "react";
import { Button, Table, Space, Input, Typography, Modal } from "antd";
import { useRouter } from "next/navigation";
import { DeleteOutlined } from "@ant-design/icons";
import styles from "./treinos.module.css"; // Arquivo de estilos
import MainLayout from "@/app/sidebar/page";
import { FixedSizeList as FlatList } from "react-window";
import { getTreinos, getUserById } from "@/app/utils/api";

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
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);  // Novo estado para armazenar os dados do usuário

  // Chamada da API para buscar os treinos e o usuário
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Recuperando o token do localStorage
        const user = localStorage.getItem('user');
        const parsedUser = user ? JSON.parse(user) : null;
        const token = parsedUser?.token;

        if (!token) {
          throw new Error("Token não encontrado. Por favor, faça o login.");
        }

        // Pegando os treinos
        const data = await getTreinos(token);
        setAlunos(data);
        setFilteredAlunos(data);

        // Pegando os dados do usuário (ID 10 no exemplo)
        const usuarioData = await getUserById(10, token);  // Você pode ajustar o ID do usuário conforme necessário
        setUsuario(usuarioData);  // Armazenando os dados do usuário

      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

  const [treinosPorDia, setTreinosPorDia] = useState<Record<string, Exercicio[]>>(
    () => diasSemana.reduce((acc, dia) => ({ ...acc, [dia]: [] }), {})
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [treinoSelecionado, setTreinoSelecionado] = useState<Exercicio | null>(null);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);

  const handleConfirmSave = () => {
    setModalConfirmVisible(false);
    console.log("Treinos salvos com sucesso:", treinosPorDia);
    Modal.success({
      title: "Sucesso",
      content: "Os treinos foram salvos com sucesso!",
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filteredData = alunos.filter((aluno) =>
      aluno.nome.toLowerCase().includes(value)
    );
    setFilteredAlunos(filteredData);
  };

  const removerTreinoDoDia = (dia: string, index: number) => {
    const novosTreinos = { ...treinosPorDia };
    novosTreinos[dia].splice(index, 1);
    setTreinosPorDia(novosTreinos);
  };

  const adicionarTreinoAoDia = (dia: string) => {
    if (treinoSelecionado) {
      setTreinosPorDia(prev => ({
        ...prev,
        [dia]: [...prev[dia], treinoSelecionado]
      }));
      setModalVisible(false);
      setTreinoSelecionado(null);
    }
  };

  const { Title } = Typography;
  const { Text } = Typography;

  const Row: React.FC<{ index: number; style: React.CSSProperties }> = ({ index, style }) => {
    const aluno = filteredAlunos[index];
    if (!aluno) return null;

    return (
      <div style={{ ...style, display: "flex", alignItems: "center", padding: "10px", borderBottom: "1px solid #ddd" }}>
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
          <div style={{ marginTop: 20 }}>
            <Typography.Text strong>Usuário:</Typography.Text>
            <Typography.Text>{usuario.nome}</Typography.Text>
            <Typography.Text>{usuario.email}</Typography.Text>
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
            marginTop: 20
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
              {treinosPorDia[dia].length > 0 ? (
                <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                  {treinosPorDia[dia].map((treino, index) => (
                    <li
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 4
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span
                          style={{
                            display: "inline-block",
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: "#105fc5"
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
