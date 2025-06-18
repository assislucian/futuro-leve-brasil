
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddTransactionDialog } from "./AddTransactionDialog";
import { AddGoalDialog } from "./AddGoalDialog";
import { DemoDataPopulator } from "./DemoDataPopulator";
import { useWealthJourneyTour } from "@/hooks/useWealthJourneyTour";
import { 
  Sparkles, 
  Target, 
  DollarSign, 
  BookOpen,
  TrendingUp,
  Heart,
  ArrowRight,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";

export function WelcomeGuide() {
  const [showDemo, setShowDemo] = useState(false);
  const { restartTour } = useWealthJourneyTour();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header de Boas-vindas */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Bem-vindo ao Plenus
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sua jornada para a <span className="text-emerald-600">plenitude financeira</span> começa aqui
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transforme sua relação com o dinheiro e alcance seus sonhos. 
            Vamos te guiar passo a passo nesta jornada.
          </p>
        </div>

        {/* Tour Recomendado */}
        <Card className="mb-8 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl text-emerald-800">
              Jornada Plenus Recomendada
            </CardTitle>
            <CardDescription className="text-emerald-700">
              Uma experiência educativa completa para você dominar todas as funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Lightbulb className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <span className="text-gray-700">No seu ritmo</span>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Target className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span className="text-gray-700">Educativo e prático</span>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Heart className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span className="text-gray-700">Focado em resultados</span>
              </div>
            </div>
            
            <Button 
              onClick={restartTour}
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Começar Jornada Plenus
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <p className="text-sm text-emerald-700">
              ⏱️ Demora apenas 5-10 minutos e vai transformar como você usa o Plenus
            </p>
          </CardContent>
        </Card>

        {/* Opções Rápidas */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-blue-200 hover:border-blue-300 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Começar adicionando transações</CardTitle>
                  <CardDescription>
                    Adicione suas receitas e despesas para ter controle total
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AddTransactionDialog>
                <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Adicionar Primeira Transação
                </Button>
              </AddTransactionDialog>
            </CardContent>
          </Card>

          <Card className="border-purple-200 hover:border-purple-300 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Definir seus objetivos</CardTitle>
                  <CardDescription>
                    Crie metas financeiras e veja como alcançá-las
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AddGoalDialog>
                <Button variant="outline" className="w-full border-purple-200 hover:bg-purple-50">
                  <Target className="h-4 w-4 mr-2" />
                  Criar Primeira Meta
                </Button>
              </AddGoalDialog>
            </CardContent>
          </Card>
        </div>

        {/* Dados de Demonstração */}
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Explorar com dados de exemplo</CardTitle>
                  <CardDescription>
                    Veja como o Plenus funciona com dados realistas
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                Recomendado
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-amber-800 bg-amber-100 p-3 rounded-lg">
              💡 <strong>Dica:</strong> Os dados de exemplo ajudam você a entender todas as funcionalidades 
              antes de adicionar suas informações reais. Você pode removê-los a qualquer momento.
            </p>
            
            {!showDemo ? (
              <Button 
                onClick={() => setShowDemo(true)}
                variant="outline" 
                className="w-full border-amber-300 hover:bg-amber-50"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Ver Opções de Demonstração
              </Button>
            ) : (
              <div className="space-y-3">
                <DemoDataPopulator />
                <Button 
                  onClick={() => setShowDemo(false)}
                  variant="ghost" 
                  size="sm"
                  className="w-full text-amber-700 hover:bg-amber-50"
                >
                  Ocultar opções
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer com dica */}
        <div className="text-center mt-8 p-6 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600">
            <strong>💭 Lembre-se:</strong> A transformação financeira é uma jornada, não um destino. 
            O Plenus está aqui para te apoiar em cada passo. Comece hoje, mesmo que seja pequeno.
          </p>
        </div>
      </div>
    </div>
  );
}
