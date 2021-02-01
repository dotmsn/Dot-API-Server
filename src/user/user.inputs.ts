import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
    @Field(() => String)
    username: string;

    @Field(() => String)
    email: string;

    @Field(() => String)
    password: string;
}

@InputType()
export class UpdateUserInput {
    @Field(() => String, { nullable: true })
    username?: string;

    @Field(() => String, { nullable: true })
    email?: string;

    @Field(() => String, { nullable: true })
    password?: string;
}
