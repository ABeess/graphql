import express from 'express';
import uploadRouter from './upload';
import refreshTokenRouter from './refreshToken';
import User from '../entities/User';
const Router = express.Router();

Router.use('/', uploadRouter);
Router.use('/', refreshTokenRouter);

Router.get('/post', async (_req, res) => {
  try {
    const comment = await User.find({
      relations: {},
    });

    res.status(200).json({
      comment,
    });
  } catch (error) {
    console.log(error);
  }
});

export default Router;
