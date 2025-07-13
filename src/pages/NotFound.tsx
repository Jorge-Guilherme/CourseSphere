import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card";
import { AlertTriangle, Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-dark">
      <Card className="p-8 max-w-md w-full">
        <CardHeader className="flex flex-col items-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
          <CardTitle className="text-center">Página não encontrada</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-muted-foreground">
            A página que você está procurando não existe ou foi movida.<br />
            Verifique o endereço e tente novamente.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/dashboard">
                <Home className="h-4 w-4 mr-2" />
                Ir para o Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/login">
                Fazer Login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
