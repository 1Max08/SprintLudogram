
import type { FormEvent } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { createGame } from '../store/gamesSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AddGame() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const nav = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await dispatch(createGame({ title, description, image: image ?? undefined }));
    if (createGame.fulfilled.match(res)) {
      toast.success('Jeu créé !');
      nav(`/games/${res.payload._id}`);
    } else {
      toast.error(String((res as any).payload || 'Erreur création'));
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ajouter un jeu</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Titre" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea className="w-full border rounded p-2" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] ?? null)} />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Publier</button>
      </form>
    </div>
  );
}
