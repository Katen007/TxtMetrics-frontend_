import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api";
import { logoutUser } from "./userSlice";
import type {
    HandlerReadIndxsListItem,
    HandlerReadIndxsListResponse,
    HandlerReadIndxsInfoResponse,
    HandlerMmBody,
    HandlerMmBodyDelete,
} from "../../api/Api";

interface ReadIndxsState {
    list: HandlerReadIndxsListItem[];
    current: HandlerReadIndxsInfoResponse | null;
    loading: boolean;
    error: string | null;
    operationSuccess: boolean;
}

const initialState: ReadIndxsState = {
    list: [],
    current: null,
    loading: false,
    error: null,
    operationSuccess: false,
};

/* -------------------------------------------
   1. LIST: GET /readindxs
-------------------------------------------- */
export const fetchReadIndxsList = createAsyncThunk(
    "readIndxs/fetchList",
    async (
        filters: { status?: string; date_from?: string; date_to?: string },
        { rejectWithValue }
    ) => {
        try {
            const query: any = {};
            if (filters.status && filters.status !== "all")
                query.status = filters.status;
            if (filters.date_from) query.date_from = filters.date_from;
            if (filters.date_to) query.date_to = filters.date_to;

            const response = await api.readindxs.readindxsList(query);
            return response.data.items || [];
        } catch (err: any) {
            return rejectWithValue("Ошибка загрузки списка заявок");
        }
    }
);

/* -------------------------------------------
   2. DETAILS: GET /readindxs/{id}
-------------------------------------------- */
export const fetchReadIndxsById = createAsyncThunk(
    "readIndxs/fetchById",
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await api.readindxs.readindxsDetail(id);
            return response.data;
        } catch (err) {
            return rejectWithValue("Заявка не найдена");
        }
    }
);

/* -------------------------------------------
   3. UPDATE (PATCH): /readindxs/{id}
-------------------------------------------- */
export const updateReadIndxs = createAsyncThunk(
    "readIndxs/update",
    async (
        { id, data }: { id: number; data: Record<string, any> },
        { rejectWithValue }
    ) => {
        try {
            await api.readindxs.readindxsPartialUpdate(id, data);
            return { id, data };
        } catch (err) {
            return rejectWithValue("Ошибка обновления");
        }
    }
);

/* -------------------------------------------
   4. REMOVE TEXT FROM ORDER (DELETE):
   DELETE /readindxs-texts
-------------------------------------------- */
export const removeTextFromReadIndxs = createAsyncThunk(
    "readIndxs/removeText",
    async (
        payload: HandlerMmBodyDelete,
        { rejectWithValue }
    ) => {
        try {
            await api.readindxsTexts.readindxsTextsDelete(payload);
            return payload.text_id;
        } catch (err) {
            return rejectWithValue("Ошибка удаления текста");
        }
    }
);

/* -------------------------------------------
   5. UPDATE TEXT METRICS PATCH /readindxs-texts
-------------------------------------------- */
export const updateTextMetrics = createAsyncThunk(
    "readIndxs/updateTextMetrics",
    async (body: HandlerMmBody, { rejectWithValue }) => {
        try {
            await api.readindxsTexts.readindxsTextsPartialUpdate(body);
            return body;
        } catch (err) {
            return rejectWithValue("Ошибка обновления текста");
        }
    }
);

/* -------------------------------------------
   6. FORM ORDER POST /readindxs/{id}/form
-------------------------------------------- */
export const formReadIndxs = createAsyncThunk(
    "readIndxs/form",
    async (id: number, { rejectWithValue }) => {
        try {
            await api.readindxs.formCreate(id);
            return id;
        } catch {
            return rejectWithValue("Ошибка формирования");
        }
    }
);

/* -------------------------------------------
   7. DELETE ORDER: DELETE /readindxs/{id}
-------------------------------------------- */
export const deleteReadIndxs = createAsyncThunk(
    "readIndxs/delete",
    async (id: number, { rejectWithValue }) => {
        try {
            await api.readindxs.readindxsDelete(id);
            return id;
        } catch {
            return rejectWithValue("Ошибка удаления заявки");
        }
    }
);

const readIndxsSlice = createSlice({
    name: "readIndxs",
    initialState,
    reducers: {
        resetOperationSuccess: (state) => {
            state.operationSuccess = false;
        },
        clearCurrent: (state) => {
            state.current = null;
        },
    },
    extraReducers: (builder) => {
        builder
            /* LIST */
            .addCase(fetchReadIndxsList.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchReadIndxsList.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })

            /* DETAILS */
            .addCase(fetchReadIndxsById.pending, (state) => {
                state.loading = true;
                state.current = null;
            })
            .addCase(fetchReadIndxsById.fulfilled, (state, action) => {
                state.loading = false;
                state.current = action.payload;
            })

            /* UPDATE */
            .addCase(updateReadIndxs.fulfilled, (state, action) => {
                if (state.current) {
                    state.current = {
                        ...state.current,
                        ...action.payload.data,
                    };
                }
            })

            /* REMOVE TEXT */
            .addCase(removeTextFromReadIndxs.fulfilled, (state, action) => {
                if (state.current?.texts) {
                    state.current.texts = state.current.texts.filter(
                        (t) => t.id !== action.payload
                    );
                }
            })

            /* DELETE ORDER */
            .addCase(deleteReadIndxs.fulfilled, (state) => {
                state.operationSuccess = true;
            })

            /* FORM */
            .addCase(formReadIndxs.fulfilled, (state) => {
                state.operationSuccess = true;
            })

            /* LOGOUT */
            .addCase(logoutUser.fulfilled, () => initialState);
    },
});

export const { resetOperationSuccess, clearCurrent } = readIndxsSlice.actions;
export default readIndxsSlice.reducer;
