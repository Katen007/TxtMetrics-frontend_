// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './filtersSlice';

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    // ...другие редьюсеры
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
