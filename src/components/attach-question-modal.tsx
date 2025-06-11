"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuestionProps } from "@/@types/QuestionProps";
import api from "@/lib/axios";
import { ExamsPageProps } from "@/app/exams/page";

interface AttachQuestionModalProps {
  question: QuestionProps;
  exams?: ExamsPageProps;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: () => void;
}

export function AttachQuestionModal({
  question,
  exams,
  isOpen,
  onClose,
  onSuccess,
  onError,
}: AttachQuestionModalProps) {
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAttachQuestion = async () => {
    if (!selectedExam) return;
    setIsLoading(true);
    try {
      await api.post(`/exams/${selectedExam}/questions/`, {
        question_id: question.id,
      });
      onSuccess();
      onClose();
    } catch (error) {
      onError();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Anexar Questão à Prova</DialogTitle>
          <DialogDescription>
            Selecione a prova para anexar esta questão
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma prova" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              {exams?.results.length &&
                exams.results.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.title}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleAttachQuestion}
            disabled={!selectedExam || isLoading}
          >
            {isLoading ? "Anexando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
