"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, Image, Typography } from "antd";
import { authenticateUser } from "../utils/auth";
import styles from "./login.module.css";
import TestApi from "./TestApi";

export default function LoginPage() {
  const { Text } = Typography;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [loginError, setLoginError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) router.push("/home"); // Se já estiver logado, vai pra home
  }, []);
  

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    setLoginError("");
  
    const user = await authenticateUser(values.email, values.password);
    
    setLoading(false);
    localStorage.setItem("user", JSON.stringify(user));

  
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/home");
    } else {
      setLoginError("Usuário ou senha inválidos!");
    }
  };
  

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.duo}>
          <div className={styles.left}>
            <div className={styles.divlogo}>
              <Image className={styles.logo} src="images/logo.png" preview={false}/>
            </div>
            <Form form={form} layout="vertical" onFinish={onFinish}>
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
          </div>
          <div className={styles.right}>
            <Image className={styles.image} src="images/tela.jpg" preview={false} />
            <Text>Não tem uma conta?</Text>
            <Button className={styles.btn}>
              <Text className={styles.textBtn}>Cadastre-se</Text>
            </Button>
          </div>

        </div>
      </Card>
    </div>
  );
}