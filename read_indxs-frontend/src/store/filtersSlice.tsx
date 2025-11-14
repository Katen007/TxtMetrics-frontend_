// src/store/filterSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type FilterState } from '../types/index';

const initialState: FilterState = {
  serviceFilter: '',
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setServiceFilter(state, action: PayloadAction<string>) {
      state.serviceFilter = action.payload;
    },
    clearServiceFilter(state) {
      state.serviceFilter = '';
    },
  },
});

export const { setServiceFilter, clearServiceFilter } = filterSlice.actions;
export default filterSlice.reducer;
