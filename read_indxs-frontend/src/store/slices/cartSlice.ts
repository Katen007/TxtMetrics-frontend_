import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import { logoutUser } from './userSlice';



interface CartState {
    readIndxs_id: number | null;
    count: number;
    loading: boolean;
    error: string | null
}

const initialState: CartState = {
    readIndxs_id: null,
    count: 0,
    loading: false,
    error: null,
};

// Получение бейджика
export const fetchCartBadge = createAsyncThunk(
    'cart/fetchCartBadge',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.readindxs.myTextCartList();
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch cart');
        }
    }
);

// Добавление текста в черновик 
export const addFactorToDraft = createAsyncThunk(
    'cart/addToDraft',
    async (textId: number, { dispatch, rejectWithValue }) => {
        try {
            await api.texts.addToDraftCreate(textId);
            dispatch(fetchCartBadge());
            return textId;
        } catch (error: any) {
            
            return rejectWithValue('Failed to add');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartBadge.fulfilled, (state, action) => {
                state.readIndxs_id = action.payload.draft_readIndxs_id || null;
                state.count = action.payload.texts_count || 0;
            })
            .addCase(fetchCartBadge.rejected, (state) => {
                state.readIndxs_id = null;
                state.count = 0;
            })
            .addCase(logoutUser.fulfilled, () => initialState);
    }
});

export default cartSlice.reducer;