/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface DsUser {
  id?: number;
  is_moderator?: boolean;
  login?: string;
}

export interface HandlerCartIconResponse {
  draft_readIndxs_id?: number;
  texts_count?: number;
}

export interface HandlerErrorResponse {
  description?: string;
  status?: string;
}

export interface HandlerReadIndxsInfoResponse {
  id?: number;
  status?: string;
  texts?: HandlerTextDTO[];
  thematic?: any;
}

export interface HandlerReadIndxsListItem {
  created_at?: string;
  id?: number;
  status?: string;
  texts_count?: number;
  updated_at?: string;
}

export interface HandlerReadIndxsListResponse {
  items?: HandlerReadIndxsListItem[];
}

export interface HandlerReadIndxsModerateRequest {
  action?: string;
}

export interface HandlerReadIndxsModerateResponse {
  id?: number;
  status?: string;
}

export interface HandlerTextCreateRequest {
  description?: string;
  price?: number;
  title?: string;
}

export interface HandlerTextDTO {
  description?: string;
  id?: number;
  image_url?: string;
  price?: number;
  title?: string;
}

export type HandlerTextUpdateRequest = Record<string, any>;

export interface HandlerUserCredentials {
  /** required: true */
  login?: string;
  /** required: true */
  password?: string;
}

export interface HandlerMmBody {
  count_sentences?: number;
  count_syllables?: number;
  count_words?: number;
  /** required: true */
  read_indxs_id: number;
  /** required: true */
  text_id: number;
}

