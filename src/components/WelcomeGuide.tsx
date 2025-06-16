
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddTransactionDialog } from "./AddTransactionDialog";
import { DemoDataPopulator } from "./DemoDataPopulator";
import { Sparkles, Target, PieChart, TrendingUp, Database } from "lucide-react";

/**
 * Guia de boas-vindas para usuários sem transações
 * Incentiva as primeiras ações no app
 */
export function WelcomeGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header de boas-vindas */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Bem-vindo ao Plenus! 🎉
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Sua jornada para a plenitude financeira começa agora. Vamos transformar seus sonhos em metas alcançáveis!
            </p>
          </div>
        </div>

        {/* Opções de início */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Opção 1: Começar do zero */}
          <Card className="border-2 border-emerald-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
              <CardTitle className="text-xl text-emerald-800">
                Começar Minha Jornada
              </CardTitle>
              <CardDescription className="text-gray-600">
                Adicione sua primeira transação e comece a organizar suas finanças
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <AddTransactionDialog />
              <p className="text-sm text-gray-500 mt-3">
                Pode ser algo simples como o café da manhã!
              </p>
            </CardContent>
          </Card>

          {/* Opção 2: Explorar com dados demo */}
          <Card className="border-2 border-blue-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto">
                <Database className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-blue-800">
                Explorar com Dados Demo
              </CardTitle>
              <CardDescription className="text-gray-600">
                Experimente todas as funcionalidades com dados de exemplo realistas
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <DemoDataPopulator />
              <p className="text-sm text-gray-500 mt-3">
                Perfeito para conhecer o sistema completo
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Próximos passos */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Sparkles className="h-5 w-5 text-purple-600" />
              O que você pode fazer no Plenus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Controle Total</h3>
                <p className="text-sm text-gray-600">
                  Acompanhe receitas, despesas e veja para onde seu dinheiro está indo
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Realize Sonhos</h3>
                <p className="text-sm text-gray-600">
                  Transforme seus objetivos em metas financeiras concretas e alcançáveis
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto">
                  <PieChart className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Planeje Gastos</h3>
                <p className="text-sm text-gray-600">
                  Crie orçamentos inteligentes e mantenha suas finanças organizadas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to action final */}
        <div className="text-center space-y-4 py-6">
          <p className="text-gray-600">
            💡 <strong>Dica:</strong> Comece pequeno e vá crescendo. Cada passo conta na sua jornada financeira!
          </p>
        </div>
      </div>
    </div>
  );
}
