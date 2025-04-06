"use client";
import { useEffect, useState } from "react";
import { Typography, Spin, Alert } from "antd"; // Importando componentes do Ant Design
import { getUserById } from "@/app/utils/api"; // Função para pegar usuário por ID
import MainLayout from "../sidebar/page";

const { Title, Text } = Typography;

export default function UsuarioPage() {
    const [usuario, setUsuario] = useState<any>(null);  // Estado para armazenar os dados do usuário
    const [loading, setLoading] = useState(false);      // Estado para controle de carregamento
    const [error, setError] = useState<string>("");     // Estado para armazenar erros, caso ocorram

    // Função para buscar o usuário com ID 1
    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                setLoading(true);

                // Obtendo o objeto 'user' do localStorage e extraindo o token
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                const token = user.token;  // Acessando o token dentro de 'user'

                if (!token) {
                    throw new Error("Token não encontrado. Faça o login.");
                }

                console.log("Token aqui zé:", token); // Verificando se o token está correto no console

                // Buscar o usuário com ID 1
                const response = await getUserById(6, token);  // Chame a função passando o ID 1
                setUsuario(response);  // Armazena o usuário no estado
            } catch (error: any) {
                console.error("Erro ao buscar os dados:", error);  // Exibe erro completo no console
                setError(error?.response?.data?.message || error.message || "Erro desconhecido");  // Exibe a mensagem de erro específica, se disponível
            } finally {
                setLoading(false);  // Finaliza o carregamento
            }
        };

        fetchUsuario();  // Chama a função para buscar o usuário
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <Spin size="large" /> {/* Exibe um carregamento enquanto busca os dados */}
            </div>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <div style={{ marginTop: "50px", textAlign: "center" }}>
                    <Alert message="Erro" description={error} type="error" showIcon />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div style={{ padding: "20px" }}>
                <Title level={4}>Detalhes do Usuário</Title>
                {usuario && (
                    <div>
                        <Text strong>Nome:</Text> <Text>{usuario.username}</Text>
                        <br />
                        <Text strong>Email:</Text> <Text>{usuario.email}</Text>
                        <br />
                        <Text strong>Telefone:</Text> <Text>{usuario.ter_ex}</Text> {/* Exemplo com telefone, ajuste conforme a resposta da API */}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
