import { Field, InputType } from '@nestjs/graphql';
import { MinLength, MaxLength, IsEmail } from 'class-validator';

@InputType()
export class CreateUserDto {
  @Field(() => String)
  @MinLength(1)
  @MaxLength(32)
  displayName: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @MinLength(8)
  @MaxLength(256)
  password: string;
}
