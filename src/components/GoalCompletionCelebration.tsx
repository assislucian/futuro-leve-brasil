
import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGoalCompletion } from '@/hooks/useGoalCompletion';
import { Trophy, Loader2 } from 'lucide-react';

export const GoalCompletionCelebration = () => {
  const { completableGoal, markAsCelebrated, isMarkingAsCelebrated } = useGoalCompletion();
  const [isOpen, setIsOpen] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Acompanha o tamanho da janela para o efeito de confete
    const handleResize = () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Define o tamanho inicial
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Abre o modal de celebração se houver uma meta concluída
    if (completableGoal) {
      setIsOpen(true);
    }
  }, [completableGoal]);

  const handleClose = () => {
    if (completableGoal) {
      markAsCelebrated(completableGoal.id, {
        onSuccess: () => {
          setIsOpen(false);
        }
      });
    }
  };

  if (!isOpen || !completableGoal) {
    return null;
  }

  return (
    <>
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={500}
        tweenDuration={10000}
        gravity={0.15}
      />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()} className="text-center p-8">
          <DialogHeader className="items-center">
            <Trophy className="h-20 w-20 text-amber-400 mb-4 animate-bounce" />
            <DialogTitle className="text-3xl font-bold text-gray-800">Parabéns! Você Conseguiu!</DialogTitle>
            <DialogDescription className="text-lg mt-2">
              Você alcançou sua meta: <span className="font-semibold text-primary">{completableGoal.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">Todo seu esforço e disciplina valeram a pena. Celebre esta grande conquista. Você está um passo mais perto de realizar seus maiores sonhos!</p>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button onClick={handleClose} size="lg" disabled={isMarkingAsCelebrated}>
              {isMarkingAsCelebrated && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continuar minha jornada!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
