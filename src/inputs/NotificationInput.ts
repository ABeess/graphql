import { Field, InputType } from 'type-graphql';

@InputType()
export class NotificationInput {
  @Field()
  type: 'single' | 'multiple';

  @Field({ nullable: true })
  notificationId?: string;

  @Field({ nullable: true })
  ownerId?: string;
}
