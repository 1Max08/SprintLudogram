import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { logoutLocal } from '../store/authSlice';
import api from '../services/api';

// `Navbar` : affiche des liens selon l'état d'authentification.
// - lit `user` depuis le store Redux (`s.auth.user`).
// - `logout()` appelle l'API backend pour terminer la session côté serveur,
//   puis appelle `logoutLocal()` pour vider l'utilisateur côté client.

export default function Navbar() {
  const user = useSelector((s: RootState) => s.auth.user);
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    dispatch(logoutLocal());
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-indigo-600 text-white shadow-md rounded-b-2xl">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight"
        >
          LudoHub
        </Link>
        <span className="hidden sm:inline-block text-sm text-indigo-100">
          Le répertoire des jeux
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          to="/"
          className="px-3 py-1 rounded-lg hover:bg-indigo-500 transition"
        >
          Jeux
        </Link>

        {/* Lien visible seulement si l'utilisateur est connecté */}
        {user && (
          <Link
            to="/my-lists"
            className="px-3 py-1 rounded-lg hover:bg-indigo-500 transition"
          >
            Mes listes
          </Link>
        )}

        {/* Si connecté -> afficher actions privées + logout */}
        {user ? (
          <>
            <Link
              to="/add-game"
              className="px-3 py-1 rounded-lg hover:bg-indigo-500 transition"
            >
              Ajouter
            </Link>

            <Link
              to="/profile"
              className="px-3 py-1 rounded-lg hover:bg-indigo-500 transition"
            >
              Profil
            </Link>

            {/* Bouton logout : appelle `logout()` défini plus haut */}
            <button
              onClick={logout}
              className="px-4 py-1.5 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-100 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-3 py-1 rounded-lg hover:bg-indigo-500 transition"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="px-3 py-1 rounded-lg hover:bg-indigo-500 transition"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
