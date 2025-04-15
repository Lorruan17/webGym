'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import styles from './exer.module.css'

export default function TreinoDetalhe() {
  const [treino, setTreino] = useState<any>(null)
  const params = useParams()
  const id = params?.id as string // Pega o id da URL

  useEffect(() => {
    const fetchTreino = async () => {
      if (!id) {
        console.error('ID do treino não foi fornecido!');
        return;
      }

      const token = JSON.parse(localStorage.getItem('user') as string)?.token;

      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      try {
        const response = await fetch(`http://192.168.1.6:3000/treino/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('Erro ao buscar os detalhes do treino');
          return;
        }

        const data = await response.json();
        setTreino(data);
      } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
      }
    };

    fetchTreino();
  }, [id]);

  if (!treino) return <p className={styles.loading}>Carregando...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{treino.nome}</h1>
      <p className={styles.description}>{treino.descricao}</p>
    </div>
  );
}
