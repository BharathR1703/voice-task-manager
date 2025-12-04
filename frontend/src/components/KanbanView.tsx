import { Task, TaskStatus } from '../types/task';
import { KanbanColumn } from './KanbanColumn';

interface KanbanViewProps { tasks: Task[]; onMoveTask: (taskId: string, newStatus: TaskStatus) => void; onEditTask: (task: Task) => void; }

export function KanbanView({ tasks, onMoveTask, onEditTask }: KanbanViewProps) {
  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'inprogress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  const isEmpty = tasks.length === 0;

  if (isEmpty) {
    return (<div className="flex items-center justify-center h-[calc(100vh-200px)]"><div className="text-center"><div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto mb-4"><span className="text-4xl">🎤</span></div><h3 className="text-gray-900 mb-2">No tasks yet</h3><p className="text-gray-600">Try speaking your first task using the microphone button</p></div></div>);
  }

  return (
    <div className="grid grid-cols-3 gap-6 h-full">
      <KanbanColumn title="To Do" status="todo" tasks={todoTasks} count={todoTasks.length} onMoveTask={onMoveTask} onEditTask={onEditTask} />
      <KanbanColumn title="In Progress" status="inprogress" tasks={inProgressTasks} count={inProgressTasks.length} onMoveTask={onMoveTask} onEditTask={onEditTask} />
      <KanbanColumn title="Done" status="done" tasks={doneTasks} count={doneTasks.length} onMoveTask={onMoveTask} onEditTask={onEditTask} />
    </div>
  );
}
