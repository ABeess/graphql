import { v4 as uuid } from 'uuid';

interface FileName {
  fileName: string;
  type: string;
}

export const generateFileName = (originalname: string): FileName => {
  const fileType = originalname.split('.')[1];
  const newUuid = uuid().replace(/-/g, '');

  return {
    fileName: `${newUuid}.${fileType}`,
    type: `image*/${fileType}`,
  };
};
