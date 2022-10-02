import express, { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import User from '../entities/User';
import { UnauthorizedRest } from '../lib/errorHandle';
import { UseJWTPayload } from '../types/index';
import { generateToken } from '../utils/jwtManger';
const Router = express.Router();

Router.post('/refreshToken', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.session.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedRest('You are not authenticated');
    }

    const payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as UseJWTPayload;

    if (!payload) {
      throw new UnauthorizedRest('Token is not valid');
    }

    const existingUser = await User.findOne({
      where: {
        id: payload.sub,
      },
    });

    if (!existingUser) {
      throw new UnauthorizedRest('You are not authenticated');
    }

    const newAccessToken = generateToken({
      data: {
        sub: payload?.sub as string,
      },
      form: 'accessToken',
    });

    const newRefreshToken = generateToken({
      data: {
        sub: payload.sub as string,
      },
      form: 'refreshToken',
    });

    req.session.refreshToken = newRefreshToken;

    return res.status(200).json({
      code: 200,
      message: 'Refresh  accessToken',
      accessToken: newAccessToken,
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
