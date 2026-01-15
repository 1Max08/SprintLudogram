
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

// `store` centralise l'état de l'application (Redux Toolkit).
// - combine les reducers `auth`, `games`, `lists`.
// - `RootState` et `AppDispatch` sont des helpers TypeScript utiles
//   pour typer `useSelector` et `useDispatch` dans les composants.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
