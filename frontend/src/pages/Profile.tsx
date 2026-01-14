
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from '../store/authSlice';
import type { RootState, AppDispatch } from '../store';

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.auth.user);

  useEffect(() => { dispatch(fetchMe()); }, [dispatch]);

  if (!user) return <div className="p-6">Non connecté</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Mon profil</h1>
      <p className="mt-2 text-gray-700">Email : {user.email}</p>
    </div>
  );
}
