import { Field, InputType } from '@nestjs/graphql';
import { MinLength, MaxLength } from 'class-validator';

@InputType()
export default class UpdatePasswordDto {
  @Field(() => String)
  oldPassword: string;

  @Field(() => String)
  @MinLength(8)
  @MaxLength(256)
  newPassword: string;
}
