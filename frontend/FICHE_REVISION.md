# 📋 FICHE DE RÉVISION – Frontend LudoHub

## Architecture Générale

```
main.tsx
  ↓
Provider (Redux store)
  ↓
BrowserRouter (react-router)
  ↓
App.tsx (Routes)
  ├─ /                  → Home (liste des jeux)
  ├─ /games/:id        → GameDetail (détail d'un jeu)
  ├─ /login            → Login
  ├─ /signup           → Signup
  ├─ /profile          → Profile (privé)
  ├─ /add-game         → AddGame (privé)
  └─ /my-lists         → MyLists (privé)
```

---

## 🔑 Concepts Clés

### Redux Store (`src/store/`)

**3 slices :**
- `authSlice` : `user`, `loading`, `error`
- `gamesSlice` : `items[]`, `current`, `loading`, `error`
- `listsSlice` : `items[]`, `loading`, `error`

**RootState & AppDispatch** : types TypeScript pour `useSelector` / `useDispatch`

---

## 📄 Fichiers Principaux

### `src/main.tsx`
- **Rôle** : Point d'entrée React
- **Ligne clé** : `<Provider store={store}>` → Redux disponible partout
- **Ligne clé** : `<BrowserRouter>` → Routes disponibles partout
- **À retenir** : `React.StrictMode` aide à détecter les problèmes en dev

### `src/App.tsx`
- **Rôle** : Définit les routes et affiche Navbar + Toaster
- **Point** : Routes protégées sont enveloppées par `<ProtectedRoute>`
- **Classes** : Tailwind (`container mx-auto px-4 py-8`)

### `src/components/Navbar.tsx`
- **Lit** : `user` depuis le store
- **Affiche** : Liens différents selon que l'utilisateur est connecté
- **Action** : `logout()` → POST `/auth/logout` + `dispatch(logoutLocal())`
- **À savoir** : `logoutLocal()` vide l'utilisateur localement côté client

### `src/components/ProtectedRoute.tsx`
- **Check** : Si `!user` → redirect `/login`
- **Sinon** : Affiche les children
- **Simple** : 4 lignes de code essentiel

---

## 🔐 Authentification (`src/store/authSlice.ts`)

### Thunks
| Thunk | Action | Retour |
|-------|--------|--------|
| `loginUser({email, password})` | POST `/auth/login` | `User` |
| `fetchMe()` | GET `/auth/me` | `User` |

### Actions
| Action | Effet |
|--------|-------|
| `logoutLocal()` | Vide `state.user = null` |

### État
```typescript
{
  user: User | null,    // l'utilisateur connecté ou null
  loading: boolean,     // true pendant une requête
  error?: string        // message d'erreur si échec
}
```

### Clé importante
```typescript
const res = await dispatch(loginUser({...}));
if (loginUser.fulfilled.match(res)) {
  // Succès
} else {
  // Erreur
}
```

---

## 🎮 Jeux (`src/store/gamesSlice.ts`)

### Thunks
| Thunk | Action | Retour |
|-------|--------|--------|
| `fetchGames()` | GET `/games` | `Game[]` |
| `fetchGameById(id)` | GET `/games/:id` | `Game` |
| `createGame({title, description, image})` | POST `/games` (FormData) | `Game` |
| `toggleLike(id)` | POST `/games/:id/like` | `{liked, likesCount, id}` |

### Type `Game`
```typescript
{
  _id: string,
  title: string,
  description?: string,
  imageUrl?: string,
  ownerId: string,
  likes?: string[]  // liste des IDs qui aiment ce jeu
}
```

### État
```typescript
{
  items: Game[],         // tous les jeux
  current?: Game | null, // jeu en détail (GameDetail)
  loading: boolean,
  error?: string
}
```

---

## 📝 Listes (`src/store/listsSlice.ts`)

### Thunks (CRUD complet)
| Thunk | Action |
|-------|--------|
| `fetchLists()` | GET `/lists` |
| `createList({name})` | POST `/lists` |
| `renameList({listId, name})` | PATCH `/lists/:listId` |
| `deleteList({listId})` | DELETE `/lists/:listId` |
| `addItemToList({listId, gameId})` | POST `/lists/:listId/items` |
| `removeItemFromList({listId, gameId})` | DELETE `/lists/:listId/items/:gameId` |

