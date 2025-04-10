"use client";

import { useEffect, useState } from "react";
import { Button, Card, Typography, Space, Modal } from "antd";
import { useRouter } from "next/navigation";
import BottomBar from "../components/botom/BottomBar";
import styles from "./perfil.module.css";

const { Title, Text } = Typography;

export default function PerfilPage() {
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // Controle do modal
  const router = useRouter();

  // Carregar usuário do localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setName(parsedUser?.name || null);
      setEmail(parsedUser?.email || null);
    }
  }, []);

  // Função para mostrar o modal de confirmação
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Função para fechar o modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Função de confirmação do logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/"); // Redireciona para a tela inicial
  };

  // Função de editar perfil (não implementada)
  const handleEdit = () => {
    alert("Função de editar ainda não implementada!");
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Title level={3}>Meu Perfil</Title>
        <Space direction="vertical" size="middle">
          <div>
            <Text strong>Nome:</Text>
            <br />
            <Text>{name || "Não encontrado"}</Text>
          </div>
          <div>
            <Text strong>Email:</Text>
            <br />
            <Text>{email || "Não encontrado"}</Text>
          </div>
        </Space>

        <div className={styles.buttonGroup}>
          <Button type="primary" onClick={handleEdit} block className={styles.btn}>
            Editar Perfil
          </Button>
          <Button danger onClick={showModal} block className={styles.btn}>
            Sair
          </Button>
        </div>
      </Card>

      <BottomBar />

      {/* Modal de confirmação */}
      <Modal
        title="Deseja sair?"
        visible={isModalVisible}
        onOk={handleLogout} // Chama a função de logout se confirmado
        onCancel={handleCancel} // Fecha o modal se cancelado
        okText="Sim"
        cancelText="Cancelar"
        className={styles.modal} // Estilo personalizado para o modal
      >
        <p>Você tem certeza que quer deslogar?</p>
      </Modal>
    </div>
  );
}
