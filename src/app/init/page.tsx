"use client";

import { useRouter } from "next/navigation";
import { Button, Card, Typography } from "antd";
import styles from "./init.module.css";

export default function Init() {
  const router = useRouter();

  const handleRedirect = (role: string) => {
    if (role === "admin") {
      router.push("/login");
    } else if (role === "user") {
      router.push("/user");
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Typography.Title level={2}>Como deseja entrar?</Typography.Title>
        <div className={styles.buttons}>
          <Button type="primary" size="large" onClick={() => handleRedirect("user")}className={styles.color}>
            Usuário
          </Button>
          <Button type="default" size="large" onClick={() => handleRedirect("admin")} >
            Administrador
          </Button>
        </div>
      </Card>
    </div>
  );
}
