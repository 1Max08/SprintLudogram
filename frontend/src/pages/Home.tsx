import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGames, toggleLike } from '../store/gamesSlice';
import type { Game } from '../store/gamesSlice';
import type { RootState, AppDispatch } from '../store';
import toast from 'react-hot-toast';

// Home.tsx : page d'accueil affichant la liste des jeux.
// - Charge les jeux via Redux avec fetchGames().
// - Affiche une grille de cartes avec image, titre, description et bouton like.
// - Gestion des erreurs et notifications avec react-hot-toast.

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.games);

  // Charge les jeux au montage
  useEffect(() => {
    dispatch(fetchGames())
      .unwrap()
      .catch((err: any) => {
        console.error('Erreur fetchGames:', err);
        toast.error('Impossible de charger les jeux.');
      });
  }, [dispatch]);

  const handleLike = async (id: string) => {
    try {
      await dispatch(toggleLike(id)).unwrap();
      toast.success('Like mis à jour !');
    } catch (err) {
      console.error('Erreur toggleLike:', err);
      toast.error('Impossible de mettre à jour le like.');
    }
  };

  if (loading) return <div className="p-6 text-center">Chargement…</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((game: Game) => (
          <div key={game._id} className="bg-white shadow rounded overflow-hidden">
            {game.imageUrl && (
              <img
                src={`http://localhost:4000${game.imageUrl}`}
                alt={game.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold">{game.title}</h3>
              <p className="text-gray-600 mt-2 line-clamp-3">{game.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <button
                  className="px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
                  onClick={() => handleLike(game._id)}
                >
                  ❤️ Like
                </button>
                <span className="text-sm text-gray-500">{game.likes?.length ?? 0} likes</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
