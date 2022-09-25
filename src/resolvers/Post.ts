import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Image, Post } from '../entities';
import { PostInput } from '../inputs/CreateBookInput';
import { ImageInput } from '../inputs/ImageInput';
// import { authentication } from '../middleware/authentication';
import { PostResponse } from '../types/response';

@Resolver()
export default class PostResolver {
  @Query(() => [Post])
  // @UseMiddleware(authentication)
  async posts(): Promise<Post[]> {
    return await Post.find({
      relations: ['image', 'user'],
      order: {
        createdAt: 'DESC',
      },
    });
  }
  @Mutation(() => PostResponse)
  async createPost(
    @Arg('postInput') postInput: PostInput,
    @Arg('imageInput', () => [ImageInput]) imageInput: ImageInput[]
  ): Promise<PostResponse> {
    try {
      const image = await Image.createQueryBuilder()
        .insert()
        .values(imageInput)
        .returning('*')
        .execute();

      const post = Post.create({
        ...postInput,
        user: postInput.user,
        image: image.raw,
      });

      await post.save();

      return {
        code: 200,
        message: 'Post Create',
        post: post,
      };
    } catch (error) {
      return { code: 400, message: error.message };
    }
  }
}

// curl 'http://localhost:3089/graphql' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:3089' --data-binary '{"query":"mutation UploadImage($file: Upload!) {\n singleUpload(file: $file)\n}","variables":{"file":""}}' --compressed
