import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Type utilisateur minimal
type User = { id: string; email: string; username?: string; avatarUrl?: string; roles?: string[] };

type AuthState = {
  user: User | null;
  loading: boolean;
  error?: string;
};

const initialState: AuthState = { user: null, loading: false };

// LOGIN
export const loginUser = createAsyncThunk<User, { email: string; password: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', credentials);
      // le cookie JWT est envoyé automatiquement, donc pas besoin de token ici
      return res.data.user as User; // adapte selon la réponse de ton backend
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'LOGIN_FAILED');
    }
  }
);

// FETCH ME
export const fetchMe = createAsyncThunk<User>(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/auth/dashboard');
      // backend renvoie {id, username, email} directement
      return res.data as User; 
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'UNAUTHENTICATED');
    }
  }
);


// SIGNUP
export const signupUser = createAsyncThunk<User, { username: string; email: string; password: string }>(
  'auth/signup',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/signup', credentials);
      return res.data.user as User;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'SIGNUP_FAILED');
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout'); // supprime cookie côté backend
      return true;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'LOGOUT_FAILED');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutLocal(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload);
      })
      // FETCH ME
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = String(action.payload);
      })
      // SIGNUP
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload);
      })
      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
      });
  },
});

export const { logoutLocal } = authSlice.actions;
export default authSlice.reducer;
