import { withFilter } from 'graphql-subscriptions';
import { Arg, Mutation, Query, Resolver, Root, Subscription } from 'type-graphql';
import { In, Not } from 'typeorm';
import { Friendship } from '../entities/Friendship';
import { Notification } from '../entities/Notification';
import User from '../entities/User';
import { AddFriendInput } from '../inputs/FriendShipInput';
import { QueryInput } from '../inputs/QueryInput';
import {
  AddFriendMutationResponse,
  FriendShipRecommendResponse,
  FriendShipRequestResponse,
} from '../response/FriendShipResponse';
import { FriendshipPayload } from '../response/PayloadResponse';
import { pubsub } from '../utils/pubsub';
import { queryGenerate } from '../utils/queryGenerate';
import { generateError } from '../utils/responseError';

@Resolver()
export class FriendshipResolver {
  @Mutation(() => AddFriendMutationResponse)
  async addFriendMutation(@Arg('data') data: AddFriendInput): Promise<AddFriendMutationResponse> {
    try {
      const { type, addressee, requester } = data;

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

        await pubsub.publish('SEND_FRIEND_REQUEST', { data: newNotification, room: addressee.id });

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

      await pubsub.publish('SEND_FRIEND_REQUEST', { data: newNotification, room: addressee.id });

      return {
        code: 201,
        message: 'Send Friend request',
      };
    } catch (error) {
      console.log(error);
      return generateError(error);
    }
  }

  @Subscription({
    subscribe: withFilter(
      () => pubsub.asyncIterator(['SEND_FRIEND_REQUEST']),
      (payload: FriendshipPayload, args) => {
        return args.room === payload.room;
      }
    ),
  })
  littenJoinRoomRequest(
    @Root() payload: FriendshipPayload,
    @Arg('room') _room: string
  ): Notification {
    return payload.data;
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
      page: page,
    };
  }

  @Query(() => Boolean)
  async getFriends(@Arg('userId') id: string) {
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
    });

    console.log(listFriend);
    const listId = listFriend.map((item) =>
      item.requester.id === id ? item.addressee.id : item.requester.id
    );
    console.log(listId);
    return true;
  }
}
