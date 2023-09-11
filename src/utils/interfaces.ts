import { Request } from "express";
export interface SuccessData {
  message: string;
  [key: string]: any; // This allows for additional properties like {token}
}

export interface TokenPayload {
  user: {
    id: string;
  };
}

export interface CustomRequest extends Request {
  user?: TokenPayload["user"];
}

export interface ITransferFunds {
  amount: number;
  toWalletId: string;
  fromWalletId: string;
}
