import express from 'express';
import Post from '../entities/Post';
import uploadRouter from './upload';
const Router = express.Router();

Router.use('/', uploadRouter);

Router.get('/post', async (_req, res) => {
  try {
    const allPost = await Post.find({
      relations: ['user'],
    });

    // const allImgae = await Image.find({
    //   relations: ['post'],
    // });

    res.status(200).json({
      post: allPost,
    });
  } catch (error) {
    console.log(error);
  }
});

export default Router;
