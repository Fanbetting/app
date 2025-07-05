"use server";

import { ensureError } from "@/lib/utils/convert";
import "server-only";

interface RequestConfig<T> {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  params?: T;
  headers?: never;
}

export async function apiRequest<D = unknown, R = unknown, E = Error>({
  url,
  method,
  params,
}: RequestConfig<D>) {
  const body = JSON.stringify(params);
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "*",
  };

  const init: RequestInit = {
    method,
    headers,
    body: method === "GET" ? undefined : body,
  };

  const response = await fetch(`${url}`, init);

  if (!response.ok) {
    return ensureError(response.statusText || "Unknown error") as E;
  }

  const data = (await response.json()) as R;
  return data;
}
