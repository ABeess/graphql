import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { In, Not } from 'typeorm';
import Friendship from '../entities/Friendship';
import Notification from '../entities/Notification';
import User from '../entities/User';
import UserRoom from '../entities/UserRoom';
import { AddFriendInput } from '../inputs/FriendShipInput';
import { QueryInput } from '../inputs/QueryInput';
import {
  AddFriendMutationResponse,
  FriendShipRecommendResponse,
  FriendShipRequestResponse,
} from '../response/FriendShipResponse';
import { GetFriendResponse } from '../response/UserResponse';
import { queryGenerate } from '../utils/queryGenerate';
import { generateError } from '../utils/responseError';

@Resolver()
export class FriendshipResolver {
  @Mutation(() => AddFriendMutationResponse)
  async addFriend(@Arg('data') data: AddFriendInput): Promise<AddFriendMutationResponse> {
    try {
      const { type, addressee, requester } = data;

      const userRoom = await UserRoom.findOneBy({
        userId: addressee.id,
      });

      if (type === 'accepted') {
        await Friendship.update(
          {
            requester: {
              id: In([requester.id, addressee.id]),
            },
            addressee: {
              id: In([requester.id, addressee.id]),
            },
          },
          {
            accepted: true,
          }
        );

        const newNotification = Notification.create({
          content: 'your friend request has been accepted',
          owner: addressee,
          requester,
          type: 'Friend accepted',
        });

        await newNotification.save();

        _io.to(userRoom?.room as string).emit('NOTIFICATION', newNotification);

        return {
          code: 200,
          message: 'Accepted Request request',
        };
      }

      const newFriend = Friendship.create({
        addressee: addressee,
        requester: requester,
      });

      await newFriend.save();

      const newNotification = Notification.create({
        content: 'sent you a friend request',
        owner: addressee,
        requester,
        type: 'Friend request',
      });

      await newNotification.save();

      // await pubsub.publish('SEND_FRIEND_REQUEST', { data: newNotification, room: addressee.id });

      _io.to(userRoom?.room as string).emit('NOTIFICATION', newNotification);

      return {
        code: 201,
        message: 'Send Friend request',
      };
    } catch (error) {
      console.log(error);
      return generateError(error);
    }
  }

  @Query(() => FriendShipRequestResponse)
  async getFriendRequest(
    @Arg('userId') id: string,
    @Arg('query', { nullable: true }) query: QueryInput
  ): Promise<FriendShipRequestResponse> {
    const { limit, page, skip } = queryGenerate(query);

    const [friendRequest, totalCount] = await Friendship.findAndCount({
      where: {
        addressee: {
          id,
        },
        accepted: false,
      },
      relations: {
        requester: true,
        addressee: true,
      },
      skip: skip,
      take: limit,
    });

    return {
      totalCount,
      totalPage: Math.ceil(totalCount / Number(limit)),
      perPage: totalCount <= Number(limit) ? 1 : limit,
      page,
      friendRequest: friendRequest,
    };
  }

  @Query(() => FriendShipRequestResponse)
  async friendWaiting(
    @Arg('userId') id: string,
    @Arg('query', { nullable: true }) query: QueryInput
  ): Promise<FriendShipRequestResponse> {
    const { limit, page, skip } = queryGenerate(query);

    const [friendRequest, totalCount] = await Friendship.findAndCount({
      where: {
        requester: {
          id,
        },
        accepted: false,
      },
      relations: {
        requester: true,
        addressee: true,
      },
      skip: skip,
      take: limit,
    });

    console.log(friendRequest);

    return {
      totalCount,
      totalPage: Math.ceil(totalCount / Number(limit)),
      perPage: totalCount <= Number(limit) ? 1 : limit,
      page,
      friendRequest: friendRequest,
    };
  }

  @Query(() => FriendShipRecommendResponse)
  async friendShipRecommend(
    @Arg('userId') id: string,
    @Arg('query', { nullable: true }) query: QueryInput
  ): Promise<FriendShipRecommendResponse> {
    const { limit, page, skip } = queryGenerate(query);
    const friend = await Friendship.find({
      where: [
        {
          addressee: { id },
        },
        {
          requester: { id },
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

    const [users, totalCount] = await User.findAndCount({
      where: {
        id: Not(In([...listId, id])),
      },
      take: limit,
      skip: skip,
    });
    return {
      users,
      totalCount: totalCount,
      totalPage: Math.ceil(totalCount / Number(limit)),
      perPage: totalCount < Number(limit) ? 1 : limit,
      page,
    };
  }

  @Query(() => GetFriendResponse)
  async getFriends(
    @Arg('userId') id: string,
    @Arg('query', { nullable: true }) query: QueryInput
  ): Promise<GetFriendResponse> {
    const { page, limit, skip } = queryGenerate(query);
    const listFriend = await Friendship.find({
      where: [
        {
          requester: { id },
          accepted: true,
        },
        {
          addressee: { id },
          accepted: true,
        },
      ],
      relations: ['addressee', 'requester'],
      take: limit,
      skip,
    });

    const listFriendId = listFriend.map((item) =>
      item.requester.id === id ? item.addressee.id : item.requester.id
    );

    const [userFriends, totalCount] = await User.findAndCount({
      where: {
        id: In([...new Set(listFriendId)]),
      },
    });

    return {
      friends: userFriends,
      totalCount,
      totalPage: Math.ceil(totalCount / Number(limit)),
      perPage: totalCount < Number(limit) ? 1 : limit,
      page,
    };
  }
}
