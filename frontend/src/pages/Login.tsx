
import type { FormEvent } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, fetchMe } from '../store/authSlice';
import type { AppDispatch, RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const nav = useNavigate();
  const { loading, error } = useSelector((s: RootState) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(res)) {
      await dispatch(fetchMe()); // hydrate le profil
      toast.success('Connexion réussie');
      nav('/');
    } else {
      toast.error('Identifiants invalides');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Connexion</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>Se connecter</button>
      </form>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
