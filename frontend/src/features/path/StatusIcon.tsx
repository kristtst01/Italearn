import { Lock, Play, Clock, Check } from 'lucide-react';
import type { UnitStatus } from '@/types';

export default function StatusIcon({ status }: { status: UnitStatus }) {
  const base = 'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0';

  switch (status) {
    case 'locked':
      return (
        <div className={`${base} bg-gray-200`}>
          <Lock className="w-4 h-4 text-gray-400" />
        </div>
      );
    case 'available':
      return (
        <div className={`${base} bg-blue-100`}>
          <Play className="w-4 h-4 text-blue-600" />
        </div>
      );
    case 'in_progress':
      return (
        <div className={`${base} bg-blue-100`}>
          <Clock className="w-4 h-4 text-blue-600" />
        </div>
      );
    case 'completed':
      return (
        <div className={`${base} bg-green-100`}>
          <Check className="w-4 h-4 text-green-600" />
        </div>
      );
  }
}
