
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export type List = {
  _id: string;
  name: string;
  ownerId: string;
  gameIds: string[]; // IDs des jeux
};

type ListsState = {
  items: List[];
  loading: boolean;
  error?: string;
};

const initialState: ListsState = { items: [], loading: false };

export const fetchLists = createAsyncThunk<List[]>(
  'lists/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/lists');
      return res.data.data as List[];
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.error || 'FETCH_LISTS_FAILED');
    }
  }
);

export const createList = createAsyncThunk<List, { name: string }>(
  'lists/create',
  async ({ name }, { rejectWithValue }) => {
    try {
      const res = await api.post('/lists', { name });
      return res.data.data as List;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.error || 'CREATE_LIST_FAILED');
    }
  }
);

export const renameList = createAsyncThunk<List, { listId: string; name: string }>(
  'lists/rename',
  async ({ listId, name }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/lists/${listId}`, { name });
      return res.data.data as List;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.error || 'RENAME_LIST_FAILED');
    }
  }
);

export const deleteList = createAsyncThunk<string, { listId: string }>(
  'lists/delete',
  async ({ listId }, { rejectWithValue }) => {
    try {
      await api.delete(`/lists/${listId}`);
      return listId;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.error || 'DELETE_LIST_FAILED');
    }
  }
);

export const addItemToList = createAsyncThunk<{ listId: string; gameId: string } , { listId: string; gameId: string }>(
  'lists/addItem',
  async ({ listId, gameId }, { rejectWithValue }) => {
    try {
      await api.post(`/lists/${listId}/items`, { gameId });
      return { listId, gameId };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.error || 'ADD_ITEM_FAILED');
    }
  }
);

export const removeItemFromList = createAsyncThunk<{ listId: string; gameId: string }, { listId: string; gameId: string }>(
  'lists/removeItem',
  async ({ listId, gameId }, { rejectWithValue }) => {
    try {
      await api.delete(`/lists/${listId}/items/${gameId}`);
      return { listId, gameId };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.error || 'REMOVE_ITEM_FAILED');
    }
  }
);

const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchLists.pending, (s) => { s.loading = true; s.error = undefined; })
     .addCase(fetchLists.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
     .addCase(fetchLists.rejected, (s, a) => { s.loading = false; s.error = String(a.payload); })
     .addCase(createList.fulfilled, (s, a) => { s.items.unshift(a.payload); })
     .addCase(renameList.fulfilled, (s, a) => {
       const i = s.items.findIndex(l => l._id === a.payload._id);
       if (i !== -1) s.items[i] = a.payload;
     })
     .addCase(deleteList.fulfilled, (s, a) => {
       s.items = s.items.filter(l => l._id !== a.payload);
     })
     .addCase(addItemToList.fulfilled, (s, a) => {
       const list = s.items.find(l => l._id === a.payload.listId);
       if (list && !list.gameIds.includes(a.payload.gameId)) list.gameIds.push(a.payload.gameId);
     })
     .addCase(removeItemFromList.fulfilled, (s, a) => {
       const list = s.items.find(l => l._id === a.payload.listId);
       if (list) list.gameIds = list.gameIds.filter(id => id !== a.payload.gameId);
     });
  }
});

export default listsSlice.reducer;
