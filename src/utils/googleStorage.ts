import { Storage } from '@google-cloud/storage';
import path from 'path';
import { InternalServerRest } from '../lib/errorHandle';
import { MulterFile, MulterFiles, UploadResponse } from '../types/index';
import { generateFileName } from './generateFileName';

const storage = new Storage({
  keyFilename: path.join(__dirname, process.env.PATH_SECRET_STORAGE as string),
  projectId: process.env.PROJECT_ID_STORAGE,
});

const bucket = storage.bucket(process.env.NAME_STORAGE as string);

export const uploadSingleStore = (file: MulterFile): UploadResponse => {
  const { fileName, type } = generateFileName(file.originalname);

  const blob = bucket.file(fileName);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', (err) => {
    throw new InternalServerRest(err.message + err.name);
  });

  blobStream.end(file.buffer);

  return {
    url: `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
    type,
    fileName,
  };
};

export const uploadMultipleStore = (files: MulterFiles) => {
  const uploads = files.map((file) => {
    const { fileName, type } = generateFileName(file.originalname);
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (err) => {
      throw new InternalServerRest(err.message + err.name);
    });

    blobStream.end(file.buffer);

    return {
      url: `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
      type,
      fileName,
    };
  });

  return uploads;
};
