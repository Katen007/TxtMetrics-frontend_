import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api";
import type {
  DsReadIndxsInfoDTO,
  DsReadIndxsToText,
  HandlerMmBody,
  HandlerMmBodyDelete,
} from "../../api/Api";

interface ReadIndxsListItem {
  id: number;
  status?: string;
  date_create?: string;
  date_form?: string;
  date_end?: string;
  commenst?: string;
  contacts?: string;
  creator?: string;
  moderator?: string;
  calculations?: number[]; // server returns calculations array in example
  texts_count?: number; // fallback if server provides it
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

export const fetchReadIndxsList = createAsyncThunk<
  ReadIndxsListItem[],
  { status?: string; date_from?: string; date_to?: string } | undefined,
  { rejectValue: string }
>("readIndxs/fetchList", async (filters, { rejectWithValue }) => {
  try {
    const res = await api.readindxs.readindxsList(filters ?? {});
    // Res.data can be array or object with items
    const data = res.data as any;
    let items: ReadIndxsListItem[] = [];
    if (Array.isArray(data)) {
      items = data;
    } else if (data && Array.isArray(data.items)) {
      items = data.items;
    } else {
      // If server returns something else, try to map
      items = data ? [data] : [];
    }
    return items;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data || "Ошибка загрузки списка заявок");
  }
});

export const fetchReadIndxsById = createAsyncThunk<
  DsReadIndxsInfoDTO,
  number,
  { rejectValue: string }
>("readIndxs/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await api.readindxs.readindxsDetail(id);
    return res.data as DsReadIndxsInfoDTO;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data || "Ошибка получения заявки");
  }
});

export const updateReadIndxs = createAsyncThunk<
  { id: number; data: Partial<Pick<DsReadIndxsInfoDTO, "comments" | "contacts">> },
  { id: number; data: { comments?: string; contacts?: string } },
  { rejectValue: string }
>("readIndxs/update", async (payload, { rejectWithValue }) => {
  try {
    // PUT /readindxs/{id} returns 204
    await api.readindxs.readindxsUpdate(payload.id, payload.data as any);
    return { id: payload.id, data: payload.data };
  } catch (err: any) {
    return rejectWithValue(err?.response?.data || "Ошибка обновления заявки");
  }
});

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
      ...(body.count_sentences !== undefined ? { count_sentences: body.count_sentences } : {}),
      ...(body.count_syllables !== undefined ? { count_syllables: body.count_syllables } : {}),
    };
    await api.readindxsTexts.readindxsTextsUpdate(payload);
    return payload;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data || "Ошибка обновления метрик");
  }
});

export const removeTextFromReadIndxs = createAsyncThunk<
  number,
  HandlerMmBodyDelete,
  { rejectValue: string }
>("readIndxs/removeText", async (payload, { rejectWithValue }) => {
  try {
    await api.readindxsTexts.readindxsTextsDelete(payload);
    return payload.text_id;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data || "Ошибка удаления текста");
  }
});

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

      if (typeof serverData === "string") {
        return rejectWithValue(serverData);
      }

      return rejectWithValue("Ошибка формирования заявки");
    }
  }
);


export const deleteReadIndxs = createAsyncThunk<number, number, { rejectValue: string }>(
  "readIndxs/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.readindxs.readindxsDelete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || "Ошибка удаления заявки");
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
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch list
      .addCase(fetchReadIndxsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReadIndxsList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchReadIndxsList.rejected, (state, action) => {
        state.loading = false;
        state.list = []
        state.error = action.payload ?? "Ошибка";
      })
      // fetch by id
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
      // update read index
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
      // update metrics
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
            count_words: payload.count_words !== undefined ? payload.count_words : t.count_words,
            count_sentences:
              payload.count_sentences !== undefined ? payload.count_sentences : t.count_sentences,
            count_syllables:
              payload.count_syllables !== undefined ? payload.count_syllables : t.count_syllables,
          } as DsReadIndxsToText;
        });
      })
      .addCase(updateTextMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Ошибка";
      })
      // remove text
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
      // form read index
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

      // delete
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
      });
  },
});

export const { resetOperationSuccess, clearCurrent } = readIndxsSlice.actions;
export default readIndxsSlice.reducer;