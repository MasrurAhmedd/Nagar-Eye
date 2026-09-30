import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/usePWAInstall';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-amber-600/95 backdrop-blur-xs px-3 py-1.5 text-xs font-semibold text-white shadow-lg border border-amber-500/50 animate-bounce">
      <WifiOff className="w-3.5 h-3.5" />
      <span>Offline Mode — Reports saved locally (Pending Sync)</span>
    </div>
  );
};
