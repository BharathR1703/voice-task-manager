import { Search, Plus, Mic } from 'lucide-react';
import { TaskStatus, TaskPriority } from '../types/task';

interface HeaderProps {
  onVoiceClick: () => void;
  onAddClick: () => void;
  onSearch: (query: string) => void;
  onStatusFilter: (status: TaskStatus | 'all') => void;
  onPriorityFilter: (priority: TaskPriority | 'all') => void;
  searchQuery: string;
  statusFilter: TaskStatus | 'all';
  priorityFilter: TaskPriority | 'all';
}

export function Header({ onVoiceClick, onAddClick, onSearch, onStatusFilter, onPriorityFilter, searchQuery, statusFilter, priorityFilter }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600" />
            <span className="text-gray-900">VoiceTask</span>
          </div>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={(e) => onSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:outline-none transition-colors" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select value={statusFilter} onChange={(e) => onStatusFilter(e.target.value as TaskStatus | 'all')} className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 focus:border-indigo-500 focus:outline-none transition-colors">
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <select value={priorityFilter} onChange={(e) => onPriorityFilter(e.target.value as TaskPriority | 'all')} className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 focus:border-indigo-500 focus:outline-none transition-colors">
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onVoiceClick} className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg transition-all hover:scale-105" title="Voice Input"><Mic className="w-5 h-5" /></button>
            <button onClick={onAddClick} className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center gap-2"><Plus className="w-5 h-5" />Add Task</button>
          </div>
        </div>
      </div>
    </header>
  );
}
