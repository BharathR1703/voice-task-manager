import { useState, useMemo } from 'react';
import { Task } from '../types/task';

interface CalendarViewProps {
  tasks: Task[];
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function getMonthMatrix(date: Date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const mat: Date[][] = [];
  let cur = new Date(start);
  // backfill to start of week (Sun)
  cur.setDate(cur.getDate() - cur.getDay());

  while (cur <= end || cur.getDay() !== 0) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    mat.push(week);
  }

  return mat;
}

export function CalendarView({ tasks }: CalendarViewProps) {
  const [cursor, setCursor] = useState(new Date());

  const matrix = useMemo(() => getMonthMatrix(cursor), [cursor]);

  // map tasks by date YYYY-MM-DD
  const tasksByDate = useMemo(() => {
    const m: Record<string, Task[]> = {};
    tasks.forEach(t => {
      if (t.dueDate) {
        const k = t.dueDate;
        if (!m[k]) m[k] = [];
        m[k].push(t);
      }
    });
    return m;
  }, [tasks]);

  const prevMonth = () => {
    const d = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1);
    setCursor(d);
  };

  const nextMonth = () => {
    const d = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    setCursor(d);
  };

  const monthLabel = cursor.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{monthLabel}</h3>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="px-3 py-1 rounded-lg border">Prev</button>
          <button onClick={nextMonth} className="px-3 py-1 rounded-lg border">Next</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-sm text-center mb-2">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="text-gray-500">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {matrix.map((week, wi) => (
          <div key={wi} className="contents">
            {week.map((day) => {
              const ymd = day.toISOString().slice(0,10);
              const inMonth = day.getMonth() === cursor.getMonth();
              const dayTasks = tasksByDate[ymd] || [];

              return (
                <div key={ymd} className={`min-h-[96px] p-2 rounded-lg border ${inMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}`}>
                  <div className="flex items-start justify-between mb-1">
                    <div className="text-xs font-medium">{day.getDate()}</div>
                    <div className="text-xs text-gray-400">{/* placeholder for badges */}</div>
                  </div>
                  <div className="space-y-1">
                    {dayTasks.slice(0,3).map(t => (
                      <div key={t.id} className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          t.priority === 'critical' ? 'bg-red-500' :
                          t.priority === 'high' ? 'bg-orange-400' :
                          t.priority === 'medium' ? 'bg-blue-400' : 'bg-gray-400'
                        }`} />
                        <div className="flex-1 text-xs truncate">
                          <div className="font-medium text-indigo-700 truncate">{t.title}</div>
                          <div className="text-[11px] text-gray-500">{t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}</div>
                        </div>
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-gray-500">+{dayTasks.length - 3} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
