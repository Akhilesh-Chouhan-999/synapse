// src/components/ui/card.jsx
export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl bg-gray-800 p-4 shadow-lg border border-gray-700 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-2 ${className}`}>{children}</div>;
}
