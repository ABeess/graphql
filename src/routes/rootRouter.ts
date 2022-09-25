import express from 'express';
import Comment from '../entities/Comment';
import Post from '../entities/Post';
import uploadRouter from './upload';
const Router = express.Router();

Router.use('/', uploadRouter);

Router.get('/post', async (_req, res) => {
  try {
    const allPost = await Post.createQueryBuilder()
      .limit(2)
      .loadRelationCountAndMap('url', 'image')
      .getMany();
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
