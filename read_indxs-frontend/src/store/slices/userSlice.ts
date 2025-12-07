import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import type { 
    HandlerUserCredentials, 
    ModelsAuthoResp, 
    DsUser 
} from '../../api/Api';

// Тип состояния пользователя
interface UserState {
    user: DsUser | null;      
    token: string | null;        
    isAuthenticated: boolean;    
    registerSuccess: boolean;   
    loading: boolean;         
    error: string | null;      
}

const storedToken = localStorage.getItem('authToken');
const storedUser = localStorage.getItem('userInfo');

const initialState: UserState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    isAuthenticated: false,
    registerSuccess: false,
    loading: false,
    error: null,
};

// --- 1. ВХОД (Login) ---
export const loginUser = createAsyncThunk(
    'user/login',
    async (credentials: HandlerUserCredentials, { dispatch, rejectWithValue }) => {
        try {
            const response = await api.auth.loginCreate(credentials);
            const data = response.data;
            console.log('Login response data:', data);
            if (data.data?.AccessToken) localStorage.setItem('authToken', data.data.AccessToken);
            console.log('Login response data:', localStorage.getItem('authToken'));
            await dispatch(fetchUserProfile());
            return data;
        } catch (err: any) {
            const backendError = err.response?.data?.description || '';
            let readableError = 'Ошибка авторизации';
            if (backendError.includes('record not found')) {
                readableError = 'Пользователь с таким логином не найден';
            } else if (backendError.includes('hashedPassword is not the hash') || backendError.includes('password')) {
                readableError = 'Неверный пароль';
            } else if (backendError) {
                readableError = backendError;
            }

            return rejectWithValue(readableError);
        }
    }
);

// --- 2. РЕГИСТРАЦИЯ (Register) ---
export const registerUser = createAsyncThunk(
    'user/register',
    async (credentials: HandlerUserCredentials, { dispatch, rejectWithValue }) => {
        try {
            const response = await api.users.registerCreate(credentials);
            dispatch(fetchUserProfile());
            return response.data; 
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.description || 'Ошибка регистрации');
        }
    }
);

// --- 3. ВЫХОД (Logout) ---
export const logoutUser = createAsyncThunk(
    'user/logout',
    async () => {
        try {
            await api.auth.logoutCreate(null);
        } catch (err) {
            console.warn('Logout failed on backend, clearing local anyway');
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');
        }
    }
);

// --- 4. ПОЛУЧЕНИЕ ПРОФИЛЯ ---
export const fetchUserProfile = createAsyncThunk(
    'user/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.users.getUsers();
            //localStorage.setItem('userInfo', JSON.stringify(response.data));
            return response.data;
        } catch (err: any) {
            return rejectWithValue('Не удалось загрузить профиль');
        }
    }
);

// --- 5. ОБНОВЛЕНИЕ ПРОФИЛЯ ---
export const updateUserProfile = createAsyncThunk(
    'user/updateProfile',
    async ({id, data }: {id:number, data: HandlerUserCredentials }, { rejectWithValue }) => {
        try {
            await api.users.usersUpdate(id,data);
            return {id, ...data }; 
        } catch (err: any) {
            console.error(
                "updateUserProfile error:",
                err?.response?.data ?? err
            );
            const msg =
                err?.response?.data?.description || "Ошибка обновления";
            return rejectWithValue(msg);
            }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetRegisterSuccess: (state) => {
            state.registerSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // === LOGIN ===
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.data?.AccessToken || null;
                //state.user =  null; // TODO: rewrite
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // === REGISTER ===
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.registerSuccess = false;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.registerSuccess = true; 
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // === LOGOUT ===
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            })

            // === FETCH PROFILE ===
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                //localStorage.setItem("userInfo", JSON.stringify(action.payload));
            })
            // в builder в extraReducers:

            .addCase(updateUserProfile.fulfilled, (state, action) => {
                if (state.user) {
                    if (action.payload.login) state.user.login = action.payload.login;
                }
                //localStorage.setItem('userInfo', JSON.stringify(state.user));
            });


            // === UPDATE PROFILE ===
            // .addCase(updateUserProfile.fulfilled, (state, action) => {
            //     if (state.user) {
            //         if (action.payload.login) state.user.login = action.payload.login;
            //     }
            //     localStorage.setItem('userInfo', JSON.stringify(state.user));
            // });
    },
});

export const { clearError, resetRegisterSuccess } = userSlice.actions;
export default userSlice.reducer;