'use client'
import React, { useState } from "react"
import { Droppable } from "@hello-pangea/dnd"
import styled from "styled-components"
import Task from "../task/Task"

interface ColumnProps {
    title: string;
    tasks: any[];
    id: string;
}


const Container = styled.div`
    background-color : #f4f5f7;
    border-radius: 2.5px;
    width: 300px;
    height: 475px;
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
    border: 1px solid gray;
`
const Title = styled.h3`
    padding: 8px;
    background-color: pink;
    text-align: center;
`
const TalkList = styled.div`
    padding: 3px;
    background-color: #f4f5f7;
    flex-grow: 1;
    min-height: 100px;
`

const Column: React.FC<ColumnProps> = ({ title, tasks, id }) => {


    return (
        <Container>
            <Title
                style={{
                    backgroundColor: 'lightblue',
                    position: 'sticky',
                }}
            >
                {title}
            </Title>
            <Droppable direction="vertical" droppableId={id} isDropDisabled={false} isCombineEnabled={true} ignoreContainerClipping={false}>
                {(provided, snapshot) => (
                    <TalkList
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {
                            tasks.map((task, index) => (
                                <Task key={task.id} index={index} task={task} />
                            ))
                        }
                        {provided.placeholder}
                    </TalkList>
                )}
            </Droppable>
        </Container>
    );
};

export default Column;