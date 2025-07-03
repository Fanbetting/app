"use server";

import endpoints from "@/data/endpoints.json";
import "server-only";

interface AddHoldingParams {
  network: keyof typeof endpoints;
  address: string;
  legacy: boolean;
  regular: boolean;
}

export async function addHolding({}: AddHoldingParams) {}

interface UpdateHoldingParams {
  network: keyof typeof endpoints;
  address: string;
  legacy: boolean;
  regular: boolean;
}

export async function updateHolding({}: UpdateHoldingParams) {}
