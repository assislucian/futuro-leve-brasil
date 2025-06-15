
import { AddTransactionDialog } from "./AddTransactionDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";

export const WelcomeGuide = () => {
    const { user } = useAuth();
    const firstName = user?.user_metadata.full_name?.split(' ')[0] || 'pessoa';

    return (
        <div className="flex justify-center items-center h-full py-12">
            <Card className="w-full max-w-2xl text-center shadow-lg animate-in fade-in-50 duration-500">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                       <Sparkles className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold">Bem-vindo(a) ao Plenus, {firstName}!</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground pt-2">
                        Sua jornada para a plenitude financeira começa agora. <br/> O primeiro passo é simples: adicione sua primeira transação.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                        Clique no botão abaixo para registrar uma receita ou despesa. 
                        Isso nos ajudará a criar seu primeiro resumo financeiro e a traçar o mapa para seus sonhos.
                    </p>
                    <AddTransactionDialog>
                       <Button size="lg">
                            Adicionar Primeira Transação
                            <ArrowRight className="ml-2 h-5 w-5" />
                       </Button>
                    </AddTransactionDialog>
                </CardContent>
            </Card>
        </div>
    )
}
