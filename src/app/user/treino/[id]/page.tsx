'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import styles from './exer.module.css'
import { Button, Typography } from 'antd'

export default function TreinoDetalhe() {
  const [treino, setTreino] = useState<any>(null)
  const [imageIndex, setImageIndex] = useState(0)
  const params = useParams()
  const id = params?.id as string

  useEffect(() => {
    const fetchTreino = async () => {
      if (!id) return;

      const token = JSON.parse(localStorage.getItem('user') as string)?.token;
      if (!token) return;

      try {
        const response = await fetch(`http://192.168.1.6:3000/treino/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setTreino(data);
        }
      } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
      }
    };

    fetchTreino();
  }, [id]);

  // Lógica para trocar a imagem a cada segundo
  useEffect(() => {
    if (!treino?.url_image || treino.url_image.length === 0) return;

    const interval = setInterval(() => {
      setImageIndex((prevIndex) =>
        prevIndex + 1 < treino.url_image.length ? prevIndex + 1 : 0
      );
    }, 1000);

    return () => clearInterval(interval); // limpar intervalo ao desmontar
  }, [treino]);

  if (!treino) return <p className={styles.loading}>Carregando...</p>;

  const { Text } = Typography

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{treino.nome}</h1>

      {treino.url_image?.length > 0 && (
        <img
          src={treino.url_image[imageIndex]}
          alt={`Imagem ${imageIndex + 1}`}
          className={styles.image}
        />
      )}
      <p className={styles.description}>{treino.descricao}</p>
      <Text className={styles.textRep}>4 Séries de 10 Repetições</Text>
      <Button className={styles.btn}>
        <Text className={styles.textBtn}>Finalizar</Text>
      </Button>
    </div>
  );
}
