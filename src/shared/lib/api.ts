const baseURL = 'http://localhost:3001';

export async function apiGet(path: string) {
  const res = await fetch(`${baseURL}${path}`);
  if (!res.ok) throw new Error('Erro ao buscar dados');
  return res.json();
}

export async function apiPost(path: string, data: any) {
  const res = await fetch(`${baseURL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao criar recurso');
  return res.json();
}

export async function apiPut(path: string, data: any) {
  const res = await fetch(`${baseURL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao atualizar recurso');
  return res.json();
}

export async function apiDelete(path: string) {
  const res = await fetch(`${baseURL}${path}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erro ao deletar recurso');
  return res.json();
} 