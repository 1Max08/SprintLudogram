
import type { FormEvent } from 'react';
import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/signup', { email, password });
      toast.success('Compte créé — connecte-toi !');
      nav('/login');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inscription</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="px-4 py-2 bg-green-600 text-white rounded" disabled={loading}>{loading ? 'Création...' : 'Créer mon compte'}</button>
      </form>
    </div>
  );
}
