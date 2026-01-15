
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Type utilisateur minimal utilisé dans l'app
type User = { id: string; email: string; roles?: string[] | undefined };

// État d'authentification côté client
type AuthState = {
  user: User | null; // null si non connecté
  loading: boolean; // pour indiquer les requêtes en cours
  error?: string; // message d'erreur éventuel
};

const initialState: AuthState = { user: null, loading: false };

// Thunk pour l'action de login : envoie email/password au backend
export const loginUser = createAsyncThunk<User, { email: string; password: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', credentials);
      // backend renvoie { data: user }
      return res.data.data as User;
    } catch (err: any) {
      // rejectWithValue permet de récupérer l'erreur dans `rejected`
      return rejectWithValue(err?.response?.data?.error || 'LOGIN_FAILED');
    }
  }
);

// Thunk pour récupérer l'utilisateur courant (session existante)
export const fetchMe = createAsyncThunk<User>(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/auth/me');
      return res.data.data as User;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.error || 'UNAUTHENTICATED');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // action locale pour vider l'utilisateur (utilisée après logout)
    logoutLocal(state) {
      state.user = null;
    },
  },
  extraReducers: (b) => {
    // Gestion automatique des états pending/fulfilled/rejected des thunks
    b.addCase(loginUser.pending, (s) => { s.loading = true; s.error = undefined; })
     .addCase(loginUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
     .addCase(loginUser.rejected, (s, a) => { s.loading = false; s.error = String(a.payload); })
     .addCase(fetchMe.pending, (s) => { s.loading = true; })
     .addCase(fetchMe.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
     .addCase(fetchMe.rejected, (s) => { s.loading = false; });
  }
});

export const { logoutLocal } = authSlice.actions;
export default authSlice.reducer;
