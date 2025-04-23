import React, { useState, useEffect } from 'react';
import { useParams } from "next/navigation";
import styles from './dieta.module.css';
import MainLayout from '@/app/sidebar/layout';
import { Modal, Typography, Input, TimePicker } from 'antd';
import dayjs from 'dayjs';
import api from '@/app/utils/axiosInstance'; 

type DietaData = {
    horario_cafe_da_manha?: string;
    cafe_da_manha?: string;
    horario_almoco?: string;
    almoco?: string;
    horario_lanche_da_tarde?: string;
    lanche_da_tarde?: string;
    horario_jantar?: string;
    jantar?: string;
    horario_ceia?: string;
    ceia?: string;
    horario_alternativo?: string;
    alternativo?: string;
    nome?: string;
    username?: string;
    email?: string;
};

const Dieta = () => {
    const { id } = useParams();
    const [dieta, setDieta] = useState<DietaData>({});
    const [nomeUsuario, setNomeUsuario] = useState<string>('');
    const [usernameUsuario, setUsernameUsuario] = useState<string>('');
    const [emailUsuario, setEmailUsuario] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDieta((prev) => ({ ...prev, [name]: value }));
    };

    const fetchDieta = async () => {
        try {
            const user = localStorage.getItem("user");
            const parsedUser = user ? JSON.parse(user) : null;
            const token = parsedUser?.token;

            if (!token) throw new Error("Token não encontrado.");

            const response = await api.get(`/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data;
            const dietaData: DietaData = {
                horario_cafe_da_manha: data.horario_cafe_da_manha || '',
                cafe_da_manha: data.cafe_da_manha || '',
                horario_almoco: data.horario_almoco || '',
                almoco: data.almoco || '',
                horario_lanche_da_tarde: data.horario_lanche_da_tarde || '',
                lanche_da_tarde: data.lanche_da_tarde || '',
                horario_jantar: data.horario_jantar || '',
                jantar: data.jantar || '',
                horario_ceia: data.horario_ceia || '',
                ceia: data.ceia || '',
                horario_alternativo: data.horario_alternativo || '',
                alternativo: data.alternativo || '',
                nome: data.nome || 'Usuário',
                username: data.username || 'Sem username',
                email: data.email || 'Sem email',
            };
            setDieta(dietaData);
            setNomeUsuario(data.nome || 'Usuário');
            setUsernameUsuario(data.username || 'Sem username');
            setEmailUsuario(data.email || 'Sem email');
        } catch (error) {
            console.error("Erro ao buscar dieta:", error);
        }
    };

    useEffect(() => {
        if (id) fetchDieta();
    }, [id]);

    const handleSubmit = async () => {
        try {
            const user = localStorage.getItem("user");
            const parsedUser = user ? JSON.parse(user) : null;
            const token = parsedUser?.token;

            if (!token) throw new Error("Token não encontrado.");

            const response = await api.put(`/users/${id}`, dieta, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = response.data;
            console.log('Resposta da API:', result);
            alert('Dieta atualizada com sucesso!');
            setIsModalOpen(false);
        } catch (error) {
            console.error('Erro ao salvar dieta', error);
            alert('Erro ao salvar dieta. Tente novamente.');
        }
    };

    const { TextArea } = Input;
    const { Text } = Typography;

    return (
        <MainLayout>
            <div className={styles.container}>
                <h2 className={styles.title}>Dieta do Aluno</h2>
                <p className={styles.user}><strong>Username:</strong> {usernameUsuario}</p>
                <p className={styles.user}><strong>Email:</strong> {emailUsuario}</p>

                <div className={styles.dietaPreview}>
                    {[
                        ['Café da Manhã', 'cafe_da_manha', 'horario_cafe_da_manha'],
                        ['Almoço', 'almoco', 'horario_almoco'],
                        ['Lanche da Tarde', 'lanche_da_tarde', 'horario_lanche_da_tarde'],
                        ['Jantar', 'jantar', 'horario_jantar'],
                        ['Ceia', 'ceia', 'horario_ceia'],
                        ['Alternativo', 'alternativo', 'horario_alternativo'],
                    ].map(([label, refeicao, horario]) => (
                        <div key={refeicao} className={styles.card}>
                            <strong>{label}</strong>
                            <p><strong>Horário:</strong> {dieta[horario as keyof DietaData] || 'Não informado'}</p>
                            <p><strong>Refeição:</strong> {dieta[refeicao as keyof DietaData] || 'Não informado'}</p>
                        </div>
                    ))}
                </div>

                <button className={styles.button} onClick={() => setIsModalOpen(true)}>
                    Editar Dieta
                </button>

                <Modal
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    onOk={handleSubmit}
                    title="Editar Dieta"
                    okText="Salvar"
                    cancelText="Cancelar"
                >
                    <div className={styles.modalContent}>
                        {[
                            ['Café da Manhã', 'cafe_da_manha', 'horario_cafe_da_manha'],
                            ['Almoço', 'almoco', 'horario_almoco'],
                            ['Lanche da Tarde', 'lanche_da_tarde', 'horario_lanche_da_tarde'],
                            ['Jantar', 'jantar', 'horario_jantar'],
                            ['Ceia', 'ceia', 'horario_ceia'],
                            ['Alternativo', 'alternativo', 'horario_alternativo'],
                        ].map(([label, refeicao, horario]) => (
                            <div key={refeicao} className={styles.modalSection}>
                                <strong>{label}</strong>
                                <TimePicker
                                    placeholder='Selecione o horário'
                                    name={horario}
                                    value={dieta[horario as keyof DietaData] ? dayjs(dieta[horario as keyof DietaData], 'HH:mm') : null}
                                    format="HH:mm"
                                    onChange={(time, timeString) =>
                                        handleChange({
                                            target: { name: horario, value: timeString },
                                        } as React.ChangeEvent<HTMLInputElement>)
                                    }
                                    style={{ marginBottom: 8, width: '100%' }}
                                />
                                <TextArea
                                    placeholder="Descrição da refeição"
                                    name={refeicao}
                                    value={dieta[refeicao as keyof DietaData] || ''}
                                    onChange={handleChange}
                                    rows={2}
                                />
                            </div>
                        ))}
                    </div>
                </Modal>
            </div>
        </MainLayout>
    );
};

export default Dieta;
