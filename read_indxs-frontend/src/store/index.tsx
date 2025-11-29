import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './slices/filterSlice';
import textsReducer from './slices/textsSlice'; 
import cartReducer from './slices/cartSlice';     
import userReducer from './slices/userSlice';
import readIndxsReducer from './slices/readIndxsSlice';

export const store = configureStore({
    reducer: {
        filter: filterReducer,
        texts: textsReducer, 
        cart: cartReducer, 
        user: userReducer,
        readIndxs: readIndxsReducer,    
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;