import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/contexts/AuthContext';
import { Button } from '@/components/atoms/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/molecules/card';
import { Input } from '@/components/atoms/input';
import { Badge } from '@/components/atoms/badge';
import { Label } from '@/components/atoms/label';
import { Separator } from '@/components/atoms/separator';
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  Users, 
  Plus, 
  Search, 
  Edit,
  Trash2,
  UserPlus,
  Play,
  Clock
} from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { Link } from 'react-router-dom';
import { apiGet, apiDelete } from '@/shared/lib/api';
import ManageInstructors from '@/features/courses/components/ManageInstructors';

interface Course {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  creator_id: string;
  instructors: string[];
  lessons_count: number;
}

interface Lesson {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  publish_date: string;
  video_url: string;
  course_id: string;
  creator_id: string;
  duration?: string;
}

export default function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showInstructors, setShowInstructors] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const lessonsPerPage = 5;
  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lesson.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const paginatedLessons = filteredLessons.slice((currentPage - 1) * lessonsPerPage, currentPage * lessonsPerPage);
  const totalPages = Math.ceil(filteredLessons.length / lessonsPerPage);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourseData();
  }, [id]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

  const loadCourseData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Buscar curso por id
      const courseData = await apiGet(`/courses/${id}`);
      // Buscar aulas do curso
      const lessonsData = await apiGet(`/lessons?course_id=${id}`);
      setCourse(courseData);
      setLessons(lessonsData);
    } catch (error) {
      setError('Não foi possível carregar os dados do curso. Verifique se o curso existe ou tente novamente.');
      setCourse(null);
      setLessons([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getCourseStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return { label: 'Em breve', variant: 'secondary' as const };
    } else if (now > end) {
      return { label: 'Finalizado', variant: 'outline' as const };
    } else {
      return { label: 'Em andamento', variant: 'default' as const };
    }
  };

  const getLessonStatusInfo = (status: string) => {
    switch (status) {
      case 'published':
        return { label: 'Publicada', variant: 'default' as const, icon: Play };
      case 'draft':
        return { label: 'Rascunho', variant: 'secondary' as const, icon: Edit };
      case 'archived':
        return { label: 'Arquivada', variant: 'outline' as const, icon: Clock };
      default:
        return { label: 'Indefinido', variant: 'outline' as const, icon: Clock };
    }
  };

  const isCreator = course?.creator_id === user?.id;
  const isInstructor = course?.instructors.includes(user?.id || '');

  const handleDeleteLesson = async (lessonId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta aula?')) return;
    try {
      await apiDelete(`/lessons/${lessonId}`);
      toast({ title: 'Aula excluída', description: 'A aula foi removida com sucesso.' });
      // Atualizar lista de aulas
      setLessons(prev => prev.filter(l => l.id !== lessonId));
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível excluir a aula.', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Erro ao carregar curso</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild>
            <Link to="/dashboard">Voltar ao Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Curso não encontrado</h3>
          <p className="text-muted-foreground mb-6">O curso que você está procurando não existe.</p>
          <Button asChild>
            <Link to="/dashboard">Voltar ao Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const status = getCourseStatus(course.start_date, course.end_date);

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
              <h1 className="text-xl font-bold text-foreground">{course.name}</h1>
              <p className="text-sm text-muted-foreground">Detalhes do curso</p>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Informações do Curso */}
        <Card className="bg-gradient-card border-border shadow-card mb-8">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {course.name}
                  </CardTitle>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
                <CardDescription className="text-muted-foreground text-base">
                  {course.description}
                </CardDescription>
              </div>
              
              {isCreator && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowInstructors(true)}>
                    <UserPlus className="h-4 w-4" />
                    Gerenciar Instrutores
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Editar Curso
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Período</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(course.start_date)} - {formatDate(course.end_date)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Instrutores</p>
                  <p className="text-sm text-muted-foreground">
                    {course.instructors.length} instrutor(es)
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Aulas</p>
                  <p className="text-sm text-muted-foreground">
                    {lessons.length} aula(s)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção de Aulas */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-foreground">
                  Aulas do Curso
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {filteredLessons.length} de {lessons.length} aulas
                </CardDescription>
              </div>
              
              {isInstructor && (
                <Button className="btn-glow gap-2 self-start lg:self-auto" onClick={() => navigate(`/courses/${id}/lessons/new`)}>
                  <Plus className="h-4 w-4" />
                  Nova Aula
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar aulas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input border-border focus:border-primary"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-md border border-border bg-input text-foreground focus:border-primary focus:outline-none"
              >
                <option value="all">Todos os status</option>
                <option value="published">Publicadas</option>
                <option value="draft">Rascunhos</option>
                <option value="archived">Arquivadas</option>
              </select>
            </div>

            <Separator className="mb-6" />

            {/* Lista de Aulas */}
            {filteredLessons.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Nenhuma aula encontrada' 
                    : 'Nenhuma aula criada'
                  }
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece criando a primeira aula do curso'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && isInstructor && (
                  <Button className="btn-glow gap-2">
                    <Plus className="h-4 w-4" />
                    Criar Primeira Aula
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedLessons.map((lesson, index) => {
                    const statusInfo = getLessonStatusInfo(lesson.status);
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <Card 
                        key={lesson.id}
                        className="bg-gradient-card border-border shadow-card hover-lift animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <StatusIcon className="h-5 w-5 text-primary" />
                              </div>
                              
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground mb-1">
                                  {lesson.title}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>Publicação: {formatDate(lesson.publish_date)}</span>
                                  {lesson.duration && (
                                    <span>Duração: {lesson.duration}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <Badge variant={statusInfo.variant}>
                                {statusInfo.label}
                              </Badge>
                              
                              {(isCreator || lesson.creator_id === user?.id) && (
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="sm" onClick={() => navigate(`/courses/${id}/lessons/${lesson.id}/edit`)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleDeleteLesson(lesson.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                {/* Controles de Paginação */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Anterior</Button>
                    <span className="text-sm text-muted-foreground">Página {currentPage} de {totalPages}</span>
                    <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Próxima</Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
      {showInstructors && course && (
        <ManageInstructors
          course={course}
          onUpdate={updated => setCourse(prev => prev ? { ...prev, ...updated } : { ...course, ...updated })}
          onClose={() => setShowInstructors(false)}
        />
      )}
    </div>
  );
}