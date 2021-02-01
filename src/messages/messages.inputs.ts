import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
    @Field(() => String)
    content: string;

    @Field(() => String)
    channel: string;
}

@InputType()
export class FetchMessageInput {
    @Field(() => String)
    channel: string;

    @Field(() => Number, { nullable: true, defaultValue: 0 })
    index: number;
}

@InputType()
export class UpdateMessageInput {
    @Field(() => String)
    id: string;

    @Field(() => String)
    content: string;
}

@InputType()
export class DeleteMessageInput {
    @Field(() => String)
    id: string;
}
