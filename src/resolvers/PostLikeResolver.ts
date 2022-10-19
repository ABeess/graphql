import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import PostLike from '../entities/PostLike';
import { PostLikeQueryInput, PostLikeMutationInput } from '../inputs/LikeInput';
import { authentication } from '../middleware/authentication';
import {
  PostLikeMutationResponse,
  PostLikeQueryResponse,
  UnlikePostMutationResponse,
} from '../response/PostResponse';

import { generateError } from '../utils/responseError';

@Resolver()
export class PostLikeResolver {
  @Query(() => PostLikeQueryResponse)
  @UseMiddleware(authentication)
  async getLikeByPost(
    @Arg('data') { userId, postId }: PostLikeQueryInput
  ): Promise<PostLikeQueryResponse> {
    try {
      const existingUserLike = await PostLike.findOneBy({
        user: {
          id: userId,
        },
        post: {
          id: postId,
        },
      });

      const [likes, count] = await PostLike.findAndCount({
        where: {
          post: {
            id: postId,
          },
        },
        take: 3,
      });

      return {
        code: 200,
        message: 'Get Likes',
        likes,
        totalLike: count,
        currentLike: {
          like: existingUserLike ? true : false,
          type: existingUserLike?.type,
        },
      };
    } catch (error) {
      return {
        code: 500,
        message: 'Interval server' + error,
      };
    }
  }

  @Mutation(() => PostLikeMutationResponse)
  @UseMiddleware(authentication)
  async likePost(
    @Arg('data') { user, post, type }: PostLikeMutationInput
  ): Promise<PostLikeMutationResponse> {
    try {
      const existingLike = await PostLike.findOneBy({
        user: {
          id: user?.id,
        },
        post: {
          id: post?.id,
        },
      });

      if (existingLike) {
        const updateLike = await PostLike.createQueryBuilder()
          .update()
          .set({
            type,
          })
          .returning('*')
          .execute();

        return {
          code: 200,
          message: 'Like updated ',
          likes: updateLike.raw[0],
          currentLike: {
            like: true,
            type: updateLike.raw[0]?.type,
          },
        };
      }

      const newLike = PostLike.create({
        type,
        user,
        post,
      });
      await newLike.save();

      return {
        code: 201,
        message: 'create like  success',
        likes: newLike,
      };
    } catch (error) {
      return {
        code: 500,
        message: 'Interval server' + error,
      };
    }
  }

  @Mutation(() => UnlikePostMutationResponse)
  @UseMiddleware(authentication)
  async unLikePost(
    @Arg('data') { userId, postId }: PostLikeQueryInput
  ): Promise<UnlikePostMutationResponse> {
    try {
      console.log(userId);
      await PostLike.delete({
        post: {
          id: postId,
        },
        user: {
          id: userId,
        },
      });
      return {
        code: 200,
        message: 'unlike',
      };
    } catch (error) {
      return generateError(error);
    }
  }
}
