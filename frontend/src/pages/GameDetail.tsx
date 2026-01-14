
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGameById, toggleLike } from '../store/gamesSlice';
import type { RootState, AppDispatch } from '../store';

export default function GameDetail() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const game = useSelector((s: RootState) => s.games.current);

  useEffect(() => {
    if (id) dispatch(fetchGameById(id));
  }, [id, dispatch]);

  if (!game) return <div className="p-6">Aucun jeu trouvé</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {game.imageUrl && <img src={game.imageUrl} alt={game.title} className="w-full h-64 object-cover rounded" />}
      <h1 className="mt-3 text-3xl font-bold">{game.title}</h1>
      <p className="mt-2 text-gray-700">{game.description}</p>
      <button
        className="mt-4 px-4 py-2 bg-pink-600 text-white rounded"
        onClick={() => dispatch(toggleLike(game._id))}
      >
        ❤️ Like ({game.likes?.length ?? 0})
      </button>
    </div>
  );
}
