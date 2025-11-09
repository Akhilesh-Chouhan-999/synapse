export function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-gray-900 border border-gray-700 rounded-2xl shadow-lg transition-all hover:shadow-blue-500/30 hover:border-blue-400/40 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}
