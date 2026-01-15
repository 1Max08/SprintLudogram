
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { Navigate } from 'react-router-dom';

// `ProtectedRoute` : composant wrapper qui protège les routes privées.
// - Vérifie si l'utilisateur est connecté (`s.auth.user`).
// - Si oui: affiche le contenu enchaîné (children).
// - Si non: redirige vers /login.
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useSelector((s: RootState) => s.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
