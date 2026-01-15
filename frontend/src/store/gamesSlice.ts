
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Type d'un jeu complet
export type Game = {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  ownerId: string;
  likes?: string[]; // liste des IDs d'utilisateurs qui aiment ce jeu
};

// État des jeux dans le store
type GamesState = {
  items: Game[]; // liste de tous les jeux
  current?: Game | null; // jeu actuellement consulté (détail)
  loading: boolean; // flag pour les requêtes en cours
  error?: string; // message d'erreur éventuel
};

const initialState: GamesState = { items: [], current: null, loading: false };

// Thunk: récupérer tous les jeux (GET /games)
export const fetchGames = createAsyncThunk<Game[]>('games/fetchAll', async () => {
  const res = await api.get('/games');
  return res.data.data as Game[];
});

// Thunk: récupérer un jeu spécifique par ID (GET /games/:id)
export const fetchGameById = createAsyncThunk<Game, string>('games/fetchById', async (id) => {
  const res = await api.get(`/games/${id}`);
  return res.data.data as Game;
});

// Thunk: créer un nouveau jeu (POST /games avec FormData pour l'image)
export const createGame = createAsyncThunk<Game, { title: string; description?: string; image?: File }>(
  'games/create',
  async (payload, { rejectWithValue }) => {
    try {
      // FormData pour envoyer fichier binaire + champs texte
      const fd = new FormData();
      fd.append('title', payload.title);
      if (payload.description) fd.append('description', payload.description);
      if (payload.image) fd.append('image', payload.image);
      const res = await api.post('/games', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      return res.data.data as Game;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.error || 'CREATE_FAILED');
    }
  }
);

// Thunk: basculer le like d'un jeu (POST /games/:id/like)
export const toggleLike = createAsyncThunk<{ liked: boolean; likesCount: number; id: string }, string>(
  'games/toggleLike',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.post(`/games/${id}/like`);
      return { ...res.data.data, id }; // backend renvoie { liked, likesCount }
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.error || 'LIKE_FAILED');
    }
  }
);

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    // fetchGames: charge la liste complète
    b.addCase(fetchGames.pending, (s) => { s.loading = true; })
     .addCase(fetchGames.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
     .addCase(fetchGames.rejected, (s, a) => { s.loading = false; s.error = String(a.error.message); })
     // fetchGameById: met à jour le jeu courant (détail)
     .addCase(fetchGameById.fulfilled, (s, a) => { s.current = a.payload; })
     // createGame: ajoute le nouveau jeu au début de la liste
     .addCase(createGame.fulfilled, (s, a) => { s.items.unshift(a.payload); })
     // toggleLike: met à jour l'array likes du jeu
     .addCase(toggleLike.fulfilled, (s, a) => {
       const { id, liked } = a.payload;
       const game = s.items.find(g => g._id === id) || (s.current && s.current._id === id ? s.current : null);
       if (game) {
         const likes = game.likes || [];
         if (liked) {
           game.likes = [...likes, 'me']; // marqueur local; côté UI on se base sur length
         } else {
           game.likes = likes.slice(0, Math.max(likes.length - 1, 0));
         }
       }
     });
  }
});

export default gamesSlice.reducer;
