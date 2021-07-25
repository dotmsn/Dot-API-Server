import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class UpdateUserDto {
    @Field(() => String, { nullable: true })
    displayName?: string;

    @Field(() => String, { nullable: true })
    email?: string;

    @Field(() => String, { nullable: true })
    password?: string;

    @Field(() => String, { nullable: true })
    bio?: string;
}
