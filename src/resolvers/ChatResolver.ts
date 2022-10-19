import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { In, Not } from 'typeorm';
import Conversation from '../entities/Conversation';
import Message from '../entities/Message';
import Participants from '../entities/Participants';
import UserRoom from '../entities/UserRoom';
import { CreateConversationInput, SendChatInput } from '../inputs/sendChatInput';
import { ConversationResponse, CreateConversationResponse } from '../response/ConversionResponse';
import { ListChatResponse, ListChatSideBarResponse } from '../response/MessageResponse';
import { generateError } from '../utils/responseError';

@Resolver()
export default class ChatResolver {
  @Query(() => ListChatSideBarResponse)
  async listSideBar(@Arg('userId') id: string): Promise<ListChatSideBarResponse> {
    try {
      const conversation = await Conversation.find({
        where: [
          {
            owner: {
              id,
            },
          },
          {
            receiver: {
              id,
            },
          },
        ],
        relations: ['owner', 'receiver'],
      });

      const listConversations = conversation.map((x) => x.id);

      const listParticipants = await Participants.find({
        where: {
          conversation: {
            id: In(listConversations),
          },
          user: {
            id: Not(id),
          },
        },
        relations: ['user', 'lastSendUser', 'conversation'],
      });

      return {
        code: 200,
        message: 'Get list chat sidebar',
        sidebar: listParticipants,
      };
    } catch (error) {
      return generateError(error);
    }
  }

  @Query(() => ConversationResponse)
  async getConversations(@Arg('userId') id: string): Promise<ConversationResponse> {
    try {
      const conversation = await Conversation.createQueryBuilder('conversation')
        .leftJoinAndSelect('conversation.owner', 'owner')
        .leftJoinAndSelect('conversation.receiver', 'receiver')
        .leftJoinAndSelect('conversation.lastSendUser', 'lastSendUser')
        .orWhere('owner.id  = :ownerId', { ownerId: id })
        .orWhere('receiver.id = :receiverId', {
          receiverId: id,
        })
        .leftJoinAndMapMany(
          'conversation.participants',
          'conversation.participants',
          'participants',
          'participants.user.id != :id',
          {
            id: id,
          }
        )
        .leftJoinAndSelect('participants.user', 'user')
        .orderBy('conversation.updatedAt', 'DESC')
        .getMany();

      return {
        code: 200,
        message: 'Get Conversation',
        conversations: conversation,
      };
    } catch (error) {
      return generateError(error);
    }
  }

  @Query(() => ListChatResponse)
  async getChats(@Arg('conversionId') conversionId: string): Promise<ListChatResponse> {
    try {
      const listChat = await Message.find({
        where: {
          conversation: {
            id: conversionId,
          },
        },
        relations: ['sender'],
        order: {
          createdAt: 'ASC',
        },
      });
      return {
        code: 200,
        message: 'Get Chat',
        chats: listChat,
      };
    } catch (error) {
      return generateError(error);
    }
  }

  @Mutation(() => CreateConversationResponse)
  async createConversation(
    @Arg('data') { senderId, receiverId }: CreateConversationInput
  ): Promise<CreateConversationResponse> {
    try {
      const type = receiverId.length === 1 ? 'private' : 'groups';

      const existingConversation = await Conversation.findOne({
        where: {
          owner: {
            id: In([...receiverId, senderId]),
          },
          receiver: {
            id: In([...receiverId, senderId]),
          },
          type: type,
        },
        relations: ['participants', 'participants.user', 'lastSendUser', 'receiver'],
      });

      console.log(existingConversation);

      if (existingConversation) {
        return {
          code: 200,
          message: '',
          conversation: existingConversation,
        };
      }

      const insertData = [senderId, ...receiverId].map((id) => {
        return {
          user: {
            id,
          },
        };
      });

      const participantInsert = await Participants.createQueryBuilder()
        .insert()
        .values(insertData)
        .returning('*')
        .execute();

      const listReceiverId = receiverId.map((id) => ({ id }));

      const newConversation = Conversation.create({
        owner: {
          id: senderId,
        },
        receiver: listReceiverId,
        type,
        participants: participantInsert.identifiers,
      });

      await newConversation.save();
      console.log(newConversation);

      const conversation = await Conversation.findOne({
        where: {
          id: newConversation.id,
        },
        relations: ['participants', 'participants.user', 'lastSendUser', 'receiver'],
      });

      return {
        conversation: conversation,
        code: 201,
        message: 'Create Room Chat',
      };
    } catch (error) {
      return generateError(error);
    }
  }

  @Mutation(() => Boolean)
  async sendMessage(@Arg('data') { message, sender, conversationId, receiveId }: SendChatInput) {
    try {
      const chanel = await UserRoom.find({
        where: {
          userId: In([...receiveId, sender.id]),
        },
      });

      Conversation.createQueryBuilder()
        .update()
        .set({ lastMessage: message, lastSendUser: sender })
        .where('id = :id', { id: conversationId })
        .execute();

      const room = chanel.map((x) => x.room);
      const newMessage = Message.create({
        conversation: {
          id: conversationId,
        },
        message,
        sender,
      });

      await newMessage.save();

      _io.to(room).emit('PRIVATE_CHAT', newMessage);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
