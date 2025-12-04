import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../types/task';

interface TaskPreviewModalProps { transcript: string; parsedTask: Partial<Task>; onClose: () => void; onCreate: (task: Partial<Task>) => void; }

export function TaskPreviewModal({ transcript, parsedTask, onClose, onCreate }: TaskPreviewModalProps) {
  const [editedTask, setEditedTask] = useState<Partial<Task>>(parsedTask);
  const handleCreate = () => { onCreate(editedTask); };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
          <div className="flex items-center justify-between mb-6"><h2 className="text-gray-900">Review Parsed Task</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500" /></button></div>

          <div className="mb-6"><label className="block text-gray-700 mb-2">Raw Transcript</label><div className="p-4 rounded-xl bg-gray-50 border border-gray-200"><p className="text-gray-600 italic">"{transcript}"</p></div></div>

          <div className="space-y-4 mb-6">
            <div><label className="block text-gray-700 mb-2">Title</label><input type="text" value={editedTask.title || ''} onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:outline-none" placeholder="Task title" /></div>

            <div><label className="block text-gray-700 mb-2">Description</label><textarea value={editedTask.description || ''} onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:outline-none resize-none" rows={3} placeholder="Task description" /></div>

            <div className="grid grid-cols-2 gap-4"><div><label className="block text-gray-700 mb-2">Priority</label><select value={editedTask.priority || 'medium'} onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as TaskPriority })} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:outline-none"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select></div>

              <div><label className="block text-gray-700 mb-2">Status</label><select value={editedTask.status || 'todo'} onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value as TaskStatus })} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:outline-none"><option value="todo">To Do</option><option value="inprogress">In Progress</option><option value="done">Done</option></select></div></div>

            <div><label className="block text-gray-700 mb-2">Due Date</label><div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="date" value={editedTask.dueDate || ''} onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:outline-none" /></div></div>
          </div>

          <div className="flex items-center justify-end gap-3"><button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleCreate} className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg transition-all">Create Task</button></div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
