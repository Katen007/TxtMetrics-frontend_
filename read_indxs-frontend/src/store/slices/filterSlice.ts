import { createSlice } from '@reduxjs/toolkit';
import { logoutUser } from './userSlice'; 
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import type { FilterState } from '../../types';



const initialState: FilterState = {
    serviceFilter: '',
};

export const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setServiceFilter: (state, action: PayloadAction<string>) => {
            state.serviceFilter = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.serviceFilter = '';
        });
    },
});

export const { setServiceFilter } = filterSlice.actions;
export const selectServiceFilter = (state: RootState) => state.filter.serviceFilter;
export default filterSlice.reducer;