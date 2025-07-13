import { Button } from '@/components/atoms/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/molecules/card';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-dark">
      <Card className="p-8 max-w-md w-full">
        <CardHeader className="flex flex-col items-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
          <CardTitle className="text-center">Acesso Negado</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-muted-foreground">
            Você não tem permissão para acessar esta página ou realizar esta ação.<br />
            Se acredita que isso é um erro, entre em contato com o administrador.
          </p>
          <Button asChild variant="outline">
            <Link to="/dashboard">Voltar para o Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 