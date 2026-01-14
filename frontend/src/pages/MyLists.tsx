
import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { fetchLists, createList, renameList, deleteList, addItemToList, removeItemFromList } from '../store/listsSlice';
import { fetchGames } from '../store/gamesSlice';
import toast from 'react-hot-toast';

export default function MyLists() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: lists, loading } = useSelector((s: RootState) => s.lists);
  const { items: games } = useSelector((s: RootState) => s.games);

  const [newName, setNewName] = useState('');
  const [selectedGameByList, setSelectedGameByList] = useState<Record<string, string>>({});
  const gameMap = useMemo(() => Object.fromEntries(games.map(g => [g._id, g.title])), [games]);

  useEffect(() => {
    dispatch(fetchLists());
    if (games.length === 0) dispatch(fetchGames());
  }, [dispatch]);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return toast.error('Nom de liste requis');
    const res = await dispatch(createList({ name: newName.trim() }));
    if (createList.fulfilled.match(res)) {
      toast.success('Liste créée');
      setNewName('');
    } else {
      toast.error(String((res.payload as any) || 'Erreur création'));
    }
  };

  const onRename = async (listId: string, name: string) => {
    if (!name.trim()) return toast.error('Nom invalide');
    const res = await dispatch(renameList({ listId, name: name.trim() }));
    if (renameList.fulfilled.match(res)) toast.success('Liste renommée');
    else toast.error(String((res.payload as any) || 'Erreur renommage'));
  };

  const onDelete = async (listId: string) => {
    const res = await dispatch(deleteList({ listId }));
    if (deleteList.fulfilled.match(res)) toast.success('Liste supprimée');
    else toast.error(String((res.payload as any) || 'Erreur suppression'));
  };

  const onAddItem = async (listId: string) => {
    const gameId = selectedGameByList[listId];
    if (!gameId) return toast.error('Choisis un jeu');
    const res = await dispatch(addItemToList({ listId, gameId }));
    if (addItemToList.fulfilled.match(res)) toast.success('Jeu ajouté à la liste');
    else toast.error(String((res.payload as any) || 'Erreur ajout'));
  };

  const onRemoveItem = async (listId: string, gameId: string) => {
    const res = await dispatch(removeItemFromList({ listId, gameId }));
    if (removeItemFromList.fulfilled.match(res)) toast.success('Jeu retiré');
    else toast.error(String((res.payload as any) || 'Erreur retrait'));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mes listes</h1>

      <form onSubmit={onCreate} className="flex gap-2 mb-6">
        <input
          className="border rounded p-2 flex-1"
          placeholder="Nom de la nouvelle liste"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Créer</button>
      </form>

      {loading && <div>Chargement…</div>}

      <div className="grid gap-4 md:grid-cols-2">
        {lists.map(list => (
          <div key={list._id} className="bg-white shadow rounded p-4">
            <div className="flex items-center justify-between">
              <input
                defaultValue={list.name}
                onBlur={e => onRename(list._id, e.target.value)}
                className="font-semibold text-lg outline-none border-b border-transparent focus:border-gray-300"
              />
              <button onClick={() => onDelete(list._id)} className="text-red-600">Supprimer</button>
            </div>

            <div className="mt-3 flex gap-2">
              <select
                className="border rounded p-2 flex-1"
                value={selectedGameByList[list._id] || ''}
                onChange={e => setSelectedGameByList(prev => ({ ...prev, [list._id]: e.target.value }))}
              >
                <option value="">— Choisir un jeu —</option>
                {games.map(g => (
                  <option key={g._id} value={g._id}>{g.title}</option>
                ))}
              </select>
              <button onClick={() => onAddItem(list._id)} className="px-3 py-2 bg-emerald-600 text-white rounded">Ajouter</button>
            </div>

            <ul className="mt-4 space-y-2">
              {list.gameIds.length === 0 && <li className="text-gray-500">Aucun jeu</li>}
              {list.gameIds.map(gid => (
                <li key={gid} className="flex items-center justify-between border rounded p-2">
                  <span>{gameMap[gid] || gid}</span>
                  <button onClick={() => onRemoveItem(list._id, gid)} className="text-red-600">Retirer</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
