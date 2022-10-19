import express from 'express';
import Conversation from '../entities/Conversation';
import refreshTokenRouter from './refreshToken';
import uploadRouter from './upload';

const Router = express.Router();

Router.use('/', uploadRouter);
Router.use('/', refreshTokenRouter);

Router.get('/post', async (_req, res) => {
  // await Conversation.findOne({
  //   where: {
  //     id: 'a2119f8f-8a6a-45d9-aa9f-b8d8b8075875',
  //     receiver: {
  //       id: 'a2119f8f-8a6a-45d9-aa9f-b8d8b8075875',
  //     },
  //   },
  //   relations: {
  //     receiver: true,
  //   },
  // });
  try {
    // const listChat = await Conversation.createQueryBuilder('conversion')
    //   .innerJoinAndMapMany(
    //     'conversion.receiver',
    //     'conversion.receiver',
    //     'receiver',
    //     'receiver.email NOT IN (:...email)',
    //     {
    //       email: ['abeesdevjs3@gmail.com'],
    //     }
    //   )
    //   .where('conversion.id = :id', { id: 'ad8d5196-24eb-4ea1-bd65-6ce056bb2844' })
    //   .getMany();

    // const existingConversation = await Conversation.find({
    //   relations: ['participants', 'participants.user', 'owner', 'receiver'],
    // });

    // const conversation = await Conversation.createQueryBuilder('conversation')
    //   .leftJoinAndSelect('conversation.owner', 'owner')
    //   .leftJoinAndSelect('conversation.receiver', 'receiver')
    //   .innerJoinAndMapMany(
    //     'conversation.participants',
    //     'conversation.participants',
    //     'participants',
    //     'participants.user.id NOT IN (:...id)',
    //     {
    //       id: ['5d72a9ca-26fa-49ed-932a-cc93bbda35b2'],
    //     }
    //   )
    //   .leftJoinAndSelect('participants.user', 'user')
    //   .where('owner.id = :ownerId', { ownerId: '5d72a9ca-26fa-49ed-932a-cc93bbda35b2' })
    //   .orWhere('receiver.id = :receiverId', {
    //     receiverId: '5d72a9ca-26fa-49ed-932a-cc93bbda35b2',
    //   })
    //   .getMany();

    // const conversation = await Conversation.createQueryBuilder('conversion')
    //   .leftJoinAndSelect('conversion.receiver', 'receiver')
    //   // .innerJoinAndMapMany(
    //   //   'conversion.receiver',
    //   //   'conversion.receiver',
    //   //   'receiver',
    //   //   'receiver.email NOT IN (:...email)',
    //   //   {
    //   //     email: ['abeesdevjs2@gmail.com'],
    //   //   }
    //   // )
    //   .getMany();

    const conversation = await Conversation.find({
      relations: ['participants', 'participants.user', 'lastSendUser', 'receiver'],
    });

    res.status(200).json({
      conversation,
    });
  } catch (error) {
    console.log(error);
  }
});

export default Router;
