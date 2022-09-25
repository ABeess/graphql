import { Field, InputType } from 'type-graphql';
import Image from '../entities/Image';

@InputType()
export class ImageInput implements Partial<Image> {
  @Field()
  url: string;

  @Field()
  fileName?: string;

  @Field()
  type: string;
}
