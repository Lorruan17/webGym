"use client"
import { useEffect, useState } from "react";
import { Button, Table, Space, Input, Typography } from "antd";
import { useRouter } from "next/navigation";
import styles from "./alunos.module.css"; // Arquivo de estilos
import MainLayout from "../sidebar/page";
import { FixedSizeList as FlatList } from "react-window";


interface Aluno {
  id: number;
  nome: string;
  email: string;
}


export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([]); // Lista de alunos
  const [filteredAlunos, setFilteredAlunos] = useState<Aluno[]>([]); // Lista filtrada
  const [searchText, setSearchText] = useState(""); // Texto de pesquisa
  const [loading, setLoading] = useState(false); // Controle de carregamento
  const [page, setPage] = useState(1); // Página atual
  const pageSize = 10; // Número de alunos por página
  const router = useRouter();

  // Simulando a busca de dados (poderia vir de uma API)
  useEffect(() => {
    const alunosData: Aluno[] = [
      { id: 1, nome: "João Silva", email: "joao@exemplo.com" },
      { id: 2, nome: "Maria Oliveira", email: "maria@exemplo.com" },
      { id: 3, nome: "Carlos Pereira", email: "carlos@exemplo.com" },
      { id: 4, nome: "Ana Souza", email: "ana@exemplo.com" },
      { id: 5, nome: "Luiz Costa", email: "luiz@exemplo.com" },
      { id: 6, nome: "Fernanda Lima", email: "fernanda@exemplo.com" },
      { id: 7, nome: "Ricardo Gomes", email: "ricardo@exemplo.com" },
      { id: 8, nome: "Juliana Silva", email: "juliana@exemplo.com" },
      { id: 9, nome: "Mateus Santos", email: "mateus@exemplo.com" },
      { id: 10, nome: "Patrícia Alves", email: "patricia@exemplo.com" },
      { id: 11, nome: "Gustavo Lima", email: "gustavo@exemplo.com" },
      { id: 12, nome: "Raquel Martins", email: "raquel@exemplo.com" },
      { id: 13, nome: "Felipe Pereira", email: "felipe@exemplo.com" },
      { id: 14, nome: "Bruna Costa", email: "bruna@exemplo.com" },
      { id: 15, nome: "Paulo Souza", email: "paulo@exemplo.com" },
      { id: 16, nome: "Beatriz Oliveira", email: "beatriz@exemplo.com" },
      { id: 17, nome: "Lucas Rodrigues", email: "lucas@exemplo.com" },
      { id: 18, nome: "Mariana Ribeiro", email: "mariana@exemplo.com" },
      { id: 19, nome: "Tiago Costa", email: "tiago@exemplo.com" },
      { id: 20, nome: "Carla Santos", email: "carla@exemplo.com" },
      { id: 21, nome: "Roberta Almeida", email: "roberta@exemplo.com" },
      { id: 22, nome: "Eduardo Silva", email: "eduardo@exemplo.com" },
      { id: 23, nome: "Patrícia Lima", email: "patricia.lima@exemplo.com" },
      { id: 24, nome: "Juliano Souza", email: "juliano@exemplo.com" },
      { id: 25, nome: "Cristiane Souza", email: "cristiane@exemplo.com" },
      { id: 26, nome: "Vinícius Ferreira", email: "vinicius@exemplo.com" },
      { id: 27, nome: "Leandro Almeida", email: "leandro@exemplo.com" },
      { id: 28, nome: "Adriana Costa", email: "adriana@exemplo.com" },
      { id: 29, nome: "Marcos Oliveira", email: "marcos@exemplo.com" },
      { id: 30, nome: "Isabela Pinto", email: "isabela@exemplo.com" },
      { id: 31, nome: "Gabriel Ramos", email: "gabriel@exemplo.com" },
      { id: 32, nome: "Julieta Nogueira", email: "julieta@exemplo.com" },
      { id: 33, nome: "Rafael Rocha", email: "rafael@exemplo.com" },
      { id: 34, nome: "Fabiana Almeida", email: "fabiana@exemplo.com" },
      { id: 35, nome: "Andréia Martins", email: "andreia@exemplo.com" },
      { id: 36, nome: "Caio Rocha", email: "caio@exemplo.com" },
      { id: 37, nome: "Aline Castro", email: "aline@exemplo.com" },
      { id: 38, nome: "Vinícius Oliveira", email: "vinicius.oliveira@exemplo.com" },
      { id: 39, nome: "Tatiane Ferreira", email: "tatiane@exemplo.com" },
      { id: 40, nome: "Luana Sousa", email: "luana@exemplo.com" },
      { id: 41, nome: "Cintia Martins", email: "cintia@exemplo.com" },
      { id: 42, nome: "Thiago Oliveira", email: "thiago@exemplo.com" },
      { id: 43, nome: "Juliana Castro", email: "juliana@exemplo.com" },
      { id: 44, nome: "Davi Lima", email: "davi@exemplo.com" },
      { id: 45, nome: "Gisele Souza", email: "gisele@exemplo.com" },
      { id: 46, nome: "Júlio Silva", email: "julio@exemplo.com" },
      { id: 47, nome: "Felipe Costa", email: "felipe.costa@exemplo.com" },
      { id: 48, nome: "Mário Pereira", email: "mario@exemplo.com" },
      { id: 49, nome: "Eduarda Santos", email: "eduarda@exemplo.com" },
      { id: 50, nome: "Patricia Ramos", email: "patricia.ramos@exemplo.com" },
      { id: 51, nome: "Ana Clara", email: "anaclara@exemplo.com" },
      { id: 52, nome: "Amanda Lima", email: "amanda@exemplo.com" },
      { id: 53, nome: "Bruna Silva", email: "bruna.silva@exemplo.com" },
      { id: 54, nome: "Isis Barbosa", email: "isis@exemplo.com" },
      { id: 55, nome: "Francisco Costa", email: "francisco@exemplo.com" },
      { id: 56, nome: "Carla Souza", email: "carla.souza@exemplo.com" },
      { id: 57, nome: "João Pedro", email: "joaopedro@exemplo.com" },
      { id: 58, nome: "Felipe Almeida", email: "felipe.almeida@exemplo.com" },
      { id: 59, nome: "Robson Martins", email: "robson@exemplo.com" },
      { id: 60, nome: "André Souza", email: "andre.souza@exemplo.com" },
      { id: 61, nome: "Regina Santos", email: "regina@exemplo.com" },
      { id: 62, nome: "Célia Ramos", email: "celia@exemplo.com" },
      { id: 63, nome: "Fábio Lima", email: "fabio@exemplo.com" },
      { id: 64, nome: "Ricardo Alves", email: "ricardo.alves@exemplo.com" },
      { id: 65, nome: "Cristiano Silva", email: "cristiano@exemplo.com" },
      { id: 66, nome: "Adriana Gomes", email: "adriana.gomes@exemplo.com" },
      { id: 67, nome: "Maurício Lima", email: "mauricio@exemplo.com" },
      { id: 68, nome: "Luiz Alberto", email: "luiz.alberto@exemplo.com" },
      { id: 69, nome: "Regiane Pereira", email: "regiane@exemplo.com" },
      { id: 70, nome: "Mariana Pereira", email: "mariana.pereira@exemplo.com" },
      { id: 71, nome: "Antônio Santos", email: "antonio@exemplo.com" },
      { id: 72, nome: "Heloísa Nogueira", email: "heloisa@exemplo.com" },
      { id: 73, nome: "Luan Barbosa", email: "luan@exemplo.com" },
      { id: 74, nome: "Vânia Costa", email: "vania@exemplo.com" },
      { id: 75, nome: "Eliane Pereira", email: "eliane@exemplo.com" },
      { id: 76, nome: "Walter Souza", email: "walter@exemplo.com" },
      { id: 77, nome: "Sandro Lima", email: "sandro@exemplo.com" },
      { id: 78, nome: "Verônica Silva", email: "veronica@exemplo.com" },
      { id: 79, nome: "Henrique Martins", email: "henrique.martins@exemplo.com" },
      { id: 80, nome: "Luciana Costa", email: "luciana@exemplo.com" },
      { id: 81, nome: "Gabriela Nogueira", email: "gabriela@exemplo.com" },
      { id: 82, nome: "Eduardo Costa", email: "eduardo.costa@exemplo.com" },
      { id: 83, nome: "Renato Oliveira", email: "renato@exemplo.com" },
      { id: 84, nome: "Juliane Souza", email: "juliane.souza@exemplo.com" },
      { id: 85, nome: "Marcos Ribeiro", email: "marcos.ribeiro@exemplo.com" },
      { id: 86, nome: "Leila Almeida", email: "leila@exemplo.com" },
      { id: 87, nome: "Ricardo Oliveira", email: "ricardo.oliveira@exemplo.com" },
      { id: 88, nome: "Luiza Costa", email: "luiza@exemplo.com" },
      { id: 89, nome: "Alan Souza", email: "alan@exemplo.com" },
      { id: 90, nome: "Vanessa Lima", email: "vanessa@exemplo.com" },
      { id: 91, nome: "Maurício Costa", email: "mauricio.costa@exemplo.com" },
      { id: 92, nome: "Bruna Rodrigues", email: "bruna.rodrigues@exemplo.com" },
      { id: 93, nome: "Tatiane Lima", email: "tatiane.lima@exemplo.com" },
      { id: 94, nome: "Joana Souza", email: "joana.souza@exemplo.com" },
      { id: 95, nome: "José Alves", email: "jose.alves@exemplo.com" },
      { id: 96, nome: "Renato Santos", email: "renato.santos@exemplo.com" },
      { id: 97, nome: "Carlos Eduardo", email: "carlos@eduardo.com" },
      { id: 98, nome: "Michele Costa", email: "michele@exemplo.com" },
      { id: 99, nome: "Ricardo Oliveira", email: "ricardo.oliveira@exemplo.com" },
      { id: 100, nome: "Daniela Souza", email: "daniela.souza@exemplo.com" }
    ];
    setAlunos(alunosData);
    setFilteredAlunos(alunosData);
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filteredData = alunos.filter((aluno) =>
      aluno.nome.toLowerCase().includes(value)
    );
    setFilteredAlunos(filteredData);
  };

  const viewTreinos = (id: number) => {
    router.push(`/alunos/${id}/treinos`);
  };

  const viewDietas = (id: number) => {
    router.push(`/alunos/${id}/dietas`);
  };

  const {Text} = Typography

  // Componente de linha otimizado
  const Row: React.FC<{ index: number; style: React.CSSProperties }> = ({ index, style }) => {
    const aluno = filteredAlunos[index];
    if (!aluno) return null;

    return (

      <div style={{ ...style, display: "flex", alignItems: "center", padding: "10px", borderBottom: "1px solid #ddd" }}>
        <span style={{ flex: 1 }}>{aluno.nome}</span>
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
          height={350} // Altura visível
          itemCount={filteredAlunos.length} // Total de itens
          itemSize={60} // Altura de cada item
          width="100%" // Largura da lista
        >
          {Row}
        </FlatList>
      </div>
    </MainLayout>
  );
};


