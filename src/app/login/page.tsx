"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, Image, Typography } from "antd";
import { authenticateUser } from "../utils/auth";
import styles from "./login.module.css";

export default function LoginPage() {
  const { Text } = Typography;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [loginError, setLoginError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      // Verifique a role ao carregar a página também
      if (user.role === 1 || user.role === 2) {
        router.push("/home");
      } else {
        // Opcional: você pode definir um estado ou comportamento aqui se um usuário não administrador estiver logado
        console.log("Usuário logado não tem permissão para acessar /home");
        // Talvez deslogar o usuário ou mostrar uma mensagem específica
      }
    }
  }, [router]);


  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    setLoginError("");

    const user = await authenticateUser(values.email, values.password);

    setLoading(false);

    if (user) {
      // Verifique se o array de roles contém 1 ou 2
      if (user.roles && (user.roles.includes(1) || user.roles.includes(2) || user.roles.includes(4))) {
        localStorage.setItem("user", JSON.stringify(user));
        router.push("/home");
      } else {
        setLoginError("Página permitida somente para administradores!");
        localStorage.removeItem("user"); // Opcional: desloga o usuário se não for admin
      }
    } else {
      setLoginError("Usuário ou senha inválidos!");
    }
  };

  const regis = () => {
    router.push("register");
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.duo}>
          <div className={styles.left}>
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
          </div>
          <div className={styles.right}>
            <Image className={styles.image} src="images/tela.jpg" preview={false} />
            <Text>Não tem uma conta?</Text>
            <Button className={styles.btn} onClick={regis}>
              <Text className={styles.textBtn}>Cadastre-se</Text>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}