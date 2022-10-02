import { isEmpty } from 'lodash';
import { Arg, Query, Resolver } from 'type-graphql';
import { In, Not } from 'typeorm';
import { Friendship } from '../entities/Friendship';
import User from '../entities/User';
import { HoverCardResponse } from '../response/HoverCardResponse';
import { UserNotCurrentResponse } from '../response/UserResponse';
import { generateError } from '../utils/responseError';

@Resolver()
export default class UserResolver {
  @Query(() => UserNotCurrentResponse)
  async getUserNotCurrent(@Arg('userId') id: string): Promise<UserNotCurrentResponse> {
    try {
      const friend = await Friendship.find({
        where: [
          {
            addressee: { id },
            accepted: true,
          },
          {
            requester: { id },
            accepted: true,
          },
        ],
        relations: {
          addressee: true,
          requester: true,
        },
      });

      const listId = friend.map((item) => {
        const addresseeId = item.addressee.id;
        const requesterId = item.requester.id;
        return addresseeId === id ? requesterId : addresseeId;
      });

      const users = await User.find({
        where: {
          id: Not(In([...listId, id])),
        },
      });
      return {
        code: 200,
        message: 'get User',
        users,
      };
    } catch (error) {
      return generateError(error);
    }
  }

  @Query(() => HoverCardResponse)
  async hoverCard(@Arg('userId') id: string): Promise<HoverCardResponse> {
    const friend = await Friendship.findOne({
      where: [
        { addressee: { id }, accepted: true },
        { requester: { id }, accepted: true },
      ],
    });

    const user = await User.findOne({
      where: {
        id,
      },
      relations: {
        profile: true,
      },
    });

    console.log(user);

    return {
      isFriend: !isEmpty(friend),
      user: user as User,
    };
  }
}
