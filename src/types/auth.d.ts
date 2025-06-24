import { Request } from "express";
import { ArticlesBodyRequest } from "./category";


// export interface AuthRequest<
//     Body = any, 
//     Params = any, 
//     Query = any, 
//     ExtraFields = {}> extends Request<Params, any, Body, Query> {
//     admin?: {
//         adminId: string;
//     };
//     category_id?: string;
// } & ExtraFields;

export type AuthRequest<
  Body = any,
  Params = any,
  Query = any,
  ExtraFields = {}
> = Request<Params, any, Body, Query> & {
  admin?: {
    adminId: string;
  };
} & ExtraFields;

