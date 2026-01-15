
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GameDetail from './pages/GameDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AddGame from './pages/AddGame';
import MyLists from './pages/MyLists';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// App.tsx: centralise les routes de l'application.
// - `Navbar` est rendu sur toutes les pages.
// - `Toaster` affiche les notifications toast (ex: succès / erreur).
// - Les routes protégées sont enveloppées par `ProtectedRoute`.

export default function App() {
  return (
    <div className="min-h-screen">
      <Toaster />
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
        {/* Page publique: liste des jeux */}
        <Route path="/" element={<Home />} />

        {/* Détail d'un jeu (paramètre `:id`) */}
        <Route path="/games/:id" element={<GameDetail />} />

        {/* Pages privées: nécessitent que l'utilisateur soit connecté */}
        <Route path="/my-lists" element={<ProtectedRoute><MyLists /></ProtectedRoute>} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Profil et ajout de contenu */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/add-game" element={<ProtectedRoute><AddGame /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}
