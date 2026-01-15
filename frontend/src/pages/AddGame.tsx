
import type { FormEvent } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { createGame } from '../store/gamesSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// `AddGame` : page protégée pour créer un nouveau jeu.
// - Form avec titre, description, et upload d'image.
// - `createGame()` envoie un FormData (multipart) au backend.
// - Si succès: crée le jeu et redirige vers /games/:id.
// - Si erreur: affiche un toast d'erreur.
export default function AddGame() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null); // image uploadée
  const dispatch = useDispatch<AppDispatch>();
  const nav = useNavigate();

  // Soumet le formulaire d'ajout de jeu
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // `createGame` thunk gère le FormData et le multipart
    const res = await dispatch(createGame({ title, description, image: image ?? undefined }));
    if (createGame.fulfilled.match(res)) {
      toast.success('Jeu créé !');
      nav(`/games/${res.payload._id}`); // redirige vers la page détail du jeu
    } else {
      toast.error(String((res as any).payload || 'Erreur création'));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow rounded p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Ajouter un jeu</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Titre"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] ?? null)} />
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Publier</button>
        </form>
      </div>
    </div>
  );
}
