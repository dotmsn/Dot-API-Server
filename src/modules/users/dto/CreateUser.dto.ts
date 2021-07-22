import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateUserDto {
    @Field(() => String)
    displayName: string;

    @Field(() => String)
    email: string;

    @Field(() => String)
    password: string;
}
