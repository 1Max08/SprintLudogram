import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { logoutUser } from '../store/authSlice';
import toast from 'react-hot-toast';

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.auth.user);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Déconnexion réussie !');
      console.log('Utilisateur déconnecté');
    } catch (err: any) {
      console.error('Erreur logout:', err);
      toast.error('Impossible de se déconnecter');
    }
  };

  console.log('Navbar - utilisateur connecté:', user); // debug

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-indigo-600 text-white shadow-md rounded-b-2xl">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-2xl font-extrabold tracking-tight">
          Ludogram
        </Link>
        <span className="hidden sm:inline-block text-sm text-indigo-100">
          Le répertoire des jeux
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Link to="/" className="px-3 py-1 rounded-lg hover:bg-indigo-500 transition">
          Jeux
        </Link>

        {user && (
          <Link to="/my-lists" className="px-3 py-1 rounded-lg hover:bg-indigo-500 transition">
            Mes listes
          </Link>
        )}

        {user ? (
          <>
            <Link to="/add-game" className="px-3 py-1 rounded-lg hover:bg-indigo-500 transition">
              Ajouter
            </Link>

            <Link to="/profile" className="px-3 py-1 rounded-lg hover:bg-indigo-500 transition">
              Profil
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-1.5 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-100 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-3 py-1 rounded-lg hover:bg-indigo-500 transition">
              Login
            </Link>

            <Link to="/signup" className="px-3 py-1 rounded-lg hover:bg-indigo-500 transition">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
