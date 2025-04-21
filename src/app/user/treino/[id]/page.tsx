'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import styles from './exer.module.css'
import { Button, Typography } from 'antd'

export default function TreinoDetalhe() {
  const [treino, setTreino] = useState<any>(null)
  const [usuario, setUsuario] = useState<any>(null)
  const [imageIndex, setImageIndex] = useState(0)
  const params = useParams()
  const id = params?.id as string

  useEffect(() => {
    const fetchTreino = async () => {
      if (!id) return;

      const userStorage = JSON.parse(localStorage.getItem('user') as string);
      const token = userStorage?.token;
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
        console.error('Erro ao buscar treino:', error);
      }
    };

    fetchTreino();
  }, [id]);

  useEffect(() => {
    const fetchUsuario = async () => {
      const userStorage = JSON.parse(localStorage.getItem('user') as string);
      const token = userStorage?.token;
      const userId = userStorage?.id;
  
      if (!token || !userId) return;
  
      try {
        const response = await fetch(`http://192.168.1.6:3000/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Dados do usuário:', data); // Adicione o log aqui
          setUsuario(data);
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    };
  
    fetchUsuario();
  }, []);
  

  useEffect(() => {
    if (!treino?.url_image || treino.url_image.length === 0) return;

    const interval = setInterval(() => {
      setImageIndex((prevIndex) =>
        prevIndex + 1 < treino.url_image.length ? prevIndex + 1 : 0
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [treino]);

  if (!treino || !usuario) return <p className={styles.loading}>Carregando...</p>;

  const { Text } = Typography;

  const renderSeriesRepeticoes = () => {
    const diasSemanaMap: { [key: number]: string } = {
      0: 'dom_s_r',
      1: 'seg_s_r',
      2: 'ter_s_r',
      3: 'qua_s_r',
      4: 'qui_s_r',
      5: 'sex_s_r',
      6: 'sáb_s_r',
    };

    const hoje = new Date().getDay();
    const campoHoje = diasSemanaMap[hoje];
    const infoHoje = usuario[campoHoje];
    if (infoHoje && infoHoje.length === 2) {
      const [series, repeticoes] = infoHoje;
      return (
        <Text className={styles.textRep}>
          {series} Série{series !== '1' ? 's' : ''} de {repeticoes} Repetição{repeticoes !== '1' ? 'es' : ''}
        </Text>
      );
    }

    return null;
  };

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

      {renderSeriesRepeticoes()}

      <Button className={styles.btn}>
        <Text className={styles.textBtn}>Finalizar</Text>
      </Button>
    </div>
  );
}
