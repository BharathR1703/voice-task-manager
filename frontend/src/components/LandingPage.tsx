import { Mic, Zap, Filter } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps { onOpenDashboard: () => void; }

export function LandingPage({ onOpenDashboard }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600" /><span className="text-gray-900">VoiceTask</span></div>
          <button onClick={onOpenDashboard} className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors">Open Dashboard</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-gray-900 mb-6">Speak Tasks. Save Time.</h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">Transform your voice into perfectly structured tasks. No typing, no friction—just speak naturally and watch your tasks organize themselves.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-16">
          <div className="relative inline-block"><div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-3xl opacity-20" /><div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl"><Mic className="w-16 h-16 text-white" strokeWidth={1.5} /></div></div>
        </motion.div>

        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} onClick={onOpenDashboard} className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">Get Started</motion.button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm"><div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4"><Mic className="w-6 h-6 text-indigo-600" /></div><h3 className="text-gray-900 mb-2">Voice-First Input</h3><p className="text-gray-600">Speak naturally. Our AI extracts task details, priority, and deadlines from your speech.</p></div>

          <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm"><div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-4"><Zap className="w-6 h-6 text-purple-600" /></div><h3 className="text-gray-900 mb-2">Smart Parsing</h3><p className="text-gray-600">AI automatically structures your tasks with titles, descriptions, and metadata.</p></div>

          <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm"><div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4"><Filter className="w-6 h-6 text-indigo-600" /></div><h3 className="text-gray-900 mb-2">Powerful Organization</h3><p className="text-gray-600">Filter by status, priority, and due dates. Switch between Kanban and list views.</p></div>
        </motion.div>
      </div>
    </div>
  );
}
