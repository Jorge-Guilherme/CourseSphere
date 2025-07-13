import { useState } from 'react';
import { Button } from '@/components/atoms/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/molecules/card';
import { Input } from '@/components/atoms/input';
import { Badge } from '@/components/atoms/badge';
import { apiGet, apiPut } from '@/shared/lib/api';
import { UserPlus, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Course {
  id: string;
  name: string;
  instructors: string[];
  creator_id: string;
}

interface ManageInstructorsProps {
  course: Course;
  onUpdate: (updated: Course) => void;
  onClose: () => void;
}

export default function ManageInstructors({ course, onUpdate, onClose }: ManageInstructorsProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [suggested, setSuggested] = useState<User | null>(null);
  const [error, setError] = useState('');

  // Carregar todos usuários locais para exibir nomes dos instrutores
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const all = await apiGet('/users');
      setUsers(all);
    } catch {
      setError('Erro ao carregar usuários');
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de usuários",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar sugestão de instrutor via API externa
  const fetchSuggested = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('https://randomuser.me/api/?nat=br');
      const data = await res.json();
      const user = data.results[0];
      setSuggested({
        id: '',
        name: `${user.name.first} ${user.name.last}`,
        email: user.email
      });
      toast({
        title: "Sugestão encontrada!",
        description: "Novo instrutor sugerido pela API externa",
      });
    } catch {
      setError('Erro ao buscar sugestão externa');
      toast({
        title: "Erro",
        description: "Não foi possível buscar sugestão de instrutor",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Adicionar instrutor (local ou sugerido)
  const addInstructor = async (user: User) => {
    setIsLoading(true);
    setError('');
    try {
      // Verificar se já é instrutor
      if (course.instructors.includes(user.id)) {
        toast({
          title: "Aviso",
          description: "Este usuário já é instrutor do curso",
          variant: "destructive"
        });
        return;
      }

      // Se não existe localmente, cria usuário
      let userId = user.id;
      if (!userId) {
        const created = await apiPut(`/users/${Date.now()}`, {
          name: user.name,
          email: user.email,
          password: '123456'
        });
        userId = created.id;
      }
      // Atualiza instrutores do curso
      const updated = { ...course, instructors: [...course.instructors, userId] };
      await apiPut(`/courses/${course.id}`, updated);
      onUpdate(updated);
      setSuggested(null);
      setSearch('');
      loadUsers();
      
      toast({
        title: "Sucesso!",
        description: `${user.name} foi adicionado como instrutor`,
      });
    } catch {
      setError('Erro ao adicionar instrutor');
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o instrutor",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Remover instrutor
  const removeInstructor = async (userId: string) => {
    if (userId === course.creator_id) {
      toast({
        title: "Aviso",
        description: "Não é possível remover o criador do curso",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setError('');
    try {
      const userToRemove = users.find(u => u.id === userId);
      const updated = { ...course, instructors: course.instructors.filter(id => id !== userId) };
      await apiPut(`/courses/${course.id}`, updated);
      onUpdate(updated);
      loadUsers();
      
      toast({
        title: "Sucesso!",
        description: `${userToRemove?.name || 'Instrutor'} foi removido do curso`,
      });
    } catch {
      setError('Erro ao remover instrutor');
      toast({
        title: "Erro",
        description: "Não foi possível remover o instrutor",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar usuários locais para busca
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) &&
    !course.instructors.includes(u.id)
  );

  // Carregar usuários ao abrir
  if (users.length === 0 && !isLoading) loadUsers();

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Gerenciar Instrutores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="font-semibold mb-2">Instrutores atuais:</div>
            <div className="flex flex-wrap gap-2">
              {course.instructors.map(id => {
                const u = users.find(u => u.id === id);
                return (
                  <Badge key={id} className="flex items-center gap-2">
                    {u ? u.name : id}
                    {id !== course.creator_id && (
                      <button type="button" onClick={() => removeInstructor(id)} className="ml-1 text-red-500"><Trash2 size={14} /></button>
                    )}
                  </Badge>
                );
              })}
            </div>
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-2">Adicionar instrutor existente:</div>
            <Input placeholder="Buscar por nome..." value={search} onChange={e => setSearch(e.target.value)} />
            <div className="mt-2 flex flex-col gap-1 max-h-32 overflow-y-auto">
              {filteredUsers.map(u => (
                <Button key={u.id} variant="outline" size="sm" onClick={() => addInstructor(u)} className="justify-start">
                  <UserPlus className="mr-2 h-4 w-4" /> {u.name} ({u.email})
                </Button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-2">Sugerir novo instrutor (API externa):</div>
            <Button onClick={fetchSuggested} disabled={isLoading} className="gap-2 mb-2">
              <Loader2 className={isLoading ? 'animate-spin' : ''} size={16} /> Sugerir Instrutor
            </Button>
            {suggested && (
              <div className="flex items-center gap-2 mb-2">
                <span>{suggested.name} ({suggested.email})</span>
                <Button size="sm" onClick={() => addInstructor(suggested)} className="gap-1"><UserPlus size={14} />Adicionar</Button>
              </div>
            )}
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>Fechar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 