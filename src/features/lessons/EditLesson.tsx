import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/shared/contexts/AuthContext';
import { Button } from '@/components/atoms/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/molecules/card';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { Save, ArrowLeft } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { apiGet, apiPut } from '@/shared/lib/api';
import { Link } from 'react-router-dom';
import AccessDenied from '@/shared/components/AccessDenied';

export default function EditLesson() {
  const { user } = useAuth();
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    status: 'draft',
    publish_date: '',
    video_url: ''
  });
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    loadLesson();
    // eslint-disable-next-line
  }, [lessonId]);

  const loadLesson = async () => {
    setIsLoading(true);
    try {
      const lesson = await apiGet(`/lessons/${lessonId}`);
      const course = await apiGet(`/courses/${courseId}`);
      setFormData({
        title: lesson.title,
        status: lesson.status,
        publish_date: lesson.publish_date,
        video_url: lesson.video_url
      });
      // Permissão: só criador da aula ou do curso pode editar
      setIsAllowed(user?.id === lesson.creator_id || user?.id === course.creator_id);
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível carregar a aula.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (formData.title.length < 3) {
      toast({ title: 'Erro de validação', description: 'O título deve ter pelo menos 3 caracteres', variant: 'destructive' });
      return false;
    }
    if (!formData.status) {
      toast({ title: 'Erro de validação', description: 'Status é obrigatório', variant: 'destructive' });
      return false;
    }
    if (!formData.publish_date || new Date(formData.publish_date) <= new Date()) {
      toast({ title: 'Erro de validação', description: 'A data de publicação deve ser futura', variant: 'destructive' });
      return false;
    }
    if (!/^https?:\/\/.+\..+/.test(formData.video_url)) {
      toast({ title: 'Erro de validação', description: 'URL de vídeo inválida', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await apiPut(`/lessons/${lessonId}`, formData);
      toast({ title: 'Sucesso!', description: 'Aula atualizada com sucesso' });
      navigate(`/courses/${courseId}`);
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível atualizar a aula. Tente novamente.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAllowed && !isLoading) {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link to={`/courses/${courseId}`}>
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Link>
            </Button>
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <Save className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Editar Aula</h1>
              <p className="text-sm text-muted-foreground">Altere os dados da aula</p>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">Informações da Aula</CardTitle>
              <CardDescription className="text-muted-foreground">Edite os dados da aula</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-foreground font-medium">Título *</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                  <p className="text-xs text-muted-foreground">Mínimo de 3 caracteres</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-foreground font-medium">Status *</Label>
                  <select id="status" name="status" value={formData.status} onChange={handleChange} className="bg-input border-border focus:border-primary w-full rounded-md py-2 px-3">
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicada</option>
                    <option value="archived">Arquivada</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publish_date" className="text-foreground font-medium">Data de Publicação *</Label>
                  <Input id="publish_date" name="publish_date" type="date" value={formData.publish_date} onChange={handleChange} required />
                  <p className="text-xs text-muted-foreground">Deve ser uma data futura</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="video_url" className="text-foreground font-medium">URL do Vídeo *</Label>
                  <Input id="video_url" name="video_url" value={formData.video_url} onChange={handleChange} required />
                  <p className="text-xs text-muted-foreground">Exemplo: https://youtube.com/...</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => navigate(`/courses/${courseId}`)} className="flex-1">Cancelar</Button>
                  <Button type="submit" disabled={isLoading} className="flex-1 btn-glow gap-2">
                    {isLoading ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>Salvando...</>) : (<><Save className="h-4 w-4" />Salvar Alterações</>)}
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