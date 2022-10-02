import express, { Request, Response } from 'express';
import { isEmpty } from 'lodash';
import multer from 'multer';
import { BadRequestRest } from '../lib/errorHandle';
import { MulterFiles } from '../types/index';

import { uploadMultipleStore, uploadSingleStore } from '../utils/googleStorage';

const upload = multer({ storage: multer.memoryStorage() });

const Router = express.Router();

Router.post('/upload-single', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      throw new BadRequestRest('Missing the file to upload');
    }
    const uploader = uploadSingleStore(file);
    return res.status(200).json({
      code: 200,
      message: 'upload complete',
      upload: uploader,
    });
  } catch (error) {
    const code = error.code ? error.code : 500;
    return res.status(code).json({
      code,
      message: error.message || 'Interval server error' + error,
    });
  }
});

Router.post('/upload-multiple', upload.array('files'), async (req: Request, res: Response) => {
  try {
    const files = req.files as MulterFiles;
    if (isEmpty(files)) {
      throw new BadRequestRest('Missing the file to upload');
    }
    const uploader = uploadMultipleStore(files);
    return res.status(200).json({
      code: 200,
      message: 'upload complete',
      uploads: uploader,
    });
  } catch (error) {
    const code = error.code ? error.code : 500;
    return res.status(code).json({
      code,
      message: error.message || 'Interval server error' + error,
    });
  }
});

export default Router;
