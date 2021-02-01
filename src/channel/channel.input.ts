import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FetchChannelInput {
    @Field(() => String)
    id: string;

    @Field(() => String, { nullable: true })
    type: string;
}
