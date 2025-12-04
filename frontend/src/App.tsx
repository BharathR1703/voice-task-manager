import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {!showDashboard ? (
        <LandingPage onOpenDashboard={() => setShowDashboard(true)} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}
