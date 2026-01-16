// src/store/hooks.ts
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Hook simple pour dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Hook simple pour useSelector
export const useAppSelector = useSelector as unknown as <TSelected>(selector: (state: RootState) => TSelected) => TSelected;
