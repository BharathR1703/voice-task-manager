import { LayoutGrid, Calendar, Filter, Settings } from 'lucide-react';

interface SidebarProps {
  onShowCalendar?: () => void;
}

export function Sidebar({ onShowCalendar }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-gray-200 bg-white p-4">
      <nav className="space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-100 text-gray-900 transition-colors">
          <LayoutGrid className="w-5 h-5" />
          <span>Tasks</span>
        </button>
        
        <button onClick={() => onShowCalendar && onShowCalendar()} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          <Calendar className="w-5 h-5" />
          <span>Calendar</span>
        </button>
        
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </button>

        <div className="pt-6">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
