// src/store/slices/textsSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { logoutUser } from './userSlice';

// важно: здесь импортируем типы из сгенерированного Api.ts
import type {
  HandlerTextDTO,
  HandlerTextCreateRequest,
  HandlerTextUpdateRequest,
} from '../../api/Api';


import { api } from '../../api'; 

// --------- STATE ---------

interface TextState {
  list: HandlerTextDTO[];           // список текстов
  currentText: HandlerTextDTO | null; // один выбранный текст
  loading: boolean;
  error: string | null;
  operationSuccess: boolean;        // флаг "успешно выполнено" для create/update/delete
}

const initialState: TextState = {
  list: [],
  currentText: null,
  loading: false,
  error: null,
  operationSuccess: false,
};

// --------- THUNKS ПОД /texts ---------

/**
 * 1. Список текстов: GET /texts?title=...
 */
export const fetchTextsList = createAsyncThunk(
  'texts/fetchList',
  async (filters: { title?: string } | undefined, { rejectWithValue }) => {
    try {
      const query: { title?: string } = {};
      if (filters?.title) {
        query.title = filters.title;
      }

      const response = await api.texts.textsList(query);
      // по Swagger: textsList → HandlerTextDTO[]
      console.log('Fetched texts list:', response.data);
      return response.data ?? [];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.description || 'Ошибка загрузки списка текстов',
      );
    }
  },
);

/**
 * 2. Один текст по id: GET /texts/{id}
 */
export const fetchTextById = createAsyncThunk(
  'texts/fetchById',
  async (id: number | string, { rejectWithValue }) => {
    try {
      const response = await api.texts.textsDetail(Number(id));
      return response.data;
    } catch (err: any) {
      return rejectWithValue('Текст не найден');
    }
  },
);

/**
 * 3. Создать текст: POST /texts
 */
export const createText = createAsyncThunk(
  'texts/create',
  async (payload: HandlerTextCreateRequest, { rejectWithValue }) => {
    try {
      const response = await api.texts.textsCreate(payload);
      return response.data; // HandlerTextDTO
    } catch (err: any) {
      return rejectWithValue('Ошибка создания текста');
    }
  },
);

/**
 * 4. Обновить текст (частично): PATCH /texts/{id}
 */
export const updateText = createAsyncThunk(
  'texts/update',
  async (
    { id, data }: { id: number; data: HandlerTextUpdateRequest },
    { rejectWithValue },
  ) => {
    try {
      await api.texts.textsPartialUpdate(id, data);
      // вернём то, что отправили + id, чтобы обновить стейт локально
      return { id, data };
    } catch (err: any) {
      return rejectWithValue('Ошибка обновления текста');
    }
  },
);

/**
 * 5. Удалить текст: DELETE /texts/{id}
 */
export const deleteText = createAsyncThunk(
  'texts/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.texts.textsDelete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue('Ошибка удаления текста');
    }
  },
);

/**
 * 6. Добавить текст в черновик индексов пользователя:
 *    POST /texts/{id}/add-to-draft
 */
export const addTextToDraft = createAsyncThunk(
  'texts/addToDraft',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.texts.addToDraftCreate(id);
      return id;
    } catch (err: any) {
      return rejectWithValue('Не удалось добавить текст в черновик');
    }
  },
);

// --------- SLICE ---------

const textsSlice = createSlice({
  name: 'texts',
  initialState,
  reducers: {
    resetOperationSuccess: (state) => {
      state.operationSuccess = false;
    },
    clearCurrentText: (state) => {
      state.currentText = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // ----- LIST -----
      .addCase(fetchTextsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTextsList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTextsList.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Ошибка загрузки списка';
      })

      // ----- DETAIL -----
      .addCase(fetchTextById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentText = null;
      })
      .addCase(fetchTextById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentText = action.payload;
      })
      .addCase(fetchTextById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Ошибка загрузки текста';
      })

      // ----- CREATE -----
      .addCase(createText.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operationSuccess = false;
      })
      .addCase(createText.fulfilled, (state, action) => {
        state.loading = false;
        state.operationSuccess = true;
        state.list.push(action.payload);
      })
      .addCase(createText.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Ошибка создания текста';
      })

      // ----- UPDATE -----
      .addCase(updateText.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operationSuccess = false;
      })
      .addCase(updateText.fulfilled, (state, action) => {
        state.loading = false;
        state.operationSuccess = true;
        const { id, data } = action.payload;

        // обновляем в списке
        const idx = state.list.findIndex((t) => t.id === id);
        if (idx !== -1) {
          state.list[idx] = { ...state.list[idx], ...data };
        }

        // и текущий текст, если он открыт
        if (state.currentText && state.currentText.id === id) {
          state.currentText = { ...state.currentText, ...data };
        }
      })
      .addCase(updateText.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Ошибка обновления текста';
      })

      // ----- DELETE -----
      .addCase(deleteText.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operationSuccess = false;
      })
      .addCase(deleteText.fulfilled, (state, action) => {
        state.loading = false;
        state.operationSuccess = true;
        const id = action.payload;
        state.list = state.list.filter((t) => t.id !== id);
        if (state.currentText && state.currentText.id === id) {
          state.currentText = null;
        }
      })
      .addCase(deleteText.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Ошибка удаления текста';
      })

      // ----- ADD TO DRAFT -----
      .addCase(addTextToDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operationSuccess = false;
      })
      .addCase(addTextToDraft.fulfilled, (state) => {
        state.loading = false;
        state.operationSuccess = true;
      })
      .addCase(addTextToDraft.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          'Ошибка добавления текста в черновик';
      })

      // ----- LOGOUT -----
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const {
  resetOperationSuccess,
  clearCurrentText,
} = textsSlice.actions;

export default textsSlice.reducer;
