
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

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games/:id" element={<GameDetail />} />
        <Route path="/my-lists" element={<ProtectedRoute><MyLists /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/add-game" element={<ProtectedRoute><AddGame /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}
