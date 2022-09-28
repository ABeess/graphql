import express from 'express';
import Post from '../entities/Post';
import uploadRouter from './upload';
import refreshTokenRouter from './refreshToken';
const Router = express.Router();

Router.use('/', uploadRouter);
Router.use('/', refreshTokenRouter);

Router.get('/post', async (_req, res) => {
  try {
    const comment = await Post.find({
      relations: ['like'],
    });

    res.status(200).json({
      comment,
    });
  } catch (error) {
    console.log(error);
  }
});

export default Router;
