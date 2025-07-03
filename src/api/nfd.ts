"use server";

import endpoints from "@/data/endpoints.json";

import { apiRequest } from ".";

interface NFD {
  appID: number;
  asaID: number;
  state: "owned" | unknown;
  expired: boolean;
  timeExpires: Date;
  nfdAccount: string;
  name: string;
  owner: string;
  metaTags: string[];
  category: "common" | unknown;
  saleType: "buyItNow" | unknown;
  depositAccount: string;
  properties: {
    internal: {
      segmentLocked: string;
      vaultOptInLocked: string;
      ver: string;
    };
    userDefined: {
      avatar: string;
    };
  };
}

interface GetNfdParams {
  address: string;
  network: keyof typeof endpoints;
}

interface GetNfdResponse {
  total: number;
  nfd: NFD[];
}

export const getNfds = (params: GetNfdParams) => {
  return apiRequest<GetNfdParams, GetNfdResponse>({
    url: `${endpoints[params.network].nfdomain}?owner=${params.address}`,
    method: "GET",
    params,
  });
};