### Type `List`
```typescript
{
  _id: string,
  name: string,
  ownerId: string,
  gameIds: string[]  // IDs des jeux dedans
}
```

---

## 🌐 API (`src/services/api.ts`)

```typescript
const api = axios.create({
  baseURL: 'http://localhost:4000/api',  // backend local
  withCredentials: true                   // envoie les cookies
});
```

**Utilisation** : `api.get('/games')` → `GET http://localhost:4000/api/games`

---

## 📄 Pages (src/pages/)

### `Home.tsx`
- Affiche grille de jeux (`fetchGames()`)
- Bouton like sur chaque jeu
- **Clé** : `useEffect(() => { dispatch(fetchGames()); }, [])`

### `GameDetail.tsx`
- Affiche un seul jeu détaillé
- **Clé** : `useParams()` récupère l'ID depuis l'URL
- **Clé** : `fetchGameById(id)` au montage

### `Login.tsx`
- Form email/password
- Appelle `dispatch(loginUser({email, password}))`
- Si succès → `dispatch(fetchMe())` + redirige `/`
- **Toast** : succès ou erreur

### `Signup.tsx`
- Form email/password
- `api.post('/auth/signup', {email, password})`
- Si succès → redirige `/login`
- **Toast** : succès ou erreur

### `Profile.tsx`
- Page protégée
- Affiche `user.email`
- `fetchMe()` au montage pour recharger le profil

### `AddGame.tsx`
- Page protégée
- Form : titre, description, upload image
- `createGame({title, description, image: File})`
- Si succès → redirige vers `/games/:id` (le jeu créé)

### `MyLists.tsx`
- Page protégée
- CRUD complet : créer, renommer, supprimer listes
- Ajouter/retirer jeux dans/de listes
- **Complexe** : 6 thunks différents

---

## 🎯 Expressions Importantes

| Expression | Signification |
|------------|---------------|
| `useSelector((s: RootState) => s.auth.user)` | Récupère l'utilisateur depuis le store |
| `useDispatch<AppDispatch>()` | Hook pour dispatcher des actions/thunks |
| `dispatch(fetchGames())` | Exécute un thunk asynchrone |
| `loginUser.fulfilled.match(res)` | Vérifie si le thunk a réussi |
| `useParams()` | Récupère les paramètres de route (ex: `:id`) |
| `useNavigate()` | Hook pour rediriger sans recharger |
| `toast.success/error(msg)` | Affiche une notification (react-hot-toast) |
| `FormData()` | Objet pour envoyer fichiers binaires (images) |
| `withCredentials: true` | Envoie les cookies au backend |

---

## 🔗 Flow Authentification

```
[User enters /login]
        ↓
[Form submit]
        ↓
dispatch(loginUser({email, password}))
        ↓
POST /auth/login (api call)
        ↓
if success:
  - set state.auth.user
  - dispatch(fetchMe()) to hydrate user
  - toast.success
  - navigate('/')
else:
  - set state.auth.error
  - toast.error
```

---

## 🔗 Flow Ajout de Jeu

```
[User on /add-game (protected)]
        ↓
[Form: titre, description, image]
        ↓
dispatch(createGame({...}))
        ↓
POST /games (FormData with image)
        ↓
if success:
  - game added to state.games.items
  - toast.success
  - navigate(`/games/${res.payload._id}`)
else:
  - set state.games.error
  - toast.error
```

---

## 📌 Rappels à Dire

1. **Entrée** : `main.tsx` rend `App` dans un `Provider` Redux + `BrowserRouter`.
2. **Routes** : `App.tsx` centralise tout; les routes protégées utilisent `ProtectedRoute`.
3. **Auth** : `authSlice` gère login/logout; `fetchMe()` recharge le profil.
4. **API** : Instance Axios avec `baseURL` backend + `withCredentials`.
5. **Store** : 3 slices (auth, games, lists); chaque slice = thunks + reducers.
6. **Async** : Les thunks envoient des requêtes et gèrent `pending/fulfilled/rejected`.
7. **UI** : Tailwind + toast pour notification; `useParams()` pour URL params.
8. **Images** : `FormData` pour uploads; `Content-Type: multipart/form-data`.
9. **Listes** : CRUD complet; `gameIds` stocke les IDs des jeux dedans.
10. **Likes** : Bouton togglable; backend gère le statut, UI met à jour la liste.

---

**Bonne présentation ! 🚀**
