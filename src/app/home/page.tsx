"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Row, Col, Statistic } from "antd";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import styles from "./home.module.css";
import MainLayout from "../sidebar/page";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [studentsCount, setStudentsCount] = useState<number>(0);
  const [studentsData, setStudentsData] = useState<any[]>([]); // Dados para o gráfico
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/login"); // Se não estiver logado, volta para login
    }

    // Simulação de chamada para buscar o número de alunos cadastrados
    fetchStudentsCount();
    fetchStudentsData();
  }, []);

  const fetchStudentsCount = () => {
    // Substitua por uma chamada real para a API para pegar a contagem de alunos
    setStudentsCount(150); // Exemplo de valor, substitua conforme necessário
  };

  const fetchStudentsData = () => {
    // Exemplo de dados para o gráfico. Isso deve ser dinâmico, vindo de uma API
    setStudentsData([
      { month: 'Jan', count: 10 },
      { month: 'Feb', count: 15 },
      { month: 'Mar', count: 25 },
      { month: 'Apr', count: 30 },
      { month: 'May', count: 40 },
      { month: 'Jun', count: 100 },
    ]);
  };

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <MainLayout>
        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Alunos Cadastrados"
                value={studentsCount}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Alunos Ativos"
                value={120} 
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Treinos Realizados"
                value={50}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
        </Row>

        <Row style={{ marginTop: 20 }}>
          <Col span={24}>
            <Card title="Alunos Registrados" bordered={false}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={studentsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
    </MainLayout>
  );
}
