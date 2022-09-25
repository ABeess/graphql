import { Request, Response } from 'express';
import { Stream } from 'stream';

export type MulterFile = Express.Multer.File;
export type MulterFiles = Express.Multer.File[];

export interface Context {
  req: Request;
  res: Response;
}

export interface UploadResponse {
  url: string;
  fileName?: string;
  type?: string;
}
