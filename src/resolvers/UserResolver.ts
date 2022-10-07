import { isEmpty } from 'lodash';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { In, Not } from 'typeorm';
import { Friendship } from '../entities/Friendship';
import User from '../entities/User';
import UserProfile from '../entities/UserProfile';
import { UserInput, UserProfileInput } from '../inputs/UserProfileInput';
import { HoverCardResponse } from '../response/HoverCardResponse';
import {
  UpdateUserProfileResponse,
  UploadAvatarResponse,
  UserNotCurrentResponse,
} from '../response/UserResponse';
import { Maybe } from '../types/index';
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

  @Query(() => User)
  async getCurrentUser(@Arg('userId') id: string): Promise<Maybe<User>> {
    return await User.findOne({
      where: {
        id,
      },
      relations: {
        profile: true,
      },
    });
  }

  @Mutation(() => UpdateUserProfileResponse)
  async updateProfile(@Arg('data') data: UserProfileInput): Promise<UpdateUserProfileResponse> {
    const { firstName, lastName, user, ...other } = data;

    console.log(firstName);

    const existProfile = await UserProfile.findOne({
      where: {
        user: {
          id: user?.id,
        },
      },
    });

    const userUpdate = await User.createQueryBuilder()
      .update()
      .where('id = :id', {
        id: user?.id,
      })
      .set({
        firstName,
        lastName,
      })
      .returning('*')
      .execute();

    console.log(userUpdate);

    if (existProfile) {
      const updateProfile = await UserProfile.createQueryBuilder()
        .update()
        .where('userId = :userId', {
          userId: user?.id,
        })
        .set(other)
        .returning('*')
        .execute();

      console.log(updateProfile);

      return {
        code: 200,
        message: 'Update User Profile',
        profile: updateProfile.raw[0],
        user: userUpdate.raw[0],
      };
    }

    const newProfile = UserProfile.create({
      ...other,
      user,
    });

    await newProfile.save();

    return {
      code: 201,
      message: 'Update User Profile',
      profile: newProfile,
      user: userUpdate.raw[0],
    };
  }

  @Mutation(() => Boolean)
  async uploadAvatar(@Arg('userId') id: string, @Arg('url') url: string): Promise<boolean> {
    await User.update({ id }, { avatar: url });
    return true;
  }
}
