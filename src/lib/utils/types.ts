export type GameStatus = "Open" | "Submission" | "Payout" | "Inactive";
export type Asset = "ALGO" | "FBET" | "USDC" | "IPT";
export type Ticket = [
  number | bigint,
  number | bigint,
  number | bigint,
  number | bigint,
  number | bigint,
];

export type Holder = {
  legacy: boolean;
  regular: boolean;
};
