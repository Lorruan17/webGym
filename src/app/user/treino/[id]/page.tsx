'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import styles from './exer.module.css'
import { Button, Typography, message } from 'antd'
import api from '@/app/utils/axiosInstance'

interface TreinoFinalizadoInfo {
  id: number;
  dataFinalizacao: string;
}

export default function TreinoDetalhe() {
  const [treino, setTreino] = useState<any>(null)
  const [usuario, setUsuario] = useState<any>(null)
  const [imageIndex, setImageIndex] = useState(0)
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const finalizarTreino = () => {
    if (!treino) return;

    const hoje = new Date().toISOString().split('T')[0];
    const treinoFinalizadoInfo: TreinoFinalizadoInfo = {
      id: treino.id,
      dataFinalizacao: hoje,
    };

    const treinosFinalizadosHoje = JSON.parse(localStorage.getItem('treinosFinalizadosHoje') || '[]');
    const jaFinalizadoHoje = treinosFinalizadosHoje.some(
      (t: TreinoFinalizadoInfo) => t.id === treino.id && t.dataFinalizacao === hoje
    );

    if (!jaFinalizadoHoje) {
      treinosFinalizadosHoje.push(treinoFinalizadoInfo);
      localStorage.setItem('treinosFinalizadosHoje', JSON.stringify(treinosFinalizadosHoje));
    }

    router.push('/user/treino');
  };

  useEffect(() => {
    const fetchTreino = async () => {
      if (!id) return;

      const userStorage = JSON.parse(localStorage.getItem('user') as string);
      const token = userStorage?.token;
      if (!token) return;

      try {
        const response = await api.get(`/treino/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setTreino(response.data);
        }
      } catch (error) {
        console.error('Erro ao buscar treino:', error);
        message.error('Erro ao carregar treino.');
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
        const response = await api.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setUsuario(response.data);
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        message.error('Erro ao carregar dados do usuário.');
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

    const hojeDaSemana = new Date().getDay();
    const campoHoje = diasSemanaMap[hojeDaSemana];
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

      <Button className={styles.btn} onClick={finalizarTreino}>
        <Text className={styles.textBtn}>Finalizar</Text>
      </Button>
    </div>
  );
}