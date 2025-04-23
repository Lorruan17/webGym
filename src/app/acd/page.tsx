"use client";
import React, { useState, useEffect } from 'react';
import styles from './acd.module.css';
import api from '../utils/axiosInstance';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/academia`;

interface User {
    id: number;
    email: string;
    roles: number[];
    token?: string; 
}

const CreateGymPage: React.FC = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null); 

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        if (!user?.token) {
            setError('Usuário não autenticado ou token não encontrado.');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post(API_URL, {
                nome: name,
                valor: parseInt(price, 10),
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`, // Inclui o token no header
                },
            });

            if (response.status === 200) {
                console.log('Academia criada com sucesso:', response.data);
                setSuccessMessage('Academia criada com sucesso!');
                setName('');
                setPrice('');
            } else {
                console.error('Erro ao criar academia:', response.data);
                setError(response.data.message || 'Erro ao criar academia. Por favor, tente novamente.');
            }
        } catch (error) {
            console.error('Erro de rede ao criar academia:', error);
            setError('Erro de rede ao criar academia. Por favor, verifique sua conexão.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Criar Nova Academia</h1>
            {successMessage && <p className={styles.success}>{successMessage}</p>}
            {error && <p className={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label htmlFor="name">Nome:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="price">Valor:</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>
                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Criando...' : 'Criar Academia'}
                </button>
            </form>
        </div>
    );
};

export default CreateGymPage;
