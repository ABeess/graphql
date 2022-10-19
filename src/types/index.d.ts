import { Request, Response } from 'express';
import { Server } from 'http';
import { JwtPayload } from 'jsonwebtoken';
import { Stream } from 'stream';

export type MulterFile = Express.Multer.File;
export type MulterFiles = Express.Multer.File[];

export type Maybe<T> = T | null;

export type UseJWTPayload = JwtPayload & {
  sub: number;
};
export interface Context {
  req: Request;
  res: Response;
  user: UseJWTPayload;
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
}

export interface UploadResponse {
  url: string;
  fileName?: string;
  type?: string;
}
