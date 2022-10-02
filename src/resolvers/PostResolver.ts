import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Image, Post } from '../entities';
import { PostInput } from '../inputs/CreateBookInput';
import { ImageInput } from '../inputs/ImageInput';
import { QueryInput } from '../inputs/QueryInput';
import { authentication } from '../middleware/authentication';
import { AllPostResponse, PostResponse } from '../response/PostResponse';
import { queryGenerate } from '../utils/queryGenerate';

@Resolver()
export default class PostResolver {
  @Query(() => AllPostResponse)
  @UseMiddleware(authentication)
  async postsQuery(
    @Arg('query', { nullable: true }) query: QueryInput,
    @Arg('userId', { nullable: true }) userId?: string
  ): Promise<AllPostResponse> {
    const { limit, page, skip } = queryGenerate(query);

    const [posts, count] = await Post.findAndCount({
      ...(userId && {
        where: {
          user: { id: userId },
        },
      }),
      relations: ['image', 'user'],
      loadRelationIds: {
        relations: ['comment'],
      },
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: skip,
    });

    return {
      posts: posts,
      totalCount: count,
      totalPage: Math.ceil(count / Number(limit)),
      perPage: limit,
      page: page,
    };
  }
  @Mutation(() => PostResponse)
  @UseMiddleware(authentication)
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
