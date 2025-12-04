import { Task } from '../types/task';

const base = '/api';

export async function fetchTasks(q = ''): Promise<Task[]> {
  const url = `${base}/tasks${q ? '?q=' + encodeURIComponent(q) : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function createTask(payload: Partial<Task>): Promise<Task> {
  const res = await fetch(`${base}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updateTask(id: string, payload: Partial<Task>): Promise<Task> {
  const res = await fetch(`${base}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${base}/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}

export async function parseTranscript(transcript: string) {
  const res = await fetch(`${base}/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript }),
  });
  if (!res.ok) throw new Error('Failed to parse transcript');
  return res.json();
}
