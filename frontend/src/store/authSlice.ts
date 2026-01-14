
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

type User = { id: string; email: string; roles?: string[] | undefined };

type AuthState = {
  user: User | null;
  loading: boolean;
  error?: string;
};

const initialState: AuthState = { user: null, loading: false };

export const loginUser = createAsyncThunk<User, { email: string; password: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', credentials);
      return res.data.data as User;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.error || 'LOGIN_FAILED');
    }
  }
);

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
    logoutLocal(state) {
      state.user = null;
    },
  },
  extraReducers: (b) => {
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
