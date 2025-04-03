"use client"
import React, { useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";

import MainLayout from "@/app/sidebar/page";
import KanbanBoard from "../../../components/board/KanbanBoard";

interface Treino {
  id: string;
  nome: string;
}

export default function Treinos() {


  return (
    <MainLayout>
      <div className="container">
        <KanbanBoard />
      </div>
    </MainLayout>
  );
}
