import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  message: string;
}

export default function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-display text-heading">{title}</h1>
        <p className="text-muted-foreground">{message}</p>
        <Link to="/" className="font-bold text-cobalto hover:underline">Back to Today</Link>
      </div>
    </div>
  );
}
