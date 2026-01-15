
import type { FormEvent } from 'react';
import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// `Signup` : page d'inscription (form email/password).
// - Envoie un POST /auth/signup avec email et password.
// - Si succès: affiche un toast et redirige vers /login.
// - Si erreur: affiche un toast d'erreur.
export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // flag de chargement local
  const nav = useNavigate();

  // Soumet le formulaire d'inscription
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Appel direct à l'API (pas de Redux thunk ici)
      await api.post('/auth/signup', { email, password });
      toast.success('Compte créé — connecte-toi !');
      nav('/login'); // redirige vers login
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow rounded p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Inscription</h1>
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
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>
      </div>
    </div>
  );
}
