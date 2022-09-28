import JWT, { Secret } from 'jsonwebtoken';

interface IData {
  sub?: string;
  role: string;
  [key: string]: any;
}

interface IGenerateToken {
  data: Partial<IData>;
  form: 'accessToken' | 'refreshToken';
}

export const generateToken = ({ data, form }: IGenerateToken): string => {
  const secret = (
    form === 'accessToken' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET
  ) as Secret;

  return JWT.sign({ ...data }, secret, { expiresIn: form === 'accessToken' ? '20m' : '365d' });
};
