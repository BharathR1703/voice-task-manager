import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { CalendarView } from './CalendarView';
import { KanbanView } from './KanbanView';
import { VoiceRecordingModal } from './VoiceRecordingModal';
import { TaskPreviewModal } from './TaskPreviewModal';
import { TaskEditModal } from './TaskEditModal';
import { ManualTaskModal } from './ManualTaskModal';
import { Task, TaskStatus, TaskPriority } from '../types/task';

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [parsedTask, setParsedTask] = useState<Partial<Task> | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');

  const handleVoiceComplete = (transcript: string) => {
    setCurrentTranscript(transcript);
    setShowVoiceModal(false);
    (async () => {
      try {
        const res = await import('../lib/api').then(m => m.parseTranscript(transcript));
        setParsedTask(res.parsed || {});
        setShowPreviewModal(true);
      } catch (err) {
        console.error('Parse failed', err);
        const parsed = parseTranscriptLocal(transcript);
        setParsedTask(parsed);
        setShowPreviewModal(true);
      }
    })();
  };

  const parseTranscriptLocal = (transcript: string): Partial<Task> => {
    const lower = transcript.toLowerCase();
    let priority: TaskPriority = 'medium';
    if (lower.includes('high priority') || lower.includes('urgent') || lower.includes('critical')) priority = 'critical';
    if (lower.includes('low priority')) priority = 'low';

    let dueDate = '';
    if (lower.includes('tomorrow')) { const d = new Date(); d.setDate(d.getDate() + 1); dueDate = d.toISOString().split('T')[0]; }
    else if (lower.includes('today')) { dueDate = new Date().toISOString().split('T')[0]; }

    const titleMatch = transcript.match(/(?:create|add|new task|task to|please)\s+(.+?)(?:\s+by|\s+tomorrow|\s+today|$)/i);
    const title = titleMatch ? titleMatch[1] : transcript.slice(0, 50);

    return {
      id: Date.now().toString(),
      title: title.charAt(0).toUpperCase() + title.slice(1),
      description: transcript,
      priority,
      dueDate,
      status: 'todo' as TaskStatus,
      createdAt: new Date().toISOString(),
    };
  };

  useEffect(() => {
    (async () => {
      try {
        const { fetchTasks } = await import('../lib/api');
        const t = await fetchTasks();
        setTasks(t as Task[]);
        setFilteredTasks(t as Task[]);
      } catch (err) {
        console.error('Failed to load tasks', err);
      }
    })();
  }, []);

  const handleCreateTask = (task: Partial<Task>) => {
    (async () => {
      const newTask: Task = {
        id: task.id || Date.now().toString(),
        title: task.title || 'Untitled Task',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'todo',
        dueDate: task.dueDate || '',
        createdAt: task.createdAt || new Date().toISOString(),
      };
      setTasks((s) => [...s, newTask]);
      setFilteredTasks((s) => [...s, newTask]);
      setShowPreviewModal(false);
      setShowManualModal(false);
      setParsedTask(null);

      try {
        const { createTask } = await import('../lib/api');
        const saved = await createTask(newTask as any);
        setTasks((s) => s.map(t => t.id === newTask.id ? saved : t));
        setFilteredTasks((s) => s.map(t => t.id === newTask.id ? saved : t));
      } catch (err) {
        console.error('Save failed', err);
      }
    })();
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    (async () => {
      const updated = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
      setTasks(updated);
      setFilteredTasks(updated);
      setShowEditModal(false);
      setEditingTask(null);
      try {
        const { updateTask } = await import('../lib/api');
        await updateTask(updatedTask.id, updatedTask as any);
      } catch (err) {
        console.error('Update failed', err);
      }
    })();
  };

  const handleDeleteTask = (taskId: string) => {
    (async () => {
      const updated = tasks.filter(t => t.id !== taskId);
      setTasks(updated);
      setFilteredTasks(updated);
      setShowEditModal(false);
      setEditingTask(null);
      try {
        const { deleteTask } = await import('../lib/api');
        await deleteTask(taskId);
      } catch (err) {
        console.error('Delete failed', err);
      }
    })();
  };

  const handleMoveTask = (taskId: string, newStatus: TaskStatus) => {
    (async () => {
      const updated = tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
      setTasks(updated);
      setFilteredTasks(updated);
      try {
        const task = updated.find(t => t.id === taskId);
        if (task) {
          const { updateTask } = await import('../lib/api');
          await updateTask(taskId, { status: newStatus } as any);
        }
      } catch (err) {
        console.error('Move save failed', err);
      }
    })();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterTasks(query, statusFilter, priorityFilter);
  };

  const handleStatusFilter = (status: TaskStatus | 'all') => {
    setStatusFilter(status);
    filterTasks(searchQuery, status, priorityFilter);
  };

  const handlePriorityFilter = (priority: TaskPriority | 'all') => {
    setPriorityFilter(priority);
    filterTasks(searchQuery, statusFilter, priority);
  };

  const filterTasks = (query: string, status: TaskStatus | 'all', priority: TaskPriority | 'all') => {
    let filtered = [...tasks];

    if (query) {
      filtered = filtered.filter(t => t.title.toLowerCase().includes(query.toLowerCase()) || t.description.toLowerCase().includes(query.toLowerCase()));
    }

    if (status !== 'all') filtered = filtered.filter(t => t.status === status);
    if (priority !== 'all') filtered = filtered.filter(t => t.priority === priority);

    setFilteredTasks(filtered);
  };

  const isFiltered = searchQuery !== '' || statusFilter !== 'all' || priorityFilter !== 'all';

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-[#fafafa]">
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            onVoiceClick={() => setShowVoiceModal(true)}
            onAddClick={() => setShowManualModal(true)}
            onSearch={handleSearch}
            onStatusFilter={handleStatusFilter}
            onPriorityFilter={handlePriorityFilter}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
          />

          <main className="flex-1 overflow-auto">
            <div className="max-w-[1600px] mx-auto px-8 py-6">
              {isFiltered && (<div className="mb-4 text-gray-600">Showing {filteredTasks.length} filtered result{filteredTasks.length !== 1 ? 's' : ''}</div>)}
              {showCalendar ? (
                // Calendar view shows tasks by due date
                <div>
                  <h2 className="mb-4 text-lg font-medium">Calendar</h2>
                  <CalendarView tasks={tasks} />
                </div>
              ) : (
                <KanbanView tasks={isFiltered ? filteredTasks : tasks} onMoveTask={handleMoveTask} onEditTask={handleEditTask} />
              )}
            </div>
          </main>
        </div>

        {showVoiceModal && (<VoiceRecordingModal onClose={() => setShowVoiceModal(false)} onComplete={handleVoiceComplete} />)}

        {showPreviewModal && parsedTask && (<TaskPreviewModal transcript={currentTranscript} parsedTask={parsedTask} onClose={() => { setShowPreviewModal(false); setParsedTask(null); }} onCreate={handleCreateTask} />)}

        {showEditModal && editingTask && (<TaskEditModal task={editingTask} onClose={() => { setShowEditModal(false); setEditingTask(null); }} onUpdate={handleUpdateTask} onDelete={handleDeleteTask} />)}

        {showManualModal && (<ManualTaskModal onClose={() => setShowManualModal(false)} onCreate={handleCreateTask} />)}
      </div>
    </DndProvider>
  );
}
