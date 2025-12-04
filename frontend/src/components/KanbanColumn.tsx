import { useDrop } from 'react-dnd';
import { Task, TaskStatus } from '../types/task';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps { title: string; status: TaskStatus; tasks: Task[]; count: number; onMoveTask: (taskId: string, newStatus: TaskStatus) => void; onEditTask: (task: Task) => void; }

export function KanbanColumn({ title, status, tasks, count, onMoveTask, onEditTask }: KanbanColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({ accept: 'TASK', drop: (item: { id: string }) => { onMoveTask(item.id, status); }, collect: (monitor) => ({ isOver: !!monitor.isOver() }) }));

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><h3 className="text-gray-900">{title}</h3><span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">{count}</span></div></div>
      <div ref={node => (drop as any)(node)} className={`flex-1 rounded-xl p-4 transition-colors ${isOver ? 'bg-indigo-50 border-2 border-indigo-300' : 'bg-gray-50 border-2 border-transparent'}`}>
        <div className="space-y-3">
          {tasks.map(task => (<TaskCard key={task.id} task={task} onClick={() => onEditTask(task)} />))}
          {tasks.length === 0 && (<div className="text-center py-8 text-gray-400">Drop tasks here</div>)}
        </div>
      </div>
    </div>
  );
}
