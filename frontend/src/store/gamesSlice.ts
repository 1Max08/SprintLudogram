import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../services/api';

// =======================
// Types
// =======================

export type Game = {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  ownerId: string;
  likes?: string[];
};

type GamesState = {
  items: Game[];
  current: Game | null;
  loading: boolean;
  error: string | null;
};

const initialState: GamesState = {
  items: [],
  current: null,
  loading: false,
  error: null,
};

// =======================
// Thunks
// =======================

// GET /api/games
export const fetchGames = createAsyncThunk<
  Game[],
  void,
  { rejectValue: string }
>('games/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/games');
    return res.data as Game[];
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.error || 'FETCH_GAMES_FAILED');
  }
});

// GET /api/games/:id
export const fetchGameById = createAsyncThunk<
  Game,
  string,
  { rejectValue: string }
>('games/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/games/${id}`);
    return res.data as Game;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.error || 'FETCH_GAME_FAILED');
  }
});

// POST /api/games
export const createGame = createAsyncThunk<
  Game,
  { title: string; description?: string; image?: File },
  { rejectValue: string }
>('games/create', async (payload, { rejectWithValue }) => {
  try {
    const fd = new FormData();
    fd.append('title', payload.title);
    if (payload.description) fd.append('description', payload.description);
    if (payload.image) fd.append('image', payload.image);

    const res = await api.post('/games', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res.data as Game;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.error || 'CREATE_GAME_FAILED');
  }
});

// POST /api/games/:id/like
export const toggleLike = createAsyncThunk<
  { id: string; liked: boolean },
  string,
  { rejectValue: string }
>('games/toggleLike', async (id, { rejectWithValue }) => {
  try {
    const res = await api.post(`/games/${id}/like`);
    return { id, liked: res.data.liked };
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.error || 'LIKE_FAILED');
  }
});

// =======================
// Slice
// =======================

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // fetchGames
      .addCase(fetchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action: PayloadAction<Game[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erreur lors du chargement des jeux';
      })

      // fetchGameById
      .addCase(fetchGameById.fulfilled, (state, action) => {
        state.current = action.payload;
      })

      // createGame
      .addCase(createGame.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      // toggleLike
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { id, liked } = action.payload;
        const game =
          state.items.find((g) => g._id === id) ||
          (state.current?._id === id ? state.current : null);

        if (!game) return;

        const likes = game.likes ?? [];

        game.likes = liked
          ? [...likes, 'me']
          : likes.slice(0, Math.max(likes.length - 1, 0));
      });
  },
});

export default gamesSlice.reducer;
