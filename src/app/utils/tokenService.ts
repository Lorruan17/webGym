const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const refreshTokenRequest = async (refreshToken: string | undefined): Promise<{ token: string } | null> => {
  if (!refreshToken) {
    console.error('Não há refresh token para renovar.');
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/token/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error('Erro ao renovar o token:', response.status);
      // Aqui você pode decidir se quer lançar um erro ou retornar null
      return null;
    }
  } catch (error) {
    console.error('Erro ao fazer a requisição de refresh token:', error);
    return null;
  }
};