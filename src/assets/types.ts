import type { Request } from "express";

export type RequestWithParams<T> = Request<T>
export type RequestWithBody<T> = Request<{}, T>
export type RequestWithQueryParams<T> = Request<{}, {}, {}, T>
export type RequestWithParamsAndBody<P, B> = Request<P, B>

export type GetEntityByIdParam = {
    id: string
}

export type ResponseError = { error: string }
