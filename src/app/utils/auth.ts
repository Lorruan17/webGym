export const users = [
    { id: 1, email: "teste@email.com", password: "123456", name: "Lorruan" },
    { id: 2, email: "natasha@email.com", password: "abcdef", name: "Natasha" },
  ];
  
  export function authenticateUser(email: string, password: string) {
    return users.find((user) => user.email === email && user.password === password) || null;
  }
  