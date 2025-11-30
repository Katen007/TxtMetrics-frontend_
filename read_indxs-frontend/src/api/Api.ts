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

export interface DsReadIndxsInfoDTO {
  comments?: string;
  contacts?: string;
  creator?: string;
  date_create?: string;
  date_end?: string;
  date_form?: string;
  id?: number;
  moderator?: string;
  status?: string;
  texts?: DsReadIndxsToText[];
}

export interface DsReadIndxsToText {
  calculation?: number;
  count_sentences?: number;
  count_syllables?: number;
  count_words?: number;
  data?: DsText;
}

export interface DsText {
  id?: number;
  image_url?: string;
  title?: string;
}

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

export interface HandlerReadIndxsModerateRequest {
  action?: string;
}

export interface HandlerReadIndxsModerateResponse {
  id?: number;
  status?: string;
}

export interface HandlerResponseModelsAuthoResp {
  data?: ModelsAuthoResp;
  ok?: boolean;
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
  password?: string;
  login?: string;
  /** required: true */
  
}

export interface HandlerMmBody {
  count_sentences?: number;
  count_syllables?: number;
  count_words?: number;
  /** required: true */
  read_indxs_id?: number;
  /** required: true */
  text_id?: number;
}

export interface HandlerMmBodyDelete {
  /** required: true */
  read_indxs_id: number;
  /** required: true */
  text_id: number;
}

export interface ModelsAuthoResp {
  AccessToken?: string;
  expiresIn?: string;
  tokenType?: string;
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
     * @response `200` `HandlerResponseModelsAuthoResp` OK
     * @response `400` `HandlerTextUpdateRequest` Bad Request
     * @response `401` `HandlerTextUpdateRequest` Unauthorized
     */
    loginCreate: (body: HandlerUserCredentials, params: RequestParams = {}) =>
      this.request<HandlerResponseModelsAuthoResp, HandlerTextUpdateRequest>({
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
     * @response `200` `Record<string,boolean>` ok=true
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
     * @response `200` `list` OK
     * @response `500` `HandlerErrorResponse` Internal Server Error
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
      this.request<list, HandlerErrorResponse>({
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
     * @response `200` `HandlerCartIconResponse` OK
     * @response `400` `HandlerErrorResponse` Bad Request
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
     * @response `200` `DsReadIndxsInfoDTO` OK
     * @response `404` `HandlerErrorResponse` Not Found
     */
    readindxsDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsReadIndxsInfoDTO, HandlerErrorResponse>({
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
     * @name ReadindxsUpdate
     * @summary Update read index (partial)
     * @request PUT:/readindxs/{id}
     * @secure
     * @response `204` `string` No Content
     * @response `400` `HandlerErrorResponse` Bad Request
     * @response `500` `HandlerErrorResponse` Internal Server Error
     */
    readindxsUpdate: (
      id: number,
      body: HandlerTextUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<string, HandlerErrorResponse>({
        path: `/readindxs/${id}`,
        method: "PUT",
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
     * @name ReadindxsDelete
     * @summary Soft delete read index
     * @request DELETE:/readindxs/{id}
     * @secure
     * @response `204` `string` No Content
     * @response `500` `HandlerErrorResponse` Internal Server Error
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
     * @name FormUpdate
     * @summary Build/form read index
     * @request PUT:/readindxs/{id}/form
     * @secure
     * @response `204` `string` No Content
     * @response `400` `HandlerErrorResponse` Bad Request
     */
    formUpdate: (id: number, params: RequestParams = {}) =>
      this.request<string, HandlerErrorResponse>({
        path: `/readindxs/${id}/form`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags readindxs
     * @name ModerateUpdate
     * @summary Moderate read index
     * @request PUT:/readindxs/{id}/moderate
     * @secure
     * @response `200` `HandlerReadIndxsModerateResponse` OK
     * @response `400` `HandlerErrorResponse` Bad Request
     */
    moderateUpdate: (
      id: number,
      body: HandlerReadIndxsModerateRequest,
      params: RequestParams = {},
    ) =>
      this.request<HandlerReadIndxsModerateResponse, HandlerErrorResponse>({
        path: `/readindxs/${id}/moderate`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  readindxsTexts = {
    /**
     * @description Partial update of word/sentence/syllable counters for specific text in a read index
     *
     * @tags read-indxs
     * @name ReadindxsTextsUpdate
     * @summary Update text metrics in read index
     * @request PUT:/readindxs-texts
     * @secure
     * @response `204` `string` No Content
     * @response `400` `HandlerErrorResponse` Bad Request
     * @response `500` `HandlerErrorResponse` Internal Server Error
     */
    readindxsTextsUpdate: (body: HandlerMmBody, params: RequestParams = {}) =>
      this.request<string, HandlerErrorResponse>({
        path: `/readindxs-texts`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags read-indxs
     * @name ReadindxsTextsDelete
     * @summary Remove text from read index
     * @request DELETE:/readindxs-texts
     * @secure
     * @response `204` `string` No Content
     * @response `400` `HandlerErrorResponse` Bad Request
     * @response `500` `HandlerErrorResponse` Internal Server Error
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
  };
  texts = {
    /**
     * No description
     *
     * @tags texts
     * @name TextsList
     * @summary List texts
     * @request GET:/texts
     * @response `200` `(HandlerTextDTO)[]` OK
     * @response `500` `HandlerErrorResponse` Internal Server Error
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
     * @response `201` `HandlerTextDTO` Created
     * @response `400` `HandlerErrorResponse` Bad Request
     * @response `500` `HandlerErrorResponse` Internal Server Error
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
     * @response `200` `HandlerTextDTO` OK
     * @response `404` `HandlerErrorResponse` Not Found
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
     * @response `204` `string` No Content
     * @response `400` `HandlerErrorResponse` Bad Request
     * @response `500` `HandlerErrorResponse` Internal Server Error
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
     * @response `204` `string` No Content
     * @response `400` `HandlerErrorResponse` Bad Request
     * @response `500` `HandlerErrorResponse` Internal Server Error
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
     * @response `204` `void` No Content
     * @response `400` `HandlerTextUpdateRequest` Bad Request
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
     * @response `201` `Record<string,string>` image_key
     * @response `400` `HandlerErrorResponse` Bad Request
     * @response `500` `HandlerErrorResponse` Internal Server Error
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
     * @response `200` `DsUser` OK
     * @response `401` `HandlerTextUpdateRequest` Unauthorized
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
     * @name UsersUpdate
     * @summary Обновить свои данные
     * @request PUT:/users/me
     * @secure
     * @response `200` `DsUser` OK
     * @response `400` `HandlerTextUpdateRequest` Bad Request
     * @response `401` `HandlerTextUpdateRequest` Unauthorized
     * @response `500` `HandlerTextUpdateRequest` Internal Server Error
     */
    usersUpdate: (id: number, updateData: HandlerUserCredentials, params: RequestParams = {}) =>
      this.request<DsUser, HandlerTextUpdateRequest>({
        path: `/users/me`,
        method: "PUT",
        body: updateData,
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
     * @response `201` `DsUser` Created
     * @response `400` `HandlerTextUpdateRequest` Bad Request
     * @response `409` `HandlerTextUpdateRequest` login already taken
     * @response `500` `HandlerTextUpdateRequest` Internal Server Error
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
