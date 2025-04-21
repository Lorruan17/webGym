"use client";
import { useEffect, useState } from "react";
import BottomBar from "../components/botom/BottomBar";
import { Typography, Layout, Card, Modal, Input } from "antd";
import styles from "./app.module.css";
import Title from "antd/es/typography/Title";
import { SlEnergy } from "react-icons/sl";


const { Text, Paragraph } = Typography;
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
    console.log("pesoNum:", pesoNum, "alturaNum:", alturaNum, "imc:", imc);
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
    <Layout style={{ minHeight: "100vh" }}>
      <Content className={styles.content}>
        <div className={styles.cont}>
          <div style={{flexDirection: 'row', display: 'flex'}}>
          <Title className={styles.font}>
            Bem-vindo{name ? `, ${name}` : ""}!
          </Title>
          <SlEnergy className={styles.icon} />
          </div>
          <div className={styles.cardList}>
            <Card className={styles.card} onClick={() => openModal("peso", peso.replace(" kg", ""))}>
              <Text className={styles.sub} >Peso</Text>
              <Paragraph className={styles.sub}>{peso}</Paragraph>
            </Card>

            <Card className={styles.card} onClick={() => openModal("altura", altura.replace(" m", ""))}>
              <Text className={styles.sub} >Altura</Text>
              <Paragraph className={styles.sub}>{altura}</Paragraph>
            </Card>

            <Card className={styles.card} onClick={() => openModal("objetivo", objetivo.replace(" kg", ""))}>
              <Text className={styles.sub} >Objetivo</Text>
              <Paragraph className={styles.sub}>{objetivo}</Paragraph>
            </Card>

            <Card className={styles.card}>
              <Text className={styles.sub} >IMC</Text>
              <Paragraph className={styles.sub}>{imc}</Paragraph>
            </Card>

            <Card className={styles.cardStatus}>
              <Text className={styles.sub} >Status de Saúde</Text>
              <Paragraph strong style={{ color: "#1677ff" }}>
                {imcStatus ? imcStatus.status : "IMC inválido"}
              </Paragraph>
              <Paragraph type="secondary">
                {imcStatus ? imcStatus.message : "Preencha corretamente peso e altura para ver o status."}
              </Paragraph>
            </Card>
          </div>
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