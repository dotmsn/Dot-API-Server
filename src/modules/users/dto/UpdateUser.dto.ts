import { Field, InputType } from "@nestjs/graphql";
import { MinLength, MaxLength, IsEmail } from 'class-validator';

@InputType()
export default class UpdateUserDto {
    @Field(() => String, { nullable: true })
    @MinLength(1)
    @MaxLength(32)
    displayName?: string;

    @Field(() => String, { nullable: true })
    @IsEmail()
    email?: string;

    @Field(() => String, { nullable: true })
    @MinLength(0)
    @MaxLength(256)
    bio?: string;
}
