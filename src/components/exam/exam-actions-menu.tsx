"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import api from "@/lib/axios";

interface ExamActionsMenuProps {
  examId: string;
  mutateQuestions: () => void;
}

export function ExamActionsMenu({
  examId,
  mutateQuestions,
}: ExamActionsMenuProps) {
  async function handleMarkAsApplied() {
    try {
      await api.patch(`/exams/${examId}/apply/`);
    } catch (error) {}
  }

  async function handleMArkAsArchived() {
    try {
      await api.patch(`/exams/${examId}/archive/`);
    } catch (error) {}
  }
  async function handleMarkAsCancelled() {
    try {
      await api.patch(`/exams/${examId}/cancel/`);
    } catch (error) {}
  }

  async function handleDelete() {
    try {
      await api.delete(`/exams/${examId}`);
      mutateQuestions();
    } catch (error) {}
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleMArkAsArchived}>
          Arquivar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleMarkAsCancelled}>
          Cancelar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleMarkAsApplied}>
          Marcar como aplicado
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete}>Deletar</DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
