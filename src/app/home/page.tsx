"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Layout, Card, Statistic, Typography, Divider } from "antd";
import { UsergroupAddOutlined, FireOutlined, HeartFilled } from "@ant-design/icons";
import styles from "./home.module.css"; // Importe o arquivo CSS
import MainLayout from "../sidebar/layout";

const { Title, Paragraph, Text } = Typography;

interface User {
  id: string;
  email: string;
  // ... outras propriedades
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [totalAlunos, setTotalAlunos] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/login");
    }

    fetchTotalAlunos();
  }, [router]);

  const fetchTotalAlunos = () => {
    setTotalAlunos(350); // Exemplo
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <Title level={2} className={styles.pageTitle}>
          <FireOutlined className={styles.titleIcon} /> Painel de Administração
        </Title>
        <div className={styles.presentation}>
          <Title level={3} className={styles.presentationTitle}>Bem-vindo ao <Text strong className={styles.lorysGymText} style={{fontSize: 25}}>LorysGym</Text></Title>
          <Paragraph className={styles.presentationParagraph}>
            Descubra uma nova maneira de gerenciar sua academia e fortalecer o relacionamento com seus alunos.
            <Text strong className={styles.lorysGymText}> LorysGym</Text> oferece as ferramentas essenciais para otimizar suas operações e elevar a experiência dos seus membros.
          </Paragraph>

          <Divider className={styles.divider} />

          <Title level={4} className={styles.featuresTitle}>Recursos em Destaque:</Title>
          <div className={styles.featuresContainer}>
            <div className={styles.featureItem}>
              <HeartFilled className={styles.featureIcon} />
              <div>
                <Text strong className={styles.featureText}>Treinos Personalizados (PWA para Alunos):</Text>
                <Paragraph className={styles.featureParagraph}>Crie e acompanhe planos de treino personalizados, acessíveis aos alunos através de um aplicativo web progressivo moderno e intuitivo.</Paragraph>
              </div>
            </div>
            <div className={styles.featureItem}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#27ae60" className={styles.featureIcon}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              <div>
                <Text strong className={styles.featureText}>Campo de Dietas (PWA para Alunos):</Text>
                <Paragraph className={styles.featureParagraph}>Adicione planos de dietas detalhados no sistema, tornando-os imediatamente disponíveis para consulta e acompanhamento pelos alunos.</Paragraph>
              </div>
            </div>
          </div>

          <Divider className={styles.divider} />

          <Paragraph className={styles.presentationParagraph}>
            Explore o menu lateral para descobrir todas as funcionalidades que <Text strong className={styles.lorysGymText}>LorysGym</Text> oferece. Se precisar de qualquer assistência, nossa equipe está à disposição para ajudar você a alcançar o sucesso!
          </Paragraph>
        </div>
      </div>
    </MainLayout>
  );
}