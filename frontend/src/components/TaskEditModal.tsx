import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Trash2 } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../types/task';

interface TaskEditModalProps { task: Task; onClose: () => void; onUpdate: (task: Task) => void; onDelete: (taskId: string) => void; }

export function TaskEditModal({ task, onClose, onUpdate, onDelete }: TaskEditModalProps) {
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const handleUpdate = () => onUpdate(editedTask);
  const handleDelete = () => onDelete(task.id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
          <div className="flex items-center justify-between mb-6"><h2 className="text-gray-900">Edit Task</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500" /></button></div>

          <div className="space-y-4 mb-6">
            <div><label className="block text-gray-700 mb-2">Title</label><input type="text" value={editedTask.title} onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:outline-none" placeholder="Task title" /></div>

            <div><label className="block text-gray-700 mb-2">Description</label><textarea value={editedTask.description} onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:outline-none resize-none" rows={4} placeholder="Task description" /></div>

            <div className="grid grid-cols-2 gap-4"><div><label className="block text-gray-700 mb-2">Priority</label><select value={editedTask.priority} onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as TaskPriority })} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:outline-none"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select></div>

              <div><label className="block text-gray-700 mb-2">Status</label><select value={editedTask.status} onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value as TaskStatus })} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:outline-none"><option value="todo">To Do</option><option value="inprogress">In Progress</option><option value="done">Done</option></select></div></div>

            <div><label className="block text-gray-700 mb-2">Due Date</label><div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="date" value={editedTask.dueDate} onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:outline-none" /></div></div>
          </div>

          {showDeleteConfirm && (<div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200"><p className="text-red-900 mb-3">Are you sure you want to delete this task?</p><div className="flex items-center gap-2"><button onClick={handleDelete} className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">Yes, Delete</button><button onClick={() => setShowDeleteConfirm(false)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button></div></div>)}

          <div className="flex items-center justify-between">
            <button onClick={() => setShowDeleteConfirm(true)} className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"><Trash2 className="w-4 h-4" />Delete</button>
            <div className="flex items-center gap-3"><button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button><button onClick={handleUpdate} className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg transition-all">Save Changes</button></div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
