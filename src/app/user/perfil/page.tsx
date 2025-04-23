"use client";

import { useState, useEffect, useRef } from "react";
import { Button, Card, Typography, Space, Modal, Avatar } from "antd";
import { useRouter } from "next/navigation";
import BottomBar from "../components/botom/BottomBar";
import styles from "./perfil.module.css";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface UserData {
  name?: string | null;
  email?: string | null;
  profileImage?: string | null;
}

export default function PerfilPage() {
  const [userData, setUserData] = useState<UserData>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null); // Evento do PWA
  const [isInstalling, setIsInstalling] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUserData(JSON.parse(userStr));
    }

    // Detecta o evento beforeinstallprompt para PWA
    const handler = (event: any) => {
      event.preventDefault();
      setDeferredPrompt(event); // Armazena o evento
      setIsInstalling(true); // Habilita o botão de instalar
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/user");
  };

  const handleEdit = () => {
    alert("Função de editar ainda não implementada!");
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        const updatedUser = { ...userData, profileImage: base64Image };
        setUserData(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Exibe o prompt de instalação do PWA
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("Usuário aceitou a instalação do PWA");
        } else {
          console.log("Usuário rejeitou a instalação do PWA");
        }
        setDeferredPrompt(null); // Limpa o evento após a instalação
        setIsInstalling(false);
      });
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <Avatar
            size={150}
            src={userData.profileImage ? userData.profileImage : undefined} // Carrega a foto se existir
            icon={!userData.profileImage && <UserOutlined />} // Mostra o ícone se não houver foto
          />
          <Button
            size="small"
            className={styles.uploadButton}
            onClick={handleUploadClick}
            icon={<UploadOutlined />}
          >
            Foto
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept="image/*"
          />
          {userData.name && <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>{userData.name}</Title>}
          {userData.email && <Text type="secondary">{userData.email}</Text>}
        </div>

        <div className={styles.buttonGroup}>
          <Button type="primary" onClick={handleEdit} block className={`${styles.btn} ${styles.editBtn}`}>
            Editar Perfil
          </Button>
          {isInstalling && (
            <Button
              type="primary"
              block
              onClick={handleInstall}
              className={`${styles.btn} ${styles.installBtn}`}
            >
              Instalar o Aplicativo
            </Button>
          )}
          <Button danger onClick={showModal} block className={`${styles.btn} ${styles.logoutBtn}`}>
            Sair
          </Button>
        </div>
      </Card>

      <BottomBar />

      {/* Modal de confirmação */}
      <Modal
        title="Deseja sair?"
        visible={isModalVisible}
        onOk={handleLogout}
        onCancel={handleCancel}
        okText="Sim"
        cancelText="Cancelar"
        className={styles.modal}
      >
        <p>Você tem certeza que quer deslogar?</p>
      </Modal>
    </div>
  );
}
