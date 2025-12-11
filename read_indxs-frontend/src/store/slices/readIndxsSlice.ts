import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api";
import type {
  DsReadIndxsInfoDTO,
  DsReadIndxsToText,
  HandlerMmBody,
  HandlerMmBodyDelete,
  HandlerReadIndxsModerateResponse,
} from "../../api/Api";
import { logoutUser } from "./userSlice";

interface ReadIndxsListItem {
  id: number;
  status?: string;
  date_create?: string;
  date_form?: string;
  date_end?: string;
  commenst?: string;
  contacts?: string;

  // В разных реализациях это может быть строка/ID.
  // Оставляем как есть, а на фронте аккуратно приводим к number.
  creator?: any;
  creator_login?: any;
  creator_id?: any;

  moderator?: string;

  // Для варианта с м-м: массив результатов по текстам
  calculations?: Array<number | null>;
  texts_count?: number;
}

interface ReadIndxsState {
  list: ReadIndxsListItem[];
  current: DsReadIndxsInfoDTO | null;
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

// ----------- LIST -----------
export const fetchReadIndxsList = createAsyncThunk<
  ReadIndxsListItem[],
  { status?: string; date_from?: string; date_to?: string } | undefined,
  { rejectValue: string }
>("readIndxs/fetchList", async (filters, { rejectWithValue }) => {
  try {
    const res = await api.readindxs.readindxsList(filters ?? {});
    const data = res.data as any;

    let items: ReadIndxsListItem[] = [];
    console.log('Fetched readIndxs list data:', data);
    if (Array.isArray(data)) items = data;
    else if (data && Array.isArray(data.items)) items = data.items;
    else items = data ? [data] : [];

    return items;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.description ||
        err?.response?.data ||
        "Ошибка загрузки списка заявок"
    );
  }
});

// ----------- DETAIL -----------
export const fetchReadIndxsById = createAsyncThunk<
  DsReadIndxsInfoDTO,
  number,
  { rejectValue: string }
>("readIndxs/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await api.readindxs.readindxsDetail(id);
    return res.data as DsReadIndxsInfoDTO;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.description ||
        err?.response?.data ||
        "Ошибка получения заявки"
    );
  }
});

// ----------- UPDATE ORDER FIELDS -----------
export const updateReadIndxs = createAsyncThunk<
  { id: number; data: Partial<Pick<DsReadIndxsInfoDTO, "comments" | "contacts">> },
  { id: number; data: { comments?: string; contacts?: string } },
  { rejectValue: string }
>("readIndxs/update", async (payload, { rejectWithValue }) => {
  try {
    await api.readindxs.readindxsUpdate(payload.id, payload.data as any);
    return { id: payload.id, data: payload.data };
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.description ||
        err?.response?.data ||
        "Ошибка обновления заявки"
    );
  }
});

// ----------- UPDATE MM METRICS -----------
export const updateTextMetrics = createAsyncThunk<
  HandlerMmBody,
  HandlerMmBody,
  { rejectValue: string }
>("readIndxs/updateTextMetrics", async (body, { rejectWithValue }) => {
  try {
    const payload: HandlerMmBody = {
      read_indxs_id: body.read_indxs_id,
      text_id: body.text_id,
      ...(body.count_words !== undefined ? { count_words: body.count_words } : {}),
      ...(body.count_sentences !== undefined
        ? { count_sentences: body.count_sentences }
        : {}),
      ...(body.count_syllables !== undefined
        ? { count_syllables: body.count_syllables }
        : {}),
    };

    await api.readindxsTexts.readindxsTextsUpdate(payload);
    return payload;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.description ||
        err?.response?.data ||
        "Ошибка обновления метрик"
    );
  }
});

// ----------- REMOVE TEXT FROM ORDER -----------
export const removeTextFromReadIndxs = createAsyncThunk<
  number,
  HandlerMmBodyDelete,
  { rejectValue: string }
>("readIndxs/removeText", async (payload, { rejectWithValue }) => {
  try {
    await api.readindxsTexts.readindxsTextsDelete(payload);
    return payload.text_id;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.description ||
        err?.response?.data ||
        "Ошибка удаления текста"
    );
  }
});

// ----------- FORM ORDER -----------
export const formReadIndxs = createAsyncThunk<number, number, { rejectValue: string }>(
  "readIndxs/form",
  async (id, { rejectWithValue }) => {
    try {
      await api.readindxs.formUpdate(id);
      return id;
    } catch (err: any) {
      const serverData = err?.response?.data;

      if (serverData && typeof serverData === "object" && "description" in serverData) {
        return rejectWithValue(
          (serverData as { description?: string }).description ||
            "Ошибка формирования заявки"
        );
      }
      if (typeof serverData === "string") return rejectWithValue(serverData);

      return rejectWithValue("Ошибка формирования заявки");
    }
  }
);

