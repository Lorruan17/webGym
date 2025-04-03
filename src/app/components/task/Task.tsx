import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import styles from "./task.module.css";

interface TaskProps {
    task: {
        title: string;
        id: string;
        content: string;
    };
    index: number;
}

export default function Task({ task, index }: TaskProps) {
    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided) => (
                <div
                    className={styles.container}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <div className={styles.header}>
                        <small>#{task.id}</small>
                    </div>
                    <div className={styles.content}>
                        {task.title}
                    </div>
                </div>
            )}
        </Draggable>
    );
}
