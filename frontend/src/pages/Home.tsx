
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGames, toggleLike } from '../store/gamesSlice';
import type { Game } from '../store/gamesSlice';
import type { RootState, AppDispatch } from '../store';

// `Home` : page d'accueil affichant la liste de tous les jeux.
// - Charge les jeux avec `fetchGames()` au montage.
// - Affiche une grille de cartes jeux avec image, titre, description.
// - Chaque carte a un bouton like; `toggleLike(id)` envoie au backend et met à jour l'état.
export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((s: RootState) => s.games);

  // Au montage, charge la liste des jeux depuis le backend
  useEffect(() => { dispatch(fetchGames()); }, [dispatch]);

  if (loading) return <div className="p-6">Chargement…</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((g: Game) => (
          <div key={g._id} className="bg-white shadow rounded p-4">
            {g.imageUrl && <img src={g.imageUrl} alt={g.title} className="w-full h-40 object-cover rounded" />}
            <h3 className="mt-2 text-xl font-semibold">{g.title}</h3>
            <p className="text-gray-600">{g.description}</p>
            <div className="mt-3 flex items-center gap-2">
              <button
                className="px-3 py-1 bg-pink-600 text-white rounded"
                onClick={() => dispatch(toggleLike(g._id))}
              >
                ❤️ Like
              </button>
              <span className="text-sm text-gray-500">{g.likes?.length ?? 0} likes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
