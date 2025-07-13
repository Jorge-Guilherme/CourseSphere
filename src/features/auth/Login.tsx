import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/contexts/AuthContext';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/molecules/card';
import { Alert, AlertDescription } from '@/components/molecules/alert';
import { Eye, EyeOff, BookOpen, Users, GraduationCap } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user, login } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  // Redirecionar se já estiver logado
  if (user) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  const validateForm = () => {
    if (!email || !password) {
      setError('Todos os campos são obrigatórios');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email deve ter um formato válido');
      return false;
    }
    
    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao CourseSphere",
        });
      } else {
        setError('Email ou senha incorretos');
      }
    } catch (error) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [

  ];

  return (
    <div className="min-h-screen bg-gradient-dark flex">
      {/* Lado Esquerdo - Recursos */}
      <div className="hidden lg:flex lg:flex-1 flex-col justify-center px-12 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">CourseSphere</h1>
          </div>
          
          <h2 className="text-4xl font-bold text-foreground mb-6 leading-tight">
            Transforme a forma como você
            <span className="text-primary block">gerencia cursos</span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            Espero que gostem do meu projeto. ;)
          </p>
          
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="flex items-start gap-4 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Elementos de fundo animados */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      {/* Lado Direito - Formulário de Login */}
      <div className="flex-1 lg:flex-initial lg:w-96 xl:w-[480px] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="bg-gradient-card border-border shadow-card hover-lift animate-slide-up">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                <BookOpen className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Bem-vindo</CardTitle>
              <CardDescription className="text-muted-foreground">
                Faça login para acessar sua conta
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="animate-fade-in">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="bg-input border-border focus:border-primary focus:ring-primary/20 transition-all duration-300"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground font-medium">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-input border-border focus:border-primary focus:ring-primary/20 transition-all duration-300 pr-10"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full btn-glow text-primary-foreground font-semibold py-6 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                      Entrando...
                    </div>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </form>
              
              <div className="mt-8 pt-6 border-t border-border">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Demo:</p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Email:</strong> admin@coursesphere.com<br />
                    <strong>Senha:</strong> 123456
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}