// ----------- DELETE ORDER -----------
export const deleteReadIndxs = createAsyncThunk<number, number, { rejectValue: string }>(
  "readIndxs/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.readindxs.readindxsDelete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.description ||
          err?.response?.data ||
          "Ошибка удаления заявки"
      );
    }
  }
);

// ----------- MODERATOR ACTION (ACCEPT/REJECT) -----------
export const moderateReadIndxs = createAsyncThunk<
  { id: number; status?: string; action: "complete" | "reject" },
  { id: number; action: "complete" | "reject" },
  { rejectValue: string }
>("readIndxs/moderate", async ({ id, action }, { rejectWithValue }) => {
  try {
    const res = await api.readindxs.moderateUpdate(id, { action });
    const data = res.data as HandlerReadIndxsModerateResponse | undefined;
    return { id, status: data?.status, action };
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.description ||
        err?.response?.data ||
        "Не удалось обновить статус заявки"
    );
  }
});

const readIndxsSlice = createSlice({
  name: "readIndxs",
  initialState,
  reducers: {
    resetOperationSuccess: (state) => {
      state.operationSuccess = false;
    },
    clearCurrent: (state) => {
      state.current = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- LIST (short polling friendly) ---
      .addCase(fetchReadIndxsList.pending, (state) => {
        state.error = null;
        if (state.list.length === 0) {
          state.loading = true;
        }
      })
      .addCase(fetchReadIndxsList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchReadIndxsList.rejected, (state, action) => {
        state.loading = false;
        state.list = [];
        state.error = action.payload ?? "Ошибка";
      })

      // --- DETAIL ---
      .addCase(fetchReadIndxsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReadIndxsById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchReadIndxsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Ошибка";
      })

      // --- UPDATE ORDER FIELDS ---
      .addCase(updateReadIndxs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReadIndxs.fulfilled, (state, action) => {
        state.loading = false;
        if (state.current && action.payload?.data) {
          state.current = { ...state.current, ...action.payload.data };
        }
      })
      .addCase(updateReadIndxs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Ошибка";
      })

      // --- UPDATE MM ---
      .addCase(updateTextMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTextMetrics.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;

        if (!state.current?.texts) return;

        state.current.texts = (state.current.texts as DsReadIndxsToText[]).map((t) => {
          if (t.data?.id !== payload.text_id) return t;
          return {
            ...t,
            count_words:
              payload.count_words !== undefined ? payload.count_words : t.count_words,
            count_sentences:
              payload.count_sentences !== undefined
                ? payload.count_sentences
                : t.count_sentences,
            count_syllables:
              payload.count_syllables !== undefined
                ? payload.count_syllables
                : t.count_syllables,
          } as DsReadIndxsToText;
        });
      })
      .addCase(updateTextMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Ошибка";
      })

      // --- REMOVE TEXT ---
      .addCase(removeTextFromReadIndxs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTextFromReadIndxs.fulfilled, (state, action) => {
        state.loading = false;
        const removedId = action.payload;

        if (!state.current?.texts) return;

        state.current.texts = (state.current.texts as DsReadIndxsToText[]).filter(
          (t) => t.data?.id !== removedId
        );
      })
      .addCase(removeTextFromReadIndxs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Ошибка";
      })

      // --- FORM ---
      .addCase(formReadIndxs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(formReadIndxs.fulfilled, (state) => {
        state.loading = false;
        state.operationSuccess = true;
      })
      .addCase(formReadIndxs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Ошибка";
      })

      // --- DELETE ---
      .addCase(deleteReadIndxs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReadIndxs.fulfilled, (state) => {
        state.loading = false;
        state.operationSuccess = true;
        state.current = null;
      })
      .addCase(deleteReadIndxs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Ошибка";
      })

      // --- MODERATE ---
      .addCase(moderateReadIndxs.pending, (state) => {
        state.error = null;
      })
      .addCase(moderateReadIndxs.fulfilled, (state, action) => {
        state.operationSuccess = true;

        const fallbackStatus =
          action.payload.action === "complete" ? "COMPLETED" : "REJECTED";
        const newStatus = action.payload.status || fallbackStatus;

        // обновляем list
        const idx = state.list.findIndex((o) => o.id === action.payload.id);
        if (idx >= 0) {
          state.list[idx] = { ...state.list[idx], status: newStatus };
        }

        // обновляем current
        if (state.current?.id === action.payload.id) {
          state.current = { ...state.current, status: newStatus } as DsReadIndxsInfoDTO;
        }
      })
      .addCase(moderateReadIndxs.rejected, (state, action) => {
        state.error = action.payload ?? "Ошибка";
      })

      // --- LOGOUT RESET ---
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const { resetOperationSuccess, clearCurrent } = readIndxsSlice.actions;
export default readIndxsSlice.reducer;
