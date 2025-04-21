"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, Image, Typography } from "antd";
import { authenticateUser } from "../utils/auth";
import styles from "./user.module.css";

export default function LoginSmart() {
  const { Text } = Typography;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [loginError, setLoginError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedUser = localStorage.getItem("user");
      if (loggedUser) router.push("/user/app");
    }
  }, []);
  

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((reg) => console.log("SW registered", reg))
        .catch((err) => console.error("SW registration failed", err));
    }
  }, []);


  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    setLoginError("");

    const user = await authenticateUser(values.email, values.password);

    setLoading(false);

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/user/app");
    } else {
      setLoginError("Usuário ou senha inválidos!");
    }
  };

  const regis = () => {
    router.push("register")
  }


  return (
    <div className={styles.container}>
      <Card className={styles.card}>

        <div className={styles.divlogo}>
          <Image className={styles.logo} src="images/logo.png" preview={false} />
        </div>
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item label="E-mail" name="email" rules={[{ required: true, message: "Digite seu e-mail!" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Senha" name="password" rules={[{ required: true, message: "Digite sua senha!" }]}>
            <Input.Password />
          </Form.Item>
          {loginError && <Text type="danger" style={{ marginBottom: "10px", display: "block" }}>{loginError}</Text>}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block className={styles.btn}>
              Entrar
            </Button>
          </Form.Item>
        </Form>

        <div className={styles.col}>
          <Text>Não tem uma conta?</Text>
          <Button className={styles.btn} onClick={regis}>
            <Text className={styles.textBtn}>Cadastre-se</Text>
          </Button>
        </div>
      </Card>
    </div>
  );
}