export interface HandlerMmBodyDelete {
  /** required: true */
  read_indxs_id: number;
  /** required: true */
  text_id: number;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Swagger Example API
 * @version 1.0
 * @license MIT
 * @termsOfService http://swagger.io/terms/
 * @externalDocs https://swagger.io/resources/open-api/
 * @contact API Support <support@swagger.io> (http://www.swagger.io/support)
 *
 * This is a sample server celler server.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * No description
     *
     * @tags auth
     * @name LoginCreate
     * @summary Логин
     * @request POST:/auth/login
     */
    loginCreate: (body: HandlerUserCredentials, params: RequestParams = {}) =>
      this.request<Record<string, boolean>, HandlerTextUpdateRequest>({
        path: `/auth/login`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name LogoutCreate
     * @summary Логаут
     * @request POST:/auth/logout
     * @secure
     */
    logoutCreate: (body: any, params: RequestParams = {}) =>
      this.request<Record<string, boolean>, any>({
        path: `/auth/logout`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  readindxs = {
    /**
     * No description
     *
     * @tags readindxs
     * @name ReadindxsList
     * @summary List read indices
     * @request GET:/readindxs
     * @secure
     */
    readindxsList: (
      query?: {
        /** status filter */
        status?: string;
        /** YYYY-MM-DD */
        date_from?: string;
        /** YYYY-MM-DD */
        date_to?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<HandlerReadIndxsListResponse, HandlerErrorResponse>({
        path: `/readindxs`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags readindxs
     * @name MyTextCartList
     * @summary Read indices cart icon info
     * @request GET:/readindxs/my-text-cart
     * @secure
     */
    myTextCartList: (params: RequestParams = {}) =>
      this.request<HandlerCartIconResponse, HandlerErrorResponse>({
        path: `/readindxs/my-text-cart`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags readindxs
     * @name ReadindxsDetail
     * @summary Get read index by id
     * @request GET:/readindxs/{id}
     * @secure
     */
    readindxsDetail: (id: number, params: RequestParams = {}) =>
      this.request<HandlerReadIndxsInfoResponse, HandlerErrorResponse>({
        path: `/readindxs/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags readindxs
     * @name ReadindxsDelete
     * @summary Soft delete read index
     * @request DELETE:/readindxs/{id}
     * @secure
     */
    readindxsDelete: (id: number, params: RequestParams = {}) =>
      this.request<string, HandlerErrorResponse>({
        path: `/readindxs/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags readindxs
     * @name ReadindxsPartialUpdate
     * @summary Update read index (partial)
     * @request PATCH:/readindxs/{id}
     * @secure
     */
    readindxsPartialUpdate: (
      id: number,
      body: HandlerTextUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<string, HandlerErrorResponse>({
        path: `/readindxs/${id}`,
        method: "PATCH",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags readindxs
     * @name FormCreate
     * @summary Build/form read index
     * @request POST:/readindxs/{id}/form
     * @secure
     */
    formCreate: (id: number, params: RequestParams = {}) =>
      this.request<string, HandlerErrorResponse>({
        path: `/readindxs/${id}/form`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags readindxs
     * @name ModerateCreate
     * @summary Moderate read index
     * @request POST:/readindxs/{id}/moderate
     * @secure
     */
    moderateCreate: (
      id: number,
      body: HandlerReadIndxsModerateRequest,
      params: RequestParams = {},
    ) =>
      this.request<HandlerReadIndxsModerateResponse, HandlerErrorResponse>({
        path: `/readindxs/${id}/moderate`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  readindxsTexts = {
    /**
     * No description
     *
     * @tags read-indxs
     * @name ReadindxsTextsDelete
     * @summary Remove text from read index
     * @request DELETE:/readindxs-texts
     * @secure
     */
    readindxsTextsDelete: (
      body: HandlerMmBodyDelete,
      params: RequestParams = {},
    ) =>
      this.request<string, HandlerErrorResponse>({
        path: `/readindxs-texts`,
        method: "DELETE",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Partial update of word/sentence/syllable counters for specific text in a read index
     *
     * @tags read-indxs
     * @name ReadindxsTextsPartialUpdate
     * @summary Update text metrics in read index
     * @request PATCH:/readindxs-texts
     * @secure
     */
    readindxsTextsPartialUpdate: (
      body: HandlerMmBody,
      params: RequestParams = {},
    ) =>
      this.request<string, HandlerErrorResponse>({
        path: `/readindxs-texts`,
        method: "PATCH",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  texts = {
    /**
     * No description
     *
     * @tags texts
     * @name TextsList
     * @summary List texts
     * @request GET:/texts
     */
    textsList: (
      query?: {
        /** title contains */
        title?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<HandlerTextDTO[], HandlerErrorResponse>({
        path: `/texts`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags texts
     * @name TextsCreate
     * @summary Create text
     * @request POST:/texts
     * @secure
     */
    textsCreate: (body: HandlerTextCreateRequest, params: RequestParams = {}) =>
      this.request<HandlerTextDTO, HandlerErrorResponse>({
        path: `/texts`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags texts
     * @name TextsDetail
     * @summary Get text by id
     * @request GET:/texts/{id}
     */
    textsDetail: (id: number, params: RequestParams = {}) =>
      this.request<HandlerTextDTO, HandlerErrorResponse>({
        path: `/texts/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags texts
     * @name TextsDelete
     * @summary Soft delete text
     * @request DELETE:/texts/{id}
     * @secure
     */
    textsDelete: (id: number, params: RequestParams = {}) =>
      this.request<string, HandlerErrorResponse>({
        path: `/texts/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags texts
     * @name TextsPartialUpdate
     * @summary Update text (partial)
     * @request PATCH:/texts/{id}
     * @secure
     */
    textsPartialUpdate: (
      id: number,
      body: HandlerTextUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<string, HandlerErrorResponse>({
        path: `/texts/${id}`,
        method: "PATCH",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags texts
     * @name AddToDraftCreate
     * @summary Добавить текст в черновик индексов пользователя
     * @request POST:/texts/{id}/add-to-draft
     * @secure
     */
    addToDraftCreate: (id: number, params: RequestParams = {}) =>
      this.request<void, HandlerTextUpdateRequest>({
        path: `/texts/${id}/add-to-draft`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags texts
     * @name ImageCreate
     * @summary Upload text image
     * @request POST:/texts/{id}/image
     * @secure
     */
    imageCreate: (id: number, file: number[], params: RequestParams = {}) =>
      this.request<Record<string, string>, HandlerErrorResponse>({
        path: `/texts/${id}/image`,
        method: "POST",
        body: file,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags users
     * @name GetUsers
     * @summary Текущий пользователь
     * @request GET:/users/me
     * @secure
     */
    getUsers: (params: RequestParams = {}) =>
      this.request<DsUser, HandlerTextUpdateRequest>({
        path: `/users/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name PatchUsers
     * @summary Обновить свои данные
     * @request PATCH:/users/me
     * @secure
     */
    patchUsers: (body: HandlerUserCredentials, params: RequestParams = {}) =>
      this.request<DsUser, HandlerTextUpdateRequest>({
        path: `/users/me`,
        method: "PATCH",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name RegisterCreate
     * @summary Регистрация пользователя
     * @request POST:/users/register
     */
    registerCreate: (
      body: HandlerUserCredentials,
      params: RequestParams = {},
    ) =>
      this.request<DsUser, HandlerTextUpdateRequest>({
        path: `/users/register`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
