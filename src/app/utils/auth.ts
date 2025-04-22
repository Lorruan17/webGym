// auth.ts
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: number
  name: string;
  email: string;
  roles: number[];
  parceira: number;
  sub: number;
  iat: number;
  exp: number;
}

export const getUser = (): any => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

export const getAccessToken = (): string | null => {
  const user = getUser();
  return user?.token || null;
};

export const getRefreshToken = (): string | null => {
  const user = getUser();
  return user?.refreshToken || null;
};

export const setAuthTokensInUser = (accessToken: string, refreshToken?: string) => {
  if (typeof window !== "undefined") {
    const user = getUser() || {};
    user.token = accessToken;
    if (refreshToken) {
      user.refreshToken = refreshToken;
    }
    localStorage.setItem("user", JSON.stringify(user));
  }
};

export const clearAuthTokens = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
};

export async function authenticateUser(email: string, password: string) {
  console.log("Função authenticateUser chamada com:", email, password);
  console.log("URL da API que será usada:", `${process.env.NEXT_PUBLIC_API_URL}/auth/login`);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const responseText = await response.text();
    console.log("Texto cru da resposta:", responseText);

    if (!response.ok) {
      console.warn("Resposta da API com erro:", responseText);
      return null;
    }

    const data = JSON.parse(responseText);
    console.log("Resposta da API (parseada):", data);

    try {
      const decoded = jwtDecode<DecodedToken>(data.token);
      console.log("Token decodificado:", decoded);

      const userData = {
        token: data.token,
        refreshToken: data.refreshToken, // Assumindo que a API retorna refreshToken
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        roles: decoded.roles,
        parceira: decoded.parceira,
      };

      console.log("Dados do usuário:", userData);

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("Usuário salvo no localStorage:", userData);

        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          console.log("Verificação do localStorage (parseado):", JSON.parse(savedUser));
        } else {
          console.warn("Nada foi salvo no localStorage.");
        }
      } else {
        console.error("localStorage não está disponível.");
      }

      return userData;

    } catch (parseError) {
      console.error("Erro ao fazer parse do JSON:", parseError);
      return null;
    }

  } catch (err) {
    console.error("Erro no login:", err);
    return null;
  }
}