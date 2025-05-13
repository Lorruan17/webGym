"use client";
import React from "react";
import { ReactNode, useState, useEffect } from "react";
import { Image, Layout, Menu } from "antd";
import { useRouter } from "next/navigation";
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import styles from "./layout.module.css";

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>("1");
  const [name, setName] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      const firstName = parsedUser?.name?.split(" ")[0] || null;
      setName(firstName);
    }
  }, []);

  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname.includes("/home")) {
      setSelectedKey("1");
    } else if (pathname.includes("/alunos")) {
      setSelectedKey("2");
    } else if (pathname.includes("/configuracoes")) {
      setSelectedKey("3");
    }
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }} className={styles.container}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        style={{ backgroundColor: "white", borderRadius: "20px" }}
      >
        <div className={styles.logo}>
          <Image className={styles.img} src="/images/logo.png" preview={false} />
        </div>
        <Menu selectedKeys={[selectedKey]} mode="inline">
          <Menu.Item
            key="toggle"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            title="Expandir/Reduzir"
          />
          <Menu.Item
            key="1"
            icon={<HomeOutlined />}
            onClick={() => router.push("/home")}
            title="Página Inicial"
          >
            Home
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<UserOutlined />}
            onClick={() => router.push("/alunos")}
            title="Alunos"
          >
            Alunos
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<SettingOutlined />}
            onClick={() => router.push("/configuracoes")}
            title="Configurações"
          >
            Configurações
          </Menu.Item>
          <Menu.Item
            key="4"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            title="Sair"
          >
            Sair
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className={styles.header}>
          Seja bem-vindo{name ? `, ${name}` : ""}!
        </Header>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
}
