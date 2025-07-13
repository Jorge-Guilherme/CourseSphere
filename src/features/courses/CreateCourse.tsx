import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/contexts/AuthContext';
import { Button } from '@/components/atoms/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/molecules/card';
import { Input } from '@/components/atoms/input';
import { Textarea } from '@/components/molecules/textarea';
import { Label } from '@/components/atoms/label';
import { ArrowLeft, BookOpen, Save } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { Link } from 'react-router-dom';
import { apiPost } from '@/shared/lib/api';

interface CreateCourseForm {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
}

export default function CreateCourse() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateCourseForm>({
    name: '',
    description: '',
    start_date: '',
    end_date: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (formData.name.length < 3) {
      toast({
        title: "Erro de validação",
        description: "O nome do curso deve ter pelo menos 3 caracteres",
        variant: "destructive"
      });
      return false;
    }

    if (formData.description.length > 500) {
      toast({
        title: "Erro de validação",
        description: "A descrição não pode ter mais de 500 caracteres",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.start_date || !formData.end_date) {
      toast({
        title: "Erro de validação",
        description: "Ambas as datas são obrigatórias",
        variant: "destructive"
      });
      return false;
    }

    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      toast({
        title: "Erro de validação",
        description: "A data de fim deve ser posterior à data de início",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não está logado corretamente",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Criando curso com dados:', {
        ...formData,
        creator_id: user?.id,
        instructors: [user?.id]
      });
      
      // Criar curso na API
      const result = await apiPost('/courses', {
        ...formData,
        creator_id: user?.id,
        instructors: [user?.id]
      });

      console.log('Curso criado com sucesso:', result);

      toast({
        title: "Sucesso!",
        description: "Curso criado com sucesso"
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao criar curso:', error);
      toast({
        title: "Erro",
        description: `Não foi possível criar o curso: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Cabeçalho */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Link>
            </Button>
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <BookOpen className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Novo Curso</h1>
              <p className="text-sm text-muted-foreground">Crie um novo curso para sua plataforma</p>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                Informações do Curso
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Preencha as informações básicas do seu novo curso
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground font-medium">
                    Nome do Curso *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Digite o nome do curso"
                    className="bg-input border-border focus:border-primary"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Mínimo de 3 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground font-medium">
                    Descrição
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descreva o conteúdo e objetivos do curso"
                    className="bg-input border-border focus:border-primary min-h-[100px]"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Máximo de 500 caracteres ({formData.description.length}/500)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date" className="text-foreground font-medium">
                      Data de Início *
                    </Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={handleChange}
                      className="bg-input border-border focus:border-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_date" className="text-foreground font-medium">
                      Data de Fim *
                    </Label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={handleChange}
                      className="bg-input border-border focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 btn-glow gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                        Criando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Criar Curso
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}