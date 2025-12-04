import { useDrag } from 'react-dnd';
import { Calendar } from 'lucide-react';
import { Task } from '../types/task';

interface TaskCardProps { task: Task; onClick: () => void; }

const priorityColors: Record<string, string> = { low: 'bg-gray-400', medium: 'bg-blue-400', high: 'bg-orange-400', critical: 'bg-red-500' };
const priorityLabels: Record<string, string> = { low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical' };

export function TaskCard({ task, onClick }: TaskCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({ type: 'TASK', item: { id: task.id }, collect: (monitor) => ({ isDragging: !!monitor.isDragging() }) }));

  return (
    <div ref={(node) => (drag as unknown as (instance: HTMLDivElement | null) => void)(node)} onClick={onClick} className={`p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer ${isDragging ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-2"><h4 className="text-gray-900 flex-1">{task.title}</h4><div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]} mt-1.5`} title={priorityLabels[task.priority]} /></div>
      {task.description && (<p className="text-gray-600 mb-3 line-clamp-2">{task.description}</p>)}
      <div className="flex items-center justify-between"><span className={`px-2 py-0.5 rounded-md text-xs ${task.priority === 'critical' ? 'bg-red-50 text-red-700' : task.priority === 'high' ? 'bg-orange-50 text-orange-700' : task.priority === 'medium' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{priorityLabels[task.priority]}</span>
        {task.dueDate && (<div className="flex items-center gap-1 text-gray-500"><Calendar className="w-3.5 h-3.5" /><span className="text-xs">{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div>)}
      </div>
    </div>
  );
}
