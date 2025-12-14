import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import type {
    HandlerUserCredentials,
    //ModelsAuthoResp,
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

const initialState: UserState = {
    user: null,                          // НЕ берём из localStorage
    token: storedToken || null,
    isAuthenticated: !!storedToken,      // если есть токен – попробуем подтянуть профиль
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

            if (data.data?.AccessToken) {
                localStorage.setItem('authToken', data.data.AccessToken);
            }

            // Сразу же подгружаем профиль пользователя с сервера
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
            // После регистрации можем сразу подтянуть профиль (если бэкенд логинит автоматически)
            // либо оставить только регистрацию – зависит от твоей API-логики
            await dispatch(fetchUserProfile());
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
        }
    }
);

// --- 4. ПОЛУЧЕНИЕ ПРОФИЛЯ ---
export const fetchUserProfile = createAsyncThunk(
    'user/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.users.getUsers();
            // ВАЖНО: ничего не кладём в localStorage, только в Redux
            return response.data as DsUser;
        } catch (err: any) {
            return rejectWithValue('Не удалось загрузить профиль');
        }
    }
);

// --- 5. ОБНОВЛЕНИЕ ПРОФИЛЯ ---
export const updateUserProfile = createAsyncThunk(
    'user/updateProfile',
    async ({ id, data }: { id: number; data: HandlerUserCredentials }, { rejectWithValue }) => {
        try {
            await api.users.usersUpdate(id, data);
            return { id, ...data };
        } catch (err: any) {
            console.error('updateUserProfile error:', err?.response?.data ?? err);
            const msg = err?.response?.data?.description || 'Ошибка обновления';
            return rejectWithValue(msg);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // clearError: (state) => {
        //     state.error = null;
        // },
        resetRegisterSuccess: (state) => {
            state.registerSuccess = false;
        },
        resetAuth: (state) => {
            state.isAuthenticated = false;
            state.user = null;          // или {} — как у вас в initialState
            state.loading = false;
            state.error = null;         // если есть поле error
      // state.registerSuccess = false; // опционально, если хотите
    },
        
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
                // Пользовательский объект заполняется только через fetchUserProfile
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.token = null;
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
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                console.log('Fetched user profile:', action.payload);
                state.isAuthenticated = true; // профиль успешно подтянут – пользователь авторизован
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload as string;
            })

            // === UPDATE PROFILE ===
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                if (state.user) {
                    if (action.payload.login) {
                        state.user.login = action.payload.login;
                    }
                    if (action.payload.password) {
                        // обычно пароль в user не хранят, оставим без изменения
                    }
                }
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});
export const { resetRegisterSuccess, resetAuth } = userSlice.actions;
//export const { resetRegisterSuccess } = userSlice.actions;
export default userSlice.reducer;
