"use client";
import { useEffect, useState } from "react";
import BottomBar from "../components/botom/BottomBar";
import { Typography, Layout, Card, Modal, Input } from "antd";
import styles from "./app.module.css";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

export default function AppHome() {
  const [peso, setPeso] = useState("70 kg");
  const [altura, setAltura] = useState("1.75 m");
  const [objetivo, setObjetivo] = useState("65 kg");

  const [modalVisible, setModalVisible] = useState(false);
  const [formValue, setFormValue] = useState("");
  const [selectedCard, setSelectedCard] = useState<"peso" | "altura" | "objetivo" | "">("");
  const [name, setName] = useState<string | null>(null);

  const calcularIMC = () => {
    const pesoNum = parseFloat(peso.replace(/[^\d.]/g, ""));
    const alturaNum = parseFloat(altura.replace(/[^\d.]/g, ""));
    if (isNaN(pesoNum) || isNaN(alturaNum) || alturaNum === 0) return "N/A";
    const imc = pesoNum / (alturaNum * alturaNum);
    console.log("pesoNum:", pesoNum, "alturaNum:", alturaNum, "imc:", imc); // Agora funciona
    return imc.toFixed(2);
  };

  const getIMCStatus = (imc: number) => {
    if (imc < 18.5) return { status: "Abaixo do peso", message: "Hora de ganhar força, você consegue!" };
    if (imc < 24.9) return { status: "Peso ideal", message: "Mantenha o foco, tá mandando bem!" };
    if (imc < 29.9) return { status: "Sobrepeso", message: "Vamos ajustar juntos, você é capaz!" };
    return { status: "Obesidade", message: "Cada passo importa. Comece hoje, por você!" };
  };

  const imc = calcularIMC();
  const imcStatus = isNaN(Number(imc)) ? null : getIMCStatus(Number(imc));

  const openModal = (type: "peso" | "altura" | "objetivo", currentValue: string) => {
    setSelectedCard(type);
    setFormValue(currentValue);
    setModalVisible(true);
  };

  const handleSave = () => {
    const newValue = formValue.trim();
    if (!newValue) return;

    switch (selectedCard) {
      case "peso":
        setPeso(`${newValue} kg`);
        break;
      case "altura":
        setAltura(`${newValue} m`);
        break;
      case "objetivo":
        setObjetivo(`${newValue} kg`);
        break;
    }

    setModalVisible(false);
    setFormValue("");
    setSelectedCard("");
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      const firstName = parsedUser?.name?.split(" ")[0] || null;
      setName(firstName);
    }
  }, []);

  return (
    <Layout style={{ minHeight: "100vh", paddingBottom: 64 }}>
      <Content className={styles.content}>
        <Title level={2}>Bem-vindo{name ? `, ${name}` : ""}! 👋</Title>
        <div className={styles.cardList}>
          <Card className={styles.card} onClick={() => openModal("peso", peso.replace(" kg", ""))}>
            <Title level={5}>Peso</Title>
            <Paragraph>{peso}</Paragraph>
          </Card>

          <Card className={styles.card} onClick={() => openModal("altura", altura.replace(" m", ""))}>
            <Title level={5}>Altura</Title>
            <Paragraph>{altura}</Paragraph>
          </Card>

          <Card className={styles.card} onClick={() => openModal("objetivo", objetivo.replace(" kg", ""))}>
            <Title level={5}>Objetivo</Title>
            <Paragraph>{objetivo}</Paragraph>
          </Card>

          <Card className={styles.card}>
            <Title level={5}>IMC</Title>
            <Paragraph>{imc}</Paragraph>
          </Card>

          <Card className={styles.cardStatus}>
            <Title level={5}>Status de Saúde</Title>
            <Paragraph strong style={{ color: "#1677ff" }}>
              {imcStatus ? imcStatus.status : "IMC inválido"}
            </Paragraph>
            <Paragraph type="secondary">
              {imcStatus ? imcStatus.message : "Preencha corretamente peso e altura para ver o status."}
            </Paragraph>
          </Card>
        </div>

        <Modal
          title={`Editar ${selectedCard}`}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleSave}
          okText="Salvar"
        >
          <Input
            placeholder="Digite o valor"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
          />
        </Modal>
      </Content>

      <BottomBar />
    </Layout>
  );
}
