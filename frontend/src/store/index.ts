
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import gamesReducer from './gamesSlice';
import listsReducer from './listsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    games: gamesReducer,
    lists: listsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
