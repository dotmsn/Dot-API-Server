import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateSessionDto {
    @Field(() => String)
    email: string;

    @Field(() => String)
    password: string;
}
