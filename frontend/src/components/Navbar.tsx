
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { logoutLocal } from '../store/authSlice';
import api from '../services/api';

export default function Navbar() {
  const user = useSelector((s: RootState) => s.auth.user);
  const dispatch = useDispatch();

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    dispatch(logoutLocal());
  };

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-white shadow">
      <Link to="/" className="font-bold text-blue-600">LudoHub</Link>
      <div className="flex items-center gap-3">
        <Link to="/" className="hover:underline">Jeux</Link>
        {user && <Link to="/my-lists" className="hover:underline">Mes listes</Link>}
        {user ? (
          <>
            <Link to="/add-game" className="hover:underline">Ajouter un jeu</Link>
            <Link to="/profile" className="hover:underline">Profil</Link>
            <button onClick={logout} className="px-3 py-1 bg-blue-600 text-white rounded">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
