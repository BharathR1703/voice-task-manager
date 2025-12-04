import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, X } from 'lucide-react';

interface VoiceRecordingModalProps { onClose: () => void; onComplete: (transcript: string) => void; }

export function VoiceRecordingModal({ onClose, onComplete }: VoiceRecordingModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [liveTranscript, setLiveTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interim = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += t + ' ';
          } else {
            interim += t;
          }
        }
        // Show interim results live
        setLiveTranscript((transcript + interim).trim());
        // Append final results to transcript
        if (finalTranscript) setTranscript(prev => (prev + finalTranscript).trim());
      };

      recognitionRef.current.onerror = (event: any) => { console.error('Speech recognition error:', event.error); setIsRecording(false); };
    }

    return () => { recognitionRef.current?.stop(); };
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      setLiveTranscript('');
    } else {
      setTranscript('');
      setLiveTranscript('');
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleComplete = () => { if (transcript.trim()) onComplete(transcript.trim()); };

  const examplePrompts = ["Create a high priority task to review pull request by tomorrow evening", "Add a task to update documentation by next Friday", "New critical task to fix production bug today"];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
          <div className="flex items-center justify-between mb-6"><h2 className="text-gray-900">Voice Input</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500" /></button></div>

          <div className="flex flex-col items-center mb-8">
            <button onClick={toggleRecording} className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-gradient-to-br from-red-500 to-pink-600 shadow-xl animate-pulse' : 'bg-gradient-to-br from-indigo-500 to-purple-600 hover:shadow-xl hover:scale-105'}`}>
              <Mic className="w-12 h-12 text-white" strokeWidth={1.5} />
            </button>
            <p className="mt-4 text-gray-600">{isRecording ? 'Listening...' : 'Click to start recording'}</p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Transcript</label>
            <div className="min-h-[120px] p-4 rounded-xl bg-gray-50 border border-gray-200">
              {(isRecording && liveTranscript) ? (
                <p className="text-gray-900">{liveTranscript}</p>
              ) : transcript ? (
                <p className="text-gray-900">{transcript}</p>
              ) : (
                <p className="text-gray-400">Your speech will appear here...</p>
              )}
            </div>
          </div>

          {!transcript && (<div className="mb-6"><p className="text-gray-600 mb-3">Try saying:</p><div className="space-y-2">{examplePrompts.map((prompt, index) => (<div key={index} className="p-3 rounded-lg bg-indigo-50 border border-indigo-100"><p className="text-indigo-900 italic">"{prompt}"</p></div>))}</div></div>)}

          <div className="flex items-center justify-end gap-3"><button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleComplete} disabled={!transcript.trim()} className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">Parse Task</button></div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
