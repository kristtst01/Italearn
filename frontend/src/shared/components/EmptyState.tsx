import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: string;
}

export default function EmptyState({ title, message, icon }: EmptyStateProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center">
        {icon && <div className="text-5xl mb-4">{icon}</div>}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-500 mb-4">{message}</p>
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:underline"
        >
          Back to path
        </button>
      </div>
    </div>
  );
}
