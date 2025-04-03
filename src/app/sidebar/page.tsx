"use client"
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  useEffect(() => {
    const pathname = window.location.pathname; // Acessando a URL atual
    if (pathname.includes("/home")) {
      setSelectedKey("1");
    } else if (pathname.includes("/alunos")) {
      setSelectedKey("2");
    } else if (pathname.includes("/configuracoes")) {
      setSelectedKey("3");
    }
  }, []); // Este efeito será chamado apenas uma vez, após o carregamento da página

  return (
    <Layout style={{ minHeight: "100vh" }} className={styles.container}>
      <Sider collapsible collapsed={collapsed} trigger={null} style={{
          backgroundColor: "white",
          borderRadius: "20px"
      }}>
        <div className={styles.logo}>
          <Image className={styles.img} src="images/logo.png" preview={false} />
        </div>
        <Menu selectedKeys={[selectedKey]} defaultSelectedKeys={["1"]}>
          <Menu.Item onClick={() => setCollapsed(!collapsed)} icon={
            collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
          } />
          <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => router.push("/home")}>
            Home
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />} onClick={() => router.push("/alunos")}>
            Alunos
          </Menu.Item>
          <Menu.Item key="3" icon={<SettingOutlined />} onClick={() => router.push("/configuracoes")}>
            Configurações
          </Menu.Item>
          <Menu.Item key="4" icon={<LogoutOutlined />} onClick={handleLogout}>
            Sair
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className={styles.header}>Bem-vindo!</Header>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
}
