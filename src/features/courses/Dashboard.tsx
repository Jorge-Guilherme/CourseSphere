import { useState, useEffect } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { Button } from '@/components/atoms/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/molecules/card';
import { Input } from '@/components/atoms/input';
import { Badge } from '@/components/atoms/badge';
import { Plus, Search, BookOpen, Calendar, Users, LogOut } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { Link } from 'react-router-dom';
import { apiGet } from '@/shared/lib/api';

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

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      // Buscar cursos da API
      const allCourses: Course[] = await apiGet('/courses');
      // Filtrar cursos do usuário
      const userCourses = allCourses.filter(course =>
        course.creator_id === user?.id || course.instructors.includes(user?.id || '')
      );
      // Buscar contagem de aulas para cada curso
      const coursesWithLessons = await Promise.all(userCourses.map(async (course) => {
        const lessons = await apiGet(`/lessons?course_id=${course.id}`);
        return { ...course, lessons_count: lessons.length };
      }));
      setCourses(coursesWithLessons);
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os cursos",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStartDate = !startDateFilter || new Date(course.start_date) >= new Date(startDateFilter);
    const matchesEndDate = !endDateFilter || new Date(course.end_date) <= new Date(endDateFilter);
    
    return matchesSearch && matchesStartDate && matchesEndDate;
  });

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

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso"
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando cursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Cabeçalho */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">CourseSphere</h1>
                <p className="text-sm text-muted-foreground">Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Olá, <span className="text-foreground font-medium">{user?.name}</span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Cabeçalho da Página */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Meus Cursos</h2>
            <p className="text-muted-foreground">
              Gerencie seus cursos e acompanhe o progresso
            </p>
          </div>
          
          <Button asChild className="btn-glow gap-2 self-start lg:self-auto">
            <Link to="/courses/new">
              <Plus className="h-4 w-4" />
              Novo Curso
            </Link>
          </Button>
        </div>

        {/* Busca e Filtros */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input border-border focus:border-primary"
            />
          </div>
          
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-foreground mb-2">
                Data de início a partir de:
              </label>
              <Input
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                className="bg-input border-border focus:border-primary"
              />
            </div>
            
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-foreground mb-2">
                Data de fim até:
              </label>
              <Input
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                className="bg-input border-border focus:border-primary"
              />
            </div>
            
            {(startDateFilter || endDateFilter) && (
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStartDateFilter('');
                    setEndDateFilter('');
                  }}
                  className="h-10"
                >
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Grade de Cursos */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchTerm ? 'Nenhum curso encontrado' : 'Nenhum curso criado'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm 
                ? 'Tente ajustar os termos da busca' 
                : 'Comece criando seu primeiro curso'
              }
            </p>
            {!searchTerm && (
              <Button asChild className="btn-glow gap-2">
                <Link to="/courses/new">
                  <Plus className="h-4 w-4" />
                  Criar Primeiro Curso
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => {
              const status = getCourseStatus(course.start_date, course.end_date);
              
              return (
                <Card 
                  key={course.id} 
                  className="bg-gradient-card border-border shadow-card hover-lift animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg font-bold text-foreground line-clamp-2">
                        {course.name}
                      </CardTitle>
                      <Badge variant={status.variant} className="shrink-0">
                        {status.label}
                      </Badge>
                    </div>
                    <CardDescription className="text-muted-foreground line-clamp-3">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(course.start_date)} - {formatDate(course.end_date)}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {course.instructors.length} instrutor(es)
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          {course.lessons_count} aulas
                        </div>
                      </div>
                      
                      <Button 
                        asChild 
                        className="w-full mt-4 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                      >
                        <Link to={`/courses/${course.id}`}>
                          Ver Detalhes
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}