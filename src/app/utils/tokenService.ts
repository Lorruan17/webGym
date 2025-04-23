const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const refreshTokenRequest = async (refreshToken: string | undefined): Promise<{ token: string } | null> => {
  if (!refreshToken) {
    console.error('Não há refresh token para renovar.');
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/token/refresh`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ oldToken: refreshToken }), // <- nome correto do campo
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('Erro ao renovar o token:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Erro ao fazer a requisição de refresh token:', error);
    return null;
  }
};
