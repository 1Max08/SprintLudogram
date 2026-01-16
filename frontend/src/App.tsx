import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchMe } from './store/authSlice';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import GameDetail from './pages/GameDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AddGame from './pages/AddGame';
import MyLists from './pages/MyLists';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.auth);

  //  Récupérer l'utilisateur connecté au démarrage
useEffect(() => {
  console.log('Dispatching fetchMe...');
  dispatch(fetchMe())
    .unwrap()
    .then(data => console.log('fetchMe success:', data))
    .catch(err => console.error('fetchMe error:', err));
}, [dispatch]);

useEffect(() => {
  import('./services/api').then(({ default: api }) => {
    api.get('/auth/dashboard')
      .then(res => console.log('Dashboard user:', res.data))
      .catch(err => console.error('Dashboard error:', err));
  });
}, []);


  return (
    <div className="min-h-screen">
      <Toaster />
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {loading && <p>Chargement de l'utilisateur…</p>}

        <Routes>
          {/* Pages publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/games/:id" element={<GameDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Pages privées sans ProtectedRoute */}
          <Route path="/my-lists" element={<MyLists />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-game" element={<AddGame />} />
        </Routes>
      </main>
    </div>
  );
}
