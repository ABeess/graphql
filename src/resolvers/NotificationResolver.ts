import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import Notification from '../entities/Notification';
import { NotificationInput } from '../inputs/NotificationInput';
import { QueryInput } from '../inputs/QueryInput';
import { authentication } from '../middleware/authentication';
import { MaskAsReadResponse, NotificationQueryResponse } from '../response/NotificationResponse';
import { queryGenerate } from '../utils/queryGenerate';
import { generateError } from '../utils/responseError';

@Resolver()
export default class NotificationResolver {
  @Query(() => NotificationQueryResponse)
  @UseMiddleware(authentication)
  async getNotification(
    @Arg('ownerId') id: string,
    @Arg('query', { nullable: true }) query: QueryInput
  ): Promise<NotificationQueryResponse> {
    const { limit, page, skip } = queryGenerate(query);

    const [notifications, totalCount] = await Notification.findAndCount({
      where: {
        owner: {
          id,
        },
      },
      relations: {
        requester: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: skip,
    });

    const [_, unreadCount] = await Notification.findAndCount({
      where: {
        owner: {
          id,
        },
        read: false,
      },
    });

    return {
      totalUnread: unreadCount,
      notifications,
      totalCount,
      totalPage: Math.ceil(totalCount / Number(limit)),
      perPage: limit,
      page,
    };
  }

  @Mutation(() => MaskAsReadResponse)
  // @UseMiddleware(authentication)
  async markAsRead(
    @Arg('notificationInput') query: NotificationInput
  ): Promise<MaskAsReadResponse> {
    try {
      const { type, notificationId = '', ownerId = '' } = query;

      if (type === 'single' && notificationId) {
        await Notification.update(
          { id: notificationId },
          {
            read: true,
          }
        );
        return {
          code: 200,
          message: 'Read single',
        };
      }
      if (type === 'multiple' && ownerId) {
        await Notification.update(
          { owner: { id: ownerId } },
          {
            read: true,
          }
        );
        return {
          code: 200,
          message: 'Read multiple',
        };
      }

      return {
        code: 400,
        message: 'Missing the params',
      };
    } catch (error) {
      return generateError(error);
    }
  }
}
