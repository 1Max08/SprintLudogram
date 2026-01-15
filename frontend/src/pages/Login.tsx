
import type { FormEvent } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, fetchMe } from '../store/authSlice';
import type { AppDispatch, RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// `Login` : page de connexion (form email/password).
// - Envoie les identifiants à `loginUser()` (thunk asynchrone).
// - Si succès: appelle `fetchMe()` pour charger le profil, affiche toast, redirige vers `/`.
// - Si erreur: affiche un toast d'erreur.
export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const nav = useNavigate();
  const { loading, error } = useSelector((s: RootState) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Soumet le formulaire de login
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // `loginUser` est un thunk qui envoie un POST /auth/login
    const res = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(res)) {
      // Si succès, recharge le profil côté client et redirige
      await dispatch(fetchMe()); // hydrate le profil
      toast.success('Connexion réussie');
      nav('/');
    } else {
      toast.error('Identifiants invalides');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow rounded p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Connexion</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Mot de passe"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            Se connecter
          </button>
        </form>
        {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
      </div>
    </div>
  );
}
