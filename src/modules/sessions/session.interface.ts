import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../users/users.model";

@ObjectType()
export default class Session {
    @Field()
    accessToken: string;

    @Field()
    user: User;
}
