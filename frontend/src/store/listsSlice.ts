import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Type d'une liste de jeux
export type List = {
  _id: string;
  name: string;
  ownerId: string;
  gameIds: string[]; // IDs des jeux dans cette liste
};

// État des listes de l'utilisateur
type ListsState = {
  items: List[];
  loading: boolean;
  error?: string;
};

const initialState: ListsState = { items: [], loading: false };

// Thunk: récupérer toutes les listes de l'utilisateur (GET /lists)
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

// Thunk: créer une nouvelle liste (POST /lists)
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

// Thunk: renommer une liste (PATCH /lists/:listId)
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

// Thunk: supprimer une liste (DELETE /lists/:listId)
export const deleteList = createAsyncThunk<string, { listId: string }>(
  'lists/delete',
  async ({ listId }, { rejectWithValue }) => {
    try {
      await api.delete(`/lists/${listId}`);
      return listId; // retourne l'id pour l'identifier dans le reducer
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.error || 'DELETE_LIST_FAILED');
    }
  }
);

// Thunk: ajouter un jeu à une liste (POST /lists/:listId/items)
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

// Thunk: retirer un jeu d'une liste (DELETE /lists/:listId/items/:gameId)
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
    // fetchLists: charge la liste des listes de l'utilisateur
    b.addCase(fetchLists.pending, (s) => { s.loading = true; s.error = undefined; })
     .addCase(fetchLists.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
     .addCase(fetchLists.rejected, (s, a) => { s.loading = false; s.error = String(a.payload); })
     // createList: ajoute la nouvelle liste au début
     .addCase(createList.fulfilled, (s, a) => { s.items.unshift(a.payload); })
     // renameList: met à jour le nom de la liste
     .addCase(renameList.fulfilled, (s, a) => {
       const i = s.items.findIndex(l => l._id === a.payload._id);
       if (i !== -1) s.items[i] = a.payload;
     })
     // deleteList: retire la liste du store
     .addCase(deleteList.fulfilled, (s, a) => {
       s.items = s.items.filter(l => l._id !== a.payload);
     })
     // addItemToList: ajoute l'id du jeu à gameIds
     .addCase(addItemToList.fulfilled, (s, a) => {
       const list = s.items.find(l => l._id === a.payload.listId);
       if (list && !list.gameIds.includes(a.payload.gameId)) list.gameIds.push(a.payload.gameId);
     })
     // removeItemFromList: retire l'id du jeu de gameIds
     .addCase(removeItemFromList.fulfilled, (s, a) => {
       const list = s.items.find(l => l._id === a.payload.listId);
       if (list) list.gameIds = list.gameIds.filter(id => id !== a.payload.gameId);
     });
  }
});

export default listsSlice.reducer;
