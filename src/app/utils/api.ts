import axios from 'axios';

// Criando uma instância do axios com a base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,  // Base URL da sua API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função para pegar os treinos
export const getTreinos = async (token: string) => {
  try {
    const response = await api.get('/treino', {
      headers: {
        'Authorization': `Bearer ${token}`,  // Passando o token de autenticação
      },
    });
    return response.data;  // Retorna os dados da resposta
  } catch (error: any) {
    console.error("Erro ao buscar os treinos:", error.response || error.message);  // Exibe mais detalhes no console
    throw new Error(error?.response?.data?.message || "Erro ao buscar os dados");
  }
};

// Função para pegar o usuário por ID
export const getUserById = async (id: number, token: string) => {
  try {
    const response = await api.get(`/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Passando o token de autenticação
      },
    });
    return response.data;  // Retorna os dados do usuário
  } catch (error: any) {
    // Logando a resposta completa do erro
    console.error("Erro ao buscar o usuário:", error.response || error.message);
    throw new Error(error?.response?.data?.message || "Erro ao buscar os dados do usuário");
  }
};

export default api;
