'use client'
import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import Column from "../column/Column";
import styles from "./kanbanBoard.module.css";

interface Treino {
    id: string;
    title: string;
    content: string;
    dia: string; // Segunda, Terça, ..., Domingo
}

const diasDaSemana = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];

export default function KanbanBoard() {
    const [treinosPorDia, setTreinosPorDia] = useState<{ [key: string]: Treino[] }>({});

    const treinos = [
        { id: '1', title: 'Supino', content: '3x10', dia: 'segunda' },
        { id: '2', title: 'Agachamento', content: '4x8', dia: 'terca' },
        { id: '3', title: 'Rosca Direta', content: '3x12', dia: 'quarta' },
        { id: '4', title: 'Flexão', content: '3x15', dia: 'quinta' },
    ];

    useEffect(() => {
        const treinosOrganizados: { [key: string]: Treino[] } = {};
        diasDaSemana.forEach(dia => {
            treinosOrganizados[dia] = treinos.filter(treino => treino.dia === dia);
        });
        setTreinosPorDia(treinosOrganizados);
    }, []);

    const onDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;

        const origem = source.droppableId;
        const destino = destination.droppableId;

        if (origem === destino) {
            const reorderedList = Array.from(treinosPorDia[origem]);
            const [movedTreino] = reorderedList.splice(source.index, 1);
            reorderedList.splice(destination.index, 0, movedTreino);
            setTreinosPorDia(prev => ({ ...prev, [origem]: reorderedList }));
            return;
        }

        const treinoMovido = treinosPorDia[origem].find(treino => treino.id === draggableId);
        if (!treinoMovido) return;

        setTreinosPorDia(prev => ({
            ...prev,
            [origem]: prev[origem].filter(treino => treino.id !== draggableId),
            [destino]: [...prev[destino], { ...treinoMovido, dia: destino }]
        }));
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <h2 className={styles.container}>Treinos Semanais</h2>
            <div className={styles.board}>
                {diasDaSemana.map(dia => (
                    <Column key={dia} title={dia.toUpperCase()} tasks={treinosPorDia[dia] || []} id={dia} />
                ))}
            </div>
        </DragDropContext>
    );
}
