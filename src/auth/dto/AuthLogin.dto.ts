import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class AuthLoginDto {
    @Field(() => String)
    email: string;

    @Field(() => String)
    password: string;
}
