
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from '../store/authSlice';
import type { RootState, AppDispatch } from '../store';

// `Profile` : page protégée affichant le profil de l'utilisateur connecté.
// - Au montage, appelle `fetchMe()` pour charger/vérifier le profil.
// - Affiche l'email de l'utilisateur.
// - Si pas connecté, affiche "Non connecté".
export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.auth.user);

  // Au montage, recharge le profil depuis le backend
  useEffect(() => { dispatch(fetchMe()); }, [dispatch]);

  if (!user) return <div className="p-6">Non connecté</div>;

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="bg-white shadow rounded p-6 w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold">Mon profil</h1>
        <p className="mt-2 text-gray-700">Email : {user.email}</p>
      </div>
    </div>
  );
